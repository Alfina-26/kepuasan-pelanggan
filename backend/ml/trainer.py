import pandas as pd
import joblib, os, uuid
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from datetime import datetime

MODEL_DIR = "saved_models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Kolom yang tidak relevan untuk training (identitas pelanggan)
COLUMNS_TO_DROP = [
    "id", "timestamp", "name", "email", "phone",
    "location", "favoriteMenu", "feedback", "ratings"
]

def train_model(file_path: str, target_column: str, test_size: float = 0.2,
                max_depth: int = 10, min_samples_split: int = 2):

    ext = file_path.split(".")[-1]
    df = pd.read_csv(file_path) if ext == "csv" else pd.read_excel(file_path)

    # Hapus kolom identitas yang tidak relevan
    cols_to_drop = [c for c in COLUMNS_TO_DROP if c in df.columns]
    df = df.drop(columns=cols_to_drop)

    if target_column not in df.columns:
        raise ValueError(
            f"Kolom target '{target_column}' tidak ditemukan. "
            f"Kolom yang ada: {df.columns.tolist()}"
        )

    # Encode kolom kategorikal
    le_dict = {}
    for col in df.select_dtypes(include=["object"]).columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        le_dict[col] = le

    # Hapus baris yang value target-nya kosong
    df = df.dropna(subset=[target_column])

    X = df.drop(columns=[target_column])
    y = df[target_column]

    if len(df) < 5:
        raise ValueError("Data terlalu sedikit untuk training, minimal 5 baris")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )

    clf = DecisionTreeClassifier(
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        random_state=42
    )
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    model_id = str(uuid.uuid4())
    model_path = f"{MODEL_DIR}/{model_id}.pkl"
    joblib.dump({
        "model": clf,
        "feature_names": X.columns.tolist(),
        "label_encoders": le_dict
    }, model_path)

    return {
        "id": model_id,
        "model_name": f"Decision Tree - {datetime.now().strftime('%d/%m/%Y %H:%M')}",
        "accuracy":  round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, average="weighted", zero_division=0)), 4),
        "recall":    round(float(recall_score(y_test, y_pred, average="weighted", zero_division=0)), 4),
        "f1_score":  round(float(f1_score(y_test, y_pred, average="weighted", zero_division=0)), 4),
        "created_date": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "model_path": model_path,
        "total_data": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
    }