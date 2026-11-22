
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    complaint_id = Column(
        String(30),
        unique=True,
        index=True,
        nullable=False
    )

    category = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    photo_filename = Column(String(255), nullable=False)

    severity = Column(String(30), nullable=True)
    recommended_department = Column(String(255), nullable=True)

    ai_analysis = Column(Text, nullable=True)

    status = Column(
        String(50),
        default="Pending",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
