from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.trainer import train_model

router = APIRouter()

class TrainRequest(BaseModel):
    dataset_id: str
    target_column: str = "satisfaction"
    test_size: float = 0.2
    max_depth: int = 10
    min_samples_split: int = 2

# Import datasets_store dari dataset.py
from routes.dataset import datasets_store
models_store = []

@router.post("/start")
def start_training(body: TrainRequest):
    dataset = next((d for d in datasets_store if d["id"] == body.dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset tidak ditemukan")
    
    result = train_model(
        file_path=dataset["file_path"],
        target_column=body.target_column,
        test_size=body.test_size,
        max_depth=body.max_depth,
        min_samples_split=body.min_samples_split,
    )
    models_store.append(result)
    return {"message": "Model berhasil dilatih", "model": result}

@router.get("/models")
def get_models():
    return {"models": models_store}