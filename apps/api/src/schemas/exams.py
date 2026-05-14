from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True, serialize_by_alias=True)


class ExamSummary(ApiModel):
    id: UUID
    title: str
    description: str | None
    duration_seconds: int = Field(alias="durationSeconds")
    question_count: int = Field(alias="questionCount")


class ExamListResponse(ApiModel):
    items: list[ExamSummary]
    next_cursor: str | None = Field(default=None, alias="nextCursor")


class ExamDetail(ApiModel):
    id: UUID
    title: str
    description: str | None
    duration_seconds: int = Field(alias="durationSeconds")
    question_count: int = Field(alias="questionCount")


class ExamDetailResponse(ApiModel):
    exam: ExamDetail


class QuestionOption(ApiModel):
    id: UUID
    position: int
    text: str


class QuestionOut(ApiModel):
    id: UUID
    exam_id: UUID = Field(alias="examId")
    position: int
    prompt: str
    topics: list[str]
    options: list[QuestionOption]


class QuestionListResponse(ApiModel):
    items: list[QuestionOut]
