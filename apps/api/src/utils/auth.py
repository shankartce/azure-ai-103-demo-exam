from __future__ import annotations

from dataclasses import dataclass

from fastapi import Cookie, Depends, HTTPException, status

from src.core.settings import Settings, get_settings
from src.utils.jwt import decode_jwt


SESSION_COOKIE_NAME = "session"


@dataclass(frozen=True)
class CurrentUser:
    user_id: str
    is_admin: bool


def get_current_user(
    session: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    settings: Settings = Depends(get_settings),
) -> CurrentUser:
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_jwt(secret=settings.jwt_secret, token=session)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session") from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

    return CurrentUser(user_id=str(user_id), is_admin=bool(payload.get("is_admin", False)))
