from __future__ import annotations

from sqlalchemy.orm import Session

from src.models.exam import Exam
from src.models.option import Option
from src.models.question import Question
from src.models.user import User
from src.utils.passwords import hash_password


def seed_demo(db: Session) -> None:
    admin_email = "admin@example.com"
    if not db.query(User).filter(User.email == admin_email).first():
        db.add(User(email=admin_email, password_hash=hash_password("AdminPass!123"), is_admin=True))

    existing_exam = db.query(Exam).filter(Exam.title == "AI-103 Practice").first()
    if existing_exam:
        db.commit()
        return

    exam = Exam(
        title="AI-103 Practice",
        description="Timed practice assessment for Azure AI",
        duration_seconds=3600,
        is_published=True,
    )
    db.add(exam)
    db.flush()

    questions = [
        (
            "What is Azure AI Search used for?",
            ["search"],
            [
                ("Document indexing", True),
                ("Virtual networks", False),
                ("Billing alerts", False),
            ],
        ),
        (
            "Which service provides OCR in Azure AI?",
            ["vision"],
            [
                ("Azure AI Vision", True),
                ("Azure SQL", False),
                ("Azure DNS", False),
            ],
        ),
        (
            "Which model family powers Azure OpenAI?",
            ["openai"],
            [
                ("GPT", True),
                ("BERT", False),
                ("ResNet", False),
            ],
        ),
        (
            "What is a key benefit of Azure AI Document Intelligence?",
            ["document"],
            [
                ("Extract structured data", True),
                ("Manage VMs", False),
                ("Route traffic", False),
            ],
        ),
        (
            "What does a vector index enable in Azure AI Search?",
            ["search"],
            [
                ("Similarity search", True),
                ("Key rotation", False),
                ("DNS routing", False),
            ],
        ),
    ]

    for idx in range(1, 16):
        questions.append(
            (
                f"Which Azure AI concept is highlighted in scenario {idx}?",
                ["fundamentals"],
                [
                    ("Monitoring model drift", True),
                    ("Sizing virtual networks", False),
                    ("Rotating storage keys", False),
                ],
            )
        )

    for idx, (prompt, topics, options) in enumerate(questions, start=1):
        question = Question(
            exam_id=exam.id,
            prompt=prompt,
            position=idx,
            topics=topics,
        )
        db.add(question)
        db.flush()

        for option_idx, (text, is_correct) in enumerate(options, start=1):
            db.add(
                Option(
                    question_id=question.id,
                    text=text,
                    is_correct=is_correct,
                    position=option_idx,
                )
            )

    db.commit()
