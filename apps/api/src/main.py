from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from src.api.router import router as api_router
from src.core.errors import error_envelope
from src.core.logging import configure_logging
from src.core.settings import get_settings
from src.db.base import Base
from src.db.session import get_engine
import src.models  # noqa: F401


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()

    app = FastAPI(title="Practice Assessment API")

    cors_origins = settings.cors_origins_list()
    if cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException):
        details = {"raw": exc.detail} if exc.detail is not None else {}
        return JSONResponse(
            status_code=exc.status_code,
            content=error_envelope("http_error", "Request failed", details),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content=error_envelope("validation_error", "Validation failed", {"errors": exc.errors()}),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_: Request, __: Exception):
        return JSONResponse(
            status_code=500,
            content=error_envelope("internal_error", "Unhandled server error"),
        )

    app.include_router(api_router)

    if settings.auto_create_tables:
        @app.on_event("startup")
        def ensure_tables() -> None:
            Base.metadata.create_all(bind=get_engine())

    return app


app = create_app()
