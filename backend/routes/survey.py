from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

router = APIRouter()

class SurveyRequest(BaseModel):
    name: str
    email: str
    phone: str
    age: Optional[Any] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    visitFrequency: Optional[str] = None
    averageSpending: Optional[str] = None
    favoriteMenu: Optional[str] = None
    visitTime: Optional[str] = None
    foodQuality: Optional[Any] = None
    cleanliness: Optional[Any] = None
    serviceSpeed: Optional[Any] = None
    staffFriendliness: Optional[Any] = None
    priceValue: Optional[Any] = None
    menuVariety: Optional[Any] = None
    ambiance: Optional[Any] = None
    overallSatisfaction: Optional[Any] = None
    feedback: Optional[str] = None
    ratings: Optional[Any] = None

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