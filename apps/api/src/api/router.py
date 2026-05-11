from __future__ import annotations

from fastapi import APIRouter

from src.api.routers.attempts import router as attempts_router
from src.api.routers.auth import router as auth_router
from src.api.routers.exams import router as exams_router
from src.api.routers.health import router as health_router
from src.api.routers.questions import router as questions_router

router = APIRouter()
router.include_router(health_router)
router.include_router(auth_router)
router.include_router(exams_router)
router.include_router(questions_router)
router.include_router(attempts_router)
