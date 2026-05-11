from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.attempt import Attempt


class AttemptRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, attempt_id: UUID | str) -> Attempt | None:
        stmt = select(Attempt).where(Attempt.id == attempt_id)
        return self.db.scalar(stmt)

    def get_active_attempt(self, user_id: UUID | str, exam_id: UUID | str) -> Attempt | None:
        stmt = (
            select(Attempt)
            .where(
                Attempt.user_id == user_id,
                Attempt.exam_id == exam_id,
                Attempt.status == "active",
            )
            .order_by(Attempt.created_at.desc())
        )
        return self.db.scalar(stmt)

    def list_by_user(self, user_id: UUID | str) -> list[Attempt]:
        stmt = select(Attempt).where(Attempt.user_id == user_id).order_by(Attempt.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def create(self, attempt: Attempt) -> Attempt:
        self.db.add(attempt)
        self.db.commit()
        self.db.refresh(attempt)
        return attempt
