from __future__ import annotations

from sqlalchemy.orm import Session

from src.models.exam import Exam
from src.models.option import Option
from src.models.question import Question


def _seed_exam(session: Session) -> tuple[Exam, Question, Question, Option, Option]:
    exam = Exam(
        title="AI-103 Practice",
        description="Scoring exam",
        duration_seconds=1800,
        is_published=True,
    )
    session.add(exam)
    session.flush()

    question_one = Question(
        exam_id=exam.id,
        prompt="What is Azure AI Search used for?",
        position=1,
        topics=["search"],
    )
    question_two = Question(
        exam_id=exam.id,
        prompt="What is Azure OpenAI used for?",
        position=2,
        topics=["openai"],
    )
    session.add_all([question_one, question_two])
    session.flush()

    correct_one = Option(
        question_id=question_one.id,
        text="Document indexing",
        is_correct=True,
        position=1,
    )
    incorrect_one = Option(
        question_id=question_one.id,
        text="Virtual networks",
        is_correct=False,
        position=2,
    )
    correct_two = Option(
        question_id=question_two.id,
        text="Generate completions",
        is_correct=True,
        position=1,
    )
    incorrect_two = Option(
        question_id=question_two.id,
        text="Build storage accounts",
        is_correct=False,
        position=2,
    )
    session.add_all([correct_one, incorrect_one, correct_two, incorrect_two])
    session.commit()

    return exam, question_one, question_two, correct_one, incorrect_two


def _login(client):
    payload = {"email": "runner3@example.com", "password": "SuperSecure!123"}
    client.post("/auth/signup", json=payload)
    client.post("/auth/login", json=payload)


def test_submit_scores_deterministically(client, db_session: Session):
    exam, question_one, question_two, correct_one, incorrect_two = _seed_exam(db_session)
    _login(client)

    start_response = client.post("/attempts/start", json={"examId": str(exam.id)})
    attempt_id = start_response.json()["attempt"]["id"]

    autosave = client.patch(
        f"/attempts/{attempt_id}/responses",
        json={
            "responses": [
                {
                    "questionId": str(question_one.id),
                    "selectedOptionId": str(correct_one.id),
                    "markedForReview": False,
                },
                {
                    "questionId": str(question_two.id),
                    "selectedOptionId": str(incorrect_two.id),
                    "markedForReview": False,
                },
            ]
        },
    )

    assert autosave.status_code == 200

    submit = client.post(f"/attempts/{attempt_id}/submit")
    assert submit.status_code == 200

    result = client.get(f"/attempts/{attempt_id}/result")
    assert result.status_code == 200

    body = result.json()["result"]
    assert body["status"] == "submitted"
    assert body["scorePercent"] == 50.0

    items = {item["questionId"]: item for item in body["items"]}
    assert items[str(question_one.id)]["isCorrect"] is True
    assert items[str(question_two.id)]["isCorrect"] is False
