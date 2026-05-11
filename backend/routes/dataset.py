from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import os, uuid

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

datasets_store = []

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["csv", "xlsx"]:
        raise HTTPException(status_code=400, detail="Format harus CSV atau XLSX")
    
    file_id = str(uuid.uuid4())
    save_path = f"{UPLOAD_DIR}/{file_id}.{ext}"
    
    content = await file.read()
    with open(save_path, "wb") as f:
        f.write(content)
    
    # Baca preview
    if ext == "csv":
        df = pd.read_csv(save_path)
    else:
        df = pd.read_excel(save_path)
    
    dataset = {
        "id": file_id,
        "filename": file.filename,
        "upload_date": pd.Timestamp.now().strftime("%d/%m/%Y %H:%M"),
        "status": "processed",
        "rows": len(df),
        "columns": df.columns.tolist(),
        "file_path": save_path,
    }
    datasets_store.append(dataset)
    
    return {
        "message": "Dataset berhasil diupload",
        "dataset": dataset,
        "sample": df.head(3).to_dict(orient="records"),
    }

@router.get("/list")
def list_datasets():
    return {"datasets": datasets_store}