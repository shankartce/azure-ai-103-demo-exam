from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str
    auto_create_tables: bool = True
    auto_seed_demo: bool = True
    # Comma-separated list in env, e.g. "http://localhost:3000,http://localhost:5173"
    cors_origins: str = ""

    def cors_origins_list(self) -> list[str]:
        if not self.cors_origins:
            return []
        items = [part.strip() for part in self.cors_origins.split(",")]
        return [i for i in items if i]


@lru_cache
def get_settings() -> Settings:
    return Settings()
