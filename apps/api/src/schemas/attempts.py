from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True, serialize_by_alias=True)


class StartAttemptRequest(ApiModel):
    exam_id: UUID = Field(alias="examId")


class AttemptSummary(ApiModel):
    id: UUID
    exam_id: UUID = Field(alias="examId")
    status: str
    started_at: str = Field(alias="startedAt")
    expires_at: str = Field(alias="expiresAt")


class StartAttemptResponse(ApiModel):
    attempt: AttemptSummary


class AttemptResponsePayload(ApiModel):
    question_id: UUID = Field(alias="questionId")
    selected_option_id: UUID | None = Field(default=None, alias="selectedOptionId")
    marked_for_review: bool = Field(alias="markedForReview")


class AutosaveRequest(ApiModel):
    responses: list[AttemptResponsePayload]


class AutosaveResponse(ApiModel):
    attempt_id: UUID = Field(alias="attemptId")


class SubmitResponse(ApiModel):
    attempt_id: UUID = Field(alias="attemptId")
    status: str


class AttemptResultItem(ApiModel):
    question_id: UUID = Field(alias="questionId")
    is_correct: bool = Field(alias="isCorrect")
    selected_option_id: UUID | None = Field(default=None, alias="selectedOptionId")
    correct_option_id: UUID = Field(alias="correctOptionId")
    topics: list[str]


class WeakTopicItem(ApiModel):
    topic: str
    incorrect_count: int = Field(alias="incorrectCount")
    question_count: int = Field(alias="questionCount")


class AttemptResult(ApiModel):
    attempt_id: UUID = Field(alias="attemptId")
    score_percent: float = Field(alias="scorePercent")
    status: str
    items: list[AttemptResultItem]
    weak_topics: list[WeakTopicItem] = Field(default_factory=list, alias="weakTopics")


class AttemptResultResponse(ApiModel):
    result: AttemptResult


class AttemptListItem(ApiModel):
    id: UUID
    exam_id: UUID = Field(alias="examId")
    status: str
    score_percent: float | None = Field(default=None, alias="scorePercent")


class AttemptListResponse(ApiModel):
    items: list[AttemptListItem]
