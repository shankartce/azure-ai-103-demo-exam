from __future__ import annotations

from fastapi import Depends, HTTPException, status

from src.utils.auth import CurrentUser, get_current_user


def require_admin(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
