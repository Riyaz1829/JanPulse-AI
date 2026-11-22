
import json
import uuid
from datetime import datetime

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Complaint
from app.services.gemini_service import analyze_civic_complaint

router = APIRouter(
    prefix="/api/complaints",
    tags=["Complaints"]
)


@router.post("/submit")
async def submit_complaint(
    category: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if photo.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed."
        )

    image_data = await photo.read()

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must not exceed 5 MB."
        )

    if (
        not category.strip()
        or not location.strip()
        or not description.strip()
    ):
        raise HTTPException(
            status_code=400,
            detail="All complaint fields are required."
        )

    try:
        ai_analysis = await analyze_civic_complaint(
            image_data=image_data,
            mime_type=photo.content_type,
            citizen_description=description,
            location=location
        )

    except Exception as error:
        print(f"Gemini AI analysis error: {error}")

        raise HTTPException(
            status_code=502,
            detail="AI analysis failed. Please try again later."
        )

    if not ai_analysis.get("is_civic_issue", False):
        return {
            "success": False,
            "message": "The uploaded image is not accepted as a civic issue.",
            "ai_analysis": ai_analysis
        }

    complaint_id = (
        f"JP-{datetime.now().strftime('%Y%m%d')}-"
        f"{uuid.uuid4().hex[:8].upper()}"
    )

    complaint = Complaint(
        complaint_id=complaint_id,
        category=category.strip(),
        location=location.strip(),
        description=description.strip(),
        photo_filename=photo.filename or "uploaded_image",
        severity=ai_analysis.get("severity"),
        recommended_department=ai_analysis.get(
            "recommended_department"
        ),
        ai_analysis=json.dumps(ai_analysis),
        status="Pending"
    )

    try:
        db.add(complaint)
        db.commit()
        db.refresh(complaint)

    except Exception as error:
        db.rollback()
        print(f"Database save error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to save complaint. Please try again."
        )

    return {
        "success": True,
        "message": "Complaint registered successfully.",
        "complaint_id": complaint.complaint_id,
        "complaint": {
            "category": complaint.category,
            "location": complaint.location,
            "description": complaint.description,
            "photo_filename": complaint.photo_filename,
            "severity": complaint.severity,
            "recommended_department": complaint.recommended_department,
            "status": complaint.status
        },
        "ai_analysis": ai_analysis
    }


@router.get("/{complaint_id}")
def track_complaint(
    complaint_id: str,
    db: Session = Depends(get_db)
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.complaint_id == complaint_id)
        .first()
    )

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found. Please check your complaint ID."
        )

    return {
        "success": True,
        "complaint": {
            "complaint_id": complaint.complaint_id,
            "category": complaint.category,
            "location": complaint.location,
            "description": complaint.description,
            "severity": complaint.severity,
            "recommended_department": complaint.recommended_department,
            "status": complaint.status,
            "created_at": (
                complaint.created_at.isoformat()
                if complaint.created_at else None
            ),
            "ai_analysis": (
                json.loads(complaint.ai_analysis)
                if complaint.ai_analysis else None
            )
        }
    }
