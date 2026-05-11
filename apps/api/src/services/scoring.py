from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable
from uuid import UUID

from sqlalchemy.orm import Session

from src.models.attempt import Attempt
from src.models.attempt_response import AttemptResponse
from src.models.question import Question
from src.repositories.option_repository import OptionRepository
from src.repositories.question_repository import QuestionRepository


@dataclass
class ScoredItem:
    question_id: UUID
    selected_option_id: UUID | None
    correct_option_id: UUID
    topics: list[str]
    is_correct: bool


@dataclass
class WeakTopic:
    topic: str
    incorrect_count: int
    question_count: int


@dataclass
class ScoringResult:
    score_percent: float
    items: list[ScoredItem]
    weak_topics: list[WeakTopic]


def score_attempt(db: Session, attempt: Attempt) -> ScoringResult:
    questions = QuestionRepository(db).list_by_exam(attempt.exam_id)
    option_repo = OptionRepository(db)

    responses = (
        db.query(AttemptResponse).filter(AttemptResponse.attempt_id == attempt.id).all()
    )
    response_map = {response.question_id: response for response in responses}

    items: list[ScoredItem] = []
    incorrect_topics: dict[str, int] = {}
    total = len(questions)
    correct_count = 0

    for question in questions:
        correct_option = option_repo.get_correct_option(question.id)
        if not correct_option:
            continue

        response = response_map.get(question.id)
        selected_option_id = response.selected_option_id if response else None
        is_correct = selected_option_id == correct_option.id
        if is_correct:
            correct_count += 1
        else:
            for topic in question.topics:
                incorrect_topics[topic] = incorrect_topics.get(topic, 0) + 1

        items.append(
            ScoredItem(
                question_id=question.id,
                selected_option_id=selected_option_id,
                correct_option_id=correct_option.id,
                topics=list(question.topics),
                is_correct=is_correct,
            )
        )

    score_percent = round((correct_count / total) * 100, 2) if total else 0.0

    weak_topics = _summarize_weak_topics(incorrect_topics, questions)
    return ScoringResult(score_percent=score_percent, items=items, weak_topics=weak_topics)


def _summarize_weak_topics(incorrect_topics: dict[str, int], questions: Iterable[Question]) -> list[WeakTopic]:
    topic_totals: dict[str, int] = {}
    for question in questions:
        for topic in question.topics:
            topic_totals[topic] = topic_totals.get(topic, 0) + 1

    summary: list[WeakTopic] = []
    for topic, incorrect_count in incorrect_topics.items():
        question_count = topic_totals.get(topic, incorrect_count)
        summary.append(
            WeakTopic(
                topic=topic,
                incorrect_count=incorrect_count,
                question_count=question_count,
            )
        )

    return summary
