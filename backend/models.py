from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="customer")  # admin | developer | customer
    created_at = Column(DateTime, default=datetime.utcnow)

    surveys = relationship("Survey", back_populates="user")


class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Data pelanggan
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    age = Column(String)
    gender = Column(String)
    location = Column(String)

    # Data kunjungan
    visit_frequency = Column(String)
    average_spending = Column(String)
    favorite_menu = Column(String)
    visit_time = Column(String)

    # Rating
    food_quality = Column(Float)
    cleanliness = Column(Float)
    service_speed = Column(Float)
    staff_friendliness = Column(Float)
    price_value = Column(Float)
    menu_variety = Column(Float)
    ambiance = Column(Float)
    overall_satisfaction = Column(Float)

    # Feedback
    feedback = Column(Text)
    ratings = Column(Text)  # disimpan sebagai JSON string

    user = relationship("User", back_populates="surveys")