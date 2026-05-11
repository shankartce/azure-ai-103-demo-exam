from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.question import Question


class QuestionRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_by_exam(self, exam_id: UUID | str) -> list[Question]:
        stmt = (
            select(Question)
            .where(Question.exam_id == exam_id)
            .order_by(Question.position.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, question_id: UUID | str) -> Question | None:
        stmt = select(Question).where(Question.id == question_id)
        return self.db.scalar(stmt)
