from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from src.core.settings import Settings, get_settings
from src.db.session import get_db
from src.schemas.auth import LoginRequest, SignupRequest, UserResponse
from src.services.auth_service import AuthService, SESSION_TTL_SECONDS
from src.utils.auth import CurrentUser, SESSION_COOKIE_NAME, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def signup(
    payload: SignupRequest,
    response: Response,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    service = AuthService(db, settings)
    user, token = service.signup(email=payload.email, password=payload.password)
    
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=SESSION_TTL_SECONDS,
        path="/",
    )
    return UserResponse(user=user)


@router.post("/login", response_model=UserResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    service = AuthService(db, settings)
    user, token = service.login(email=payload.email, password=payload.password)

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=SESSION_TTL_SECONDS,
        path="/",
    )
    return UserResponse(user=user)


@router.get("/me", response_model=UserResponse)
def me(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    service = AuthService(db, settings)
    user = service.get_user(current_user.user_id)
    return UserResponse(user=user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/")
    return None
