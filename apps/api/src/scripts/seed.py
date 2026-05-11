from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from src.core.settings import get_settings
from src.db.seed_demo import seed_demo


def main() -> None:
    settings = get_settings()
    engine = create_engine(settings.database_url, pool_pre_ping=True)
    with Session(engine) as session:
        seed_demo(session)


if __name__ == "__main__":
    main()
