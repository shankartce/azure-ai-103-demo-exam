#!/bin/bash
set -e

echo "Running database migrations..."

# First, ensure alembic version table exists and is at correct state
# This handles the case where tables were created by SQLAlchemy but not tracked by Alembic
python -c "
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text
import os

config = Config('alembic.ini')
engine = create_engine(os.environ['DATABASE_URL'])

# Check if alembic_version table exists
inspector = inspect(engine)
if 'alembic_version' not in inspector.get_table_names():
    print('Alembic version table does not exist. Stamping at revision 0002...')
    command.stamp(config, '0002')
else:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version_num FROM alembic_version')).fetchone()
        if result is None:
            print('Alembic version table is empty. Stamping at revision 0002...')
            command.stamp(config, '0002')
        else:
            print(f'Current alembic version: {result[0]}')
"

# Now run migrations
alembic upgrade head

echo "Starting application..."
exec uvicorn src.main:app --host 0.0.0.0 --port $PORT
