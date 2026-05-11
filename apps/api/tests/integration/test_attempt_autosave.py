from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy.orm import Session

from src.models.attempt import Attempt
from src.models.exam import Exam
from src.models.option import Option
from src.models.question import Question


def _seed_exam(session: Session) -> tuple[Exam, Question, Option]:
    exam = Exam(
        title="AI-103 Practice",
        description="Intro exam",
        duration_seconds=1800,
        is_published=True,
    )
    session.add(exam)
    session.flush()

    question = Question(
        exam_id=exam.id,
        prompt="What is Azure AI Search used for?",
        position=1,
        topics=["search"],
    )
    session.add(question)
    session.flush()

    option = Option(question_id=question.id, text="Document indexing", is_correct=True, position=1)
    session.add(option)
    session.add(
        Option(question_id=question.id, text="Virtual networks", is_correct=False, position=2)
    )

    session.commit()
    return exam, question, option


def _login(client):
    payload = {"email": "runner2@example.com", "password": "SuperSecure!123"}
    client.post("/auth/signup", json=payload)
    client.post("/auth/login", json=payload)


def test_autosave_rejects_expired(client, db_session: Session):
    exam, question, option = _seed_exam(db_session)
    _login(client)

    start_response = client.post("/attempts/start", json={"examId": str(exam.id)})
    attempt_id = start_response.json()["attempt"]["id"]

    autosave = client.patch(
        f"/attempts/{attempt_id}/responses",
        json={
            "responses": [
                {
                    "questionId": str(question.id),
                    "selectedOptionId": str(option.id),
                    "markedForReview": True,
                }
            ]
        },
    )

    assert autosave.status_code == 200

    attempt = db_session.get(Attempt, attempt_id)
    attempt.expires_at = datetime.now(tz=UTC) - timedelta(minutes=1)
    db_session.commit()

    expired = client.patch(
        f"/attempts/{attempt_id}/responses",
        json={
            "responses": [
                {
                    "questionId": str(question.id),
                    "selectedOptionId": str(option.id),
                    "markedForReview": False,
                }
            ]
        },
    )

    assert expired.status_code == 409
