from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, survey, dataset, training, prediction
from database import Base, engine
from models import User, Survey

# 1. Definisikan app dulu
app = FastAPI(title="API Kepuasan Pelanggan")

# 2. Baru tambahkan middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",  # ← tambahkan ini
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Buat tabel
Base.metadata.create_all(bind=engine)

# 4. Include router
app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(survey.router,     prefix="/api/survey",     tags=["Survey"])
app.include_router(dataset.router,    prefix="/api/dataset",    tags=["Dataset"])
app.include_router(training.router,   prefix="/api/training",   tags=["Training"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["Prediction"])