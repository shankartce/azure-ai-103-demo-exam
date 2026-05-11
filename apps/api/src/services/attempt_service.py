from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.models.attempt import Attempt
from src.repositories.attempt_repository import AttemptRepository
from src.repositories.attempt_response_repository import AttemptResponseRepository
from src.repositories.exam_repository import ExamRepository
from src.repositories.option_repository import OptionRepository
from src.repositories.question_repository import QuestionRepository
from src.services.scoring import score_attempt


class AttemptService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.attempts = AttemptRepository(db)
        self.responses = AttemptResponseRepository(db)
        self.exams = ExamRepository(db)
        self.questions = QuestionRepository(db)
        self.options = OptionRepository(db)

    def start_attempt(self, *, user_id: str, exam_id: str) -> Attempt:
        exam = self.exams.get_by_id(exam_id)
        if not exam or not exam.is_published:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")

        now = datetime.now(tz=UTC)
        active = self.attempts.get_active_attempt(user_id, exam_id)
        if active:
            if active.expires_at <= now:
                active.status = "expired"
                self.db.add(active)
                self.db.commit()
            else:
                return active

        attempt = Attempt(
            user_id=user_id,
            exam_id=exam_id,
            status="active",
            started_at=now,
            expires_at=now + timedelta(seconds=exam.duration_seconds),
        )
        return self.attempts.create(attempt)

    def autosave(self, *, user_id: str, attempt_id: str, payloads: list[dict]) -> None:
        attempt = self._get_owned_attempt(user_id, attempt_id)
        self._ensure_active(attempt)

        now = datetime.now(tz=UTC)
        if attempt.expires_at <= now:
            attempt.status = "expired"
            self.db.add(attempt)
            self.db.commit()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Attempt expired")

        for payload in payloads:
            question_id = payload["question_id"]
            selected_option_id = payload.get("selected_option_id")
            marked_for_review = payload.get("marked_for_review", False)

            question = self.questions.get_by_id(question_id)
            if not question or question.exam_id != attempt.exam_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Question does not belong to this exam",
                )

            if selected_option_id:
                option = self.options.get_for_question(question.id, selected_option_id)
                if not option:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Selected option is invalid",
                    )

            self.responses.upsert(
                attempt_id=attempt.id,
                question_id=question.id,
                selected_option_id=selected_option_id,
                marked_for_review=marked_for_review,
            )

        self.db.commit()

    def submit(self, *, user_id: str, attempt_id: str) -> Attempt:
        attempt = self._get_owned_attempt(user_id, attempt_id)

        if attempt.status in {"submitted", "expired"}:
            return attempt

        now = datetime.now(tz=UTC)
        if attempt.expires_at <= now:
            attempt.status = "expired"
        else:
            attempt.status = "submitted"

        scoring = score_attempt(self.db, attempt)
        attempt.score_percent = scoring.score_percent
        attempt.submitted_at = now
        self.db.add(attempt)
        self.db.commit()
        self.db.refresh(attempt)
        return attempt

    def get_result(self, *, user_id: str, attempt_id: str):
        attempt = self._get_owned_attempt(user_id, attempt_id)
        if attempt.status not in {"submitted", "expired"}:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Attempt is not finalized",
            )

        scoring = score_attempt(self.db, attempt)
        if attempt.score_percent is None:
            attempt.score_percent = scoring.score_percent
            self.db.add(attempt)
            self.db.commit()
            self.db.refresh(attempt)

        return attempt, scoring

    def _get_owned_attempt(self, user_id: str, attempt_id: str) -> Attempt:
        attempt = self.attempts.get_by_id(attempt_id)
        if not attempt or str(attempt.user_id) != str(user_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found")
        return attempt

    def _ensure_active(self, attempt: Attempt) -> None:
        if attempt.status != "active":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Attempt is not active",
            )
