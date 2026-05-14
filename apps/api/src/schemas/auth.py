from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True, serialize_by_alias=True)


class SignupRequest(ApiModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(ApiModel):
    email: EmailStr
    password: str


class UserOut(ApiModel):
    id: UUID
    email: EmailStr
    name: str
    is_admin: bool = Field(alias="isAdmin")


class UserResponse(ApiModel):
    user: UserOut
