from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models for metadata discovery.
# noqa: F401
from src.models.attempt import Attempt
from src.models.attempt_response import AttemptResponse
from src.models.exam import Exam
from src.models.option import Option
from src.models.question import Question
from src.models.user import User
