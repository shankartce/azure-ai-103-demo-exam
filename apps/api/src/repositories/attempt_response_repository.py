from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.attempt_response import AttemptResponse


class AttemptResponseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_attempt_and_question(
        self, attempt_id: UUID | str, question_id: UUID | str
    ) -> AttemptResponse | None:
        stmt = select(AttemptResponse).where(
            AttemptResponse.attempt_id == attempt_id,
            AttemptResponse.question_id == question_id,
        )
        return self.db.scalar(stmt)

    def upsert(
        self,
        *,
        attempt_id: UUID | str,
        question_id: UUID | str,
        selected_option_id: UUID | None,
        marked_for_review: bool,
    ) -> AttemptResponse:
        existing = self.get_by_attempt_and_question(attempt_id, question_id)
        answered_at = datetime.now(tz=UTC) if selected_option_id else None

        if existing:
            existing.selected_option_id = selected_option_id
            existing.marked_for_review = marked_for_review
            existing.answered_at = answered_at
            self.db.add(existing)
            return existing

        response = AttemptResponse(
            attempt_id=attempt_id,
            question_id=question_id,
            selected_option_id=selected_option_id,
            marked_for_review=marked_for_review,
            answered_at=answered_at,
        )
        self.db.add(response)
        return response
