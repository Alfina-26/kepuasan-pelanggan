import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Any
from database import get_db
from models import Survey, User
from routes.auth import SECRET_KEY, ALGORITHM
from jose import JWTError, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
security = HTTPBearer(auto_error=False)


# ── Schema ────────────────────────────────────────────────────
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


# ── Helper: ambil user dari token (optional) ─────────────────
def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            return None
        return db.query(User).filter(User.username == username).first()
    except JWTError:
        return None


def survey_to_dict(s: Survey) -> dict:
    return {
        "id": s.id,
        "timestamp": s.timestamp.isoformat(),
        "name": s.name,
        "email": s.email,
        "phone": s.phone,
        "age": s.age,
        "gender": s.gender,
        "location": s.location,
        "visitFrequency": s.visit_frequency,
        "averageSpending": s.average_spending,
        "favoriteMenu": s.favorite_menu,
        "visitTime": s.visit_time,
        "foodQuality": s.food_quality,
        "cleanliness": s.cleanliness,
        "serviceSpeed": s.service_speed,
        "staffFriendliness": s.staff_friendliness,
        "priceValue": s.price_value,
        "menuVariety": s.menu_variety,
        "ambiance": s.ambiance,
        "overallSatisfaction": s.overall_satisfaction,
        "feedback": s.feedback,
        "ratings": json.loads(s.ratings) if s.ratings else None,
        "user_id": s.user_id,
    }


# ── POST /survey/submit ────────────────────────────────────────
@router.post("/submit")
def submit_survey(
    body: SurveyRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    survey = Survey(
        user_id=current_user.id if current_user else None,
        name=body.name,
        email=body.email,
        phone=body.phone,
        age=str(body.age) if body.age is not None else None,
        gender=body.gender,
        location=body.location,
        visit_frequency=body.visitFrequency,
        average_spending=body.averageSpending,
        favorite_menu=body.favoriteMenu,
        visit_time=body.visitTime,
        food_quality=float(body.foodQuality) if body.foodQuality is not None else None,
        cleanliness=float(body.cleanliness) if body.cleanliness is not None else None,
        service_speed=float(body.serviceSpeed) if body.serviceSpeed is not None else None,
        staff_friendliness=float(body.staffFriendliness) if body.staffFriendliness is not None else None,
        price_value=float(body.priceValue) if body.priceValue is not None else None,
        menu_variety=float(body.menuVariety) if body.menuVariety is not None else None,
        ambiance=float(body.ambiance) if body.ambiance is not None else None,
        overall_satisfaction=float(body.overallSatisfaction) if body.overallSatisfaction is not None else None,
        feedback=body.feedback,
        ratings=json.dumps(body.ratings) if body.ratings is not None else None,
    )
    db.add(survey)
    db.commit()
    db.refresh(survey)

    return {"message": "Survey berhasil disimpan", "id": survey.id}


# ── GET /survey/all ────────────────────────────────────────────
@router.get("/all")
def get_all_surveys(db: Session = Depends(get_db)):
    surveys = db.query(Survey).order_by(Survey.timestamp.desc()).all()
    return {"surveys": [survey_to_dict(s) for s in surveys], "total": len(surveys)}


# ── GET /survey/history/{email} ────────────────────────────────
@router.get("/history/{email}")
def get_survey_history(email: str, db: Session = Depends(get_db)):
    surveys = db.query(Survey).filter(Survey.email == email).order_by(Survey.timestamp.desc()).all()
    return {"surveys": [survey_to_dict(s) for s in surveys]}


# ── GET /survey/my-history (pakai token login) ─────────────────
@router.get("/my-history")
def get_my_survey_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Login diperlukan")
    surveys = db.query(Survey).filter(Survey.user_id == current_user.id).order_by(Survey.timestamp.desc()).all()
    return {"surveys": [survey_to_dict(s) for s in surveys], "total": len(surveys)}