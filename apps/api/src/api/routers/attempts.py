from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.schemas.attempts import (
    AttemptListResponse,
    AttemptResultResponse,
    AutosaveRequest,
    AutosaveResponse,
    StartAttemptRequest,
    StartAttemptResponse,
    SubmitResponse,
)
from src.services.attempt_service import AttemptService
from src.services.scoring import ScoringResult
from src.utils.auth import CurrentUser, get_current_user

router = APIRouter(prefix="/attempts", tags=["attempts"])


@router.post("/start", response_model=StartAttemptResponse)
def start_attempt(
    payload: StartAttemptRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempt = AttemptService(db).start_attempt(
        user_id=current_user.user_id, exam_id=str(payload.exam_id)
    )

    return StartAttemptResponse(
        attempt={
            "id": attempt.id,
            "exam_id": attempt.exam_id,
            "status": attempt.status,
            "started_at": attempt.started_at.isoformat(),
            "expires_at": attempt.expires_at.isoformat(),
        }
    )


@router.patch("/{attempt_id}/responses", response_model=AutosaveResponse)
def autosave_responses(
    attempt_id: str,
    payload: AutosaveRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payloads = [response.model_dump() for response in payload.responses]
    AttemptService(db).autosave(
        user_id=current_user.user_id, attempt_id=attempt_id, payloads=payloads
    )
    return AutosaveResponse(attempt_id=attempt_id)


@router.post("/{attempt_id}/submit", response_model=SubmitResponse)
def submit_attempt(
    attempt_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempt = AttemptService(db).submit(user_id=current_user.user_id, attempt_id=attempt_id)
    return SubmitResponse(attempt_id=attempt.id, status=attempt.status)


@router.get("/{attempt_id}/result", response_model=AttemptResultResponse)
def get_result(
    attempt_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempt, scoring = AttemptService(db).get_result(
        user_id=current_user.user_id, attempt_id=attempt_id
    )
    return AttemptResultResponse(result=_map_result(attempt.id, attempt.status, scoring))


@router.get("/me", response_model=AttemptListResponse)
def list_attempts(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempts = AttemptService(db).attempts.list_by_user(current_user.user_id)
    items = [
        {
            "id": attempt.id,
            "exam_id": attempt.exam_id,
            "status": attempt.status,
            "score_percent": attempt.score_percent,
        }
        for attempt in attempts
    ]
    return AttemptListResponse(items=items)


def _map_result(attempt_id: str, status: str, scoring: ScoringResult):
    return {
        "attempt_id": attempt_id,
        "score_percent": scoring.score_percent,
        "status": status,
        "items": [
            {
                "question_id": item.question_id,
                "is_correct": item.is_correct,
                "selected_option_id": item.selected_option_id,
                "correct_option_id": item.correct_option_id,
                "topics": item.topics,
            }
            for item in scoring.items
        ],
        "weak_topics": [
            {
                "topic": weak.topic,
                "incorrect_count": weak.incorrect_count,
                "question_count": weak.question_count,
            }
            for weak in scoring.weak_topics
        ],
    }
