
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.api.complaints import router as complaints_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JanPulse AI",
    description="AI-Powered Civic Intelligence and Grievance Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints_router)


@app.get("/")
def home():
    return {
        "project": "JanPulse AI",
        "message": "Civic Intelligence API is running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
