from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from datetime import datetime

router = APIRouter()

class SurveyRequest(BaseModel):
    name: str
    email: str
    phone: str
    age: int
    gender: str
    location: Optional[str] = None
    visit_frequency: Optional[str] = None
    average_spending: Optional[str] = None
    food_quality: int       # rating 1-5
    cleanliness: int
    service_speed: int
    staff_friendliness: int
    price_value: int
    menu_variety: int
    ambiance: int
    overall_satisfaction: int
    feedback: Optional[str] = None

# Simpan ke list sementara (ganti dengan database di produksi)
survey_data = []

@router.post("/submit")
def submit_survey(body: SurveyRequest):
    survey = {
        "id": len(survey_data) + 1,
        "timestamp": datetime.now().isoformat(),
        **body.dict()
    }
    survey_data.append(survey)
    return {"message": "Survey berhasil disimpan", "id": survey["id"]}

@router.get("/all")
def get_all_surveys():
    return {"surveys": survey_data, "total": len(survey_data)}

@router.get("/history/{email}")
def get_survey_history(email: str):
    history = [s for s in survey_data if s["email"] == email]
    return {"surveys": history}