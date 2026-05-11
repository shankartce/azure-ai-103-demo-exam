from __future__ import annotations

from sqlalchemy.orm import Session

from src.models.exam import Exam
from src.models.option import Option
from src.models.question import Question


def _seed_exam(session: Session) -> Exam:
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

    session.add_all(
        [
            Option(question_id=question.id, text="Document indexing", is_correct=True, position=1),
            Option(question_id=question.id, text="Virtual networks", is_correct=False, position=2),
        ]
    )

    session.commit()
    return exam


def _login(client):
    payload = {"email": "runner@example.com", "password": "SuperSecure!123"}
    client.post("/auth/signup", json=payload)
    client.post("/auth/login", json=payload)


def test_start_attempt_returns_existing(client, db_session: Session):
    exam = _seed_exam(db_session)
    _login(client)

    first = client.post("/attempts/start", json={"examId": str(exam.id)})
    assert first.status_code == 200
    attempt_id = first.json()["attempt"]["id"]

    second = client.post("/attempts/start", json={"examId": str(exam.id)})
    assert second.status_code == 200
    assert second.json()["attempt"]["id"] == attempt_id
