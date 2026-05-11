import pandas as pd
import joblib, os, uuid
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from datetime import datetime

MODEL_DIR = "saved_models"
os.makedirs(MODEL_DIR, exist_ok=True)

def train_model(file_path: str, target_column: str, test_size: float = 0.2,
                max_depth: int = 10, min_samples_split: int = 2):
    ext = file_path.split(".")[-1]
    df = pd.read_csv(file_path) if ext == "csv" else pd.read_excel(file_path)
    
    if target_column not in df.columns:
        raise ValueError(f"Kolom target '{target_column}' tidak ditemukan")
    
    # Encode kolom kategorikal
    le = LabelEncoder()
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = le.fit_transform(df[col].astype(str))
    
    X = df.drop(columns=[target_column])
    y = df[target_column]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42
    )
    
    clf = DecisionTreeClassifier(max_depth=max_depth, min_samples_split=min_samples_split)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    
    model_id = str(uuid.uuid4())
    model_path = f"{MODEL_DIR}/{model_id}.pkl"
    joblib.dump({"model": clf, "feature_names": X.columns.tolist()}, model_path)
    
    return {
        "id": model_id,
        "model_name": f"Decision Tree - {datetime.now().strftime('%d/%m/%Y %H:%M')}",
        "accuracy":  float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, average="weighted", zero_division=0)),
        "recall":    float(recall_score(y_test, y_pred, average="weighted", zero_division=0)),
        "f1_score":  float(f1_score(y_test, y_pred, average="weighted", zero_division=0)),
        "created_date": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "model_path": model_path,
    }