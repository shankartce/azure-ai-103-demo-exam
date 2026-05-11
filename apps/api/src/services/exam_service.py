from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.exam import Exam
from src.models.question import Question
from src.repositories.exam_repository import ExamRepository


class ExamService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.exams = ExamRepository(db)

    def list_published(self) -> list[tuple[Exam, int]]:
        stmt = (
            select(Exam, func.count(Question.id))
            .outerjoin(Question, Question.exam_id == Exam.id)
            .where(Exam.is_published.is_(True))
            .group_by(Exam.id)
            .order_by(Exam.title.asc())
        )
        return list(self.db.execute(stmt).all())

    def get_published(self, exam_id: str) -> tuple[Exam, int] | None:
        stmt = (
            select(Exam, func.count(Question.id))
            .outerjoin(Question, Question.exam_id == Exam.id)
            .where(Exam.id == exam_id, Exam.is_published.is_(True))
            .group_by(Exam.id)
        )
        row = self.db.execute(stmt).first()
        if not row:
            return None
        return row[0], row[1]
