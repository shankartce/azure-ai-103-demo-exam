from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.repositories.exam_repository import ExamRepository
from src.repositories.option_repository import OptionRepository
from src.repositories.question_repository import QuestionRepository
from src.schemas.exams import QuestionListResponse, QuestionOption, QuestionOut

router = APIRouter(prefix="/exams", tags=["questions"])


@router.get("/{exam_id}/questions", response_model=QuestionListResponse)
def list_questions(exam_id: str, db: Session = Depends(get_db)):
    exam_repo = ExamRepository(db)
    exam = exam_repo.get_by_id(exam_id)
    if not exam or not exam.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")

    question_repo = QuestionRepository(db)
    option_repo = OptionRepository(db)
    questions = question_repo.list_by_exam(exam_id)

    items: list[QuestionOut] = []
    for question in questions:
        options = option_repo.list_by_question(question.id)
        items.append(
            QuestionOut(
                id=question.id,
                exam_id=question.exam_id,
                position=question.position,
                prompt=question.prompt,
                topics=list(question.topics),
                options=[
                    QuestionOption(id=option.id, position=option.position, text=option.text)
                    for option in options
                ],
            )
        )

    return QuestionListResponse(items=items)
