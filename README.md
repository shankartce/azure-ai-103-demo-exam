# Azure AI-103 Practice Assessment (MVP)

Monorepo with:

- `apps/api`: FastAPI + SQLAlchemy + Alembic (Python 3.12)
- `apps/web`: Next.js 15 + React + Tailwind + ShadCN UI (Node.js 20)

## Local dev

### 1) Start Postgres

```bash
docker compose up -d db
```

### 2) API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn src.main:app --reload --port 8000
```

### 3) Web

```bash
cd apps/web
npm install
npm run dev
```

## Tests

```bash
cd apps/api && pytest
cd apps/web && npm test
```
