from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.option import Option


class OptionRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_by_question(self, question_id: UUID | str) -> list[Option]:
        stmt = select(Option).where(Option.question_id == question_id).order_by(Option.position.asc())
        return list(self.db.scalars(stmt).all())

    def get_for_question(self, question_id: UUID | str, option_id: UUID | str) -> Option | None:
        stmt = select(Option).where(Option.id == option_id, Option.question_id == question_id)
        return self.db.scalar(stmt)

    def get_correct_option(self, question_id: UUID | str) -> Option | None:
        stmt = select(Option).where(Option.question_id == question_id, Option.is_correct.is_(True))
        return self.db.scalar(stmt)
