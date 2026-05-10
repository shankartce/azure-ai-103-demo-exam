from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

import jwt


def encode_jwt(*, secret: str, subject: str, expires_in_seconds: int, claims: dict[str, Any] | None = None) -> str:
    now = datetime.now(tz=UTC)
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=expires_in_seconds)).timestamp()),
    }
    if claims:
        payload.update(claims)
    return jwt.encode(payload, secret, algorithm="HS256")


def decode_jwt(*, secret: str, token: str) -> dict[str, Any]:
    return jwt.decode(token, secret, algorithms=["HS256"])
