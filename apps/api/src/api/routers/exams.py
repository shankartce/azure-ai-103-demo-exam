from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.schemas.exams import ExamDetailResponse, ExamListResponse, ExamSummary
from src.services.exam_service import ExamService

router = APIRouter(prefix="/exams", tags=["exams"])


@router.get("", response_model=ExamListResponse)
def list_exams(db: Session = Depends(get_db)):
    service = ExamService(db)
    rows = service.list_published()
    items = [
        ExamSummary(
            id=exam.id,
            title=exam.title,
            description=exam.description,
            duration_seconds=exam.duration_seconds,
            question_count=count,
        )
        for exam, count in rows
    ]

    return ExamListResponse(items=items, next_cursor=None)


@router.get("/{exam_id}", response_model=ExamDetailResponse)
def get_exam(exam_id: str, db: Session = Depends(get_db)):
    service = ExamService(db)
    row = service.get_published(exam_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")

    exam, count = row
    return ExamDetailResponse(
        exam={
            "id": exam.id,
            "title": exam.title,
            "description": exam.description,
            "duration_seconds": exam.duration_seconds,
            "question_count": count,
        }
    )
