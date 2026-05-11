from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib, pandas as pd

router = APIRouter()

from routes.training import models_store

class PredictRequest(BaseModel):
    model_id: str
    input_data: dict  # {"age": 25, "gender": "F", "purchase_frequency": 12, ...}

@router.post("/predict")
def predict(body: PredictRequest):
    model_info = next((m for m in models_store if m["id"] == body.model_id), None)
    if not model_info:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan")
    
    saved = joblib.load(model_info["model_path"])
    clf = saved["model"]
    features = saved["feature_names"]
    
    input_df = pd.DataFrame([body.input_data])
    
    # Pastikan kolom sesuai urutan training
    for col in features:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[features]
    
    prediction = clf.predict(input_df)[0]
    probability = max(clf.predict_proba(input_df)[0])
    
    return {
        "result": str(prediction),
        "probability": float(probability),
        "model_used": model_info["model_name"]
    }