from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.core.settings import Settings
from src.repositories.user_repository import UserRepository
from src.utils.jwt import encode_jwt
from src.utils.passwords import hash_password, verify_password

SESSION_TTL_SECONDS = 60 * 60 * 12


class AuthService:
    def __init__(self, db: Session, settings: Settings) -> None:
        self.db = db
        self.settings = settings
        self.users = UserRepository(db)

    def signup(self, *, name: str, email: str, password: str):
        normalized = email.strip().lower()
        if self.users.get_by_email(normalized):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        user = self.users.create(email=normalized, name=name.strip(), password_hash=hash_password(password))
        
        token = encode_jwt(
            secret=self.settings.jwt_secret,
            subject=str(user.id),
            expires_in_seconds=SESSION_TTL_SECONDS,
            claims={"is_admin": user.is_admin},
        )
        return user, token

    def login(self, *, email: str, password: str):
        normalized = email.strip().lower()
        user = self.users.get_by_email(normalized)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        token = encode_jwt(
            secret=self.settings.jwt_secret,
            subject=str(user.id),
            expires_in_seconds=SESSION_TTL_SECONDS,
            claims={"is_admin": user.is_admin},
        )
        return user, token

    def get_user(self, user_id: str):
        user = self.users.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user
