from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, survey, dataset, training, prediction

app = FastAPI(title="API Kepuasan Pelanggan")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(survey.router,     prefix="/api/survey",     tags=["Survey"])
app.include_router(dataset.router,    prefix="/api/dataset",    tags=["Dataset"])
app.include_router(training.router,   prefix="/api/training",   tags=["Training"])
app.include_router(prediction.router, prefix="/api/prediction", tags=["Prediction"])