from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.exam import Exam


class ExamRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, exam_id: UUID | str) -> Exam | None:
        stmt = select(Exam).where(Exam.id == exam_id)
        return self.db.scalar(stmt)

    def list_published(self) -> list[Exam]:
        stmt = select(Exam).where(Exam.is_published.is_(True)).order_by(Exam.title.asc())
        return list(self.db.scalars(stmt).all())
