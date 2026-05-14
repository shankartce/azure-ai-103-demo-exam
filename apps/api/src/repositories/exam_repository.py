from __future__ import annotations

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.exam import Exam
from src.models.question import Question


class ExamRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, exam_id: UUID | str) -> Exam | None:
        stmt = select(Exam).where(Exam.id == exam_id)
        return self.db.scalar(stmt)

    def list_published(self) -> list[tuple[Exam, int]]:
        stmt = (
            select(Exam, func.count(Question.id).label("question_count"))
            .outerjoin(Question, Question.exam_id == Exam.id)
            .where(Exam.is_published.is_(True))
            .group_by(Exam.id)
            .order_by(Exam.title.asc())
        )
        return list(self.db.execute(stmt).all())

    def get_published_with_count(self, exam_id: UUID | str) -> tuple[Exam, int] | None:
        stmt = (
            select(Exam, func.count(Question.id).label("question_count"))
            .outerjoin(Question, Question.exam_id == Exam.id)
            .where(Exam.id == exam_id, Exam.is_published.is_(True))
            .group_by(Exam.id)
        )
        row = self.db.execute(stmt).first()
        return row if row else None
