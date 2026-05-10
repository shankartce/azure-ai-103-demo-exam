from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class ErrorEnvelope(BaseModel):
    error: dict[str, Any]


def error_envelope(code: str, message: str, details: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"error": {"code": code, "message": message, "details": details or {}}}
