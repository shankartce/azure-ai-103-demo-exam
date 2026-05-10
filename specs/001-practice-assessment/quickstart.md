# Quickstart: Azure AI Certification Practice Assessment Platform (MVP)

**Feature**: 001-practice-assessment  
**Date**: 2026-05-10

This quickstart describes the intended local developer workflow for the modular monolith (`apps/web` + `apps/api`). It will be fully runnable once the repository scaffolding is implemented.

## Prerequisites

- Docker + Docker Compose
- Node.js 20 LTS
- Python 3.12

## Repository layout

```text
apps/
  web/   # Next.js 15
  api/   # FastAPI

docker-compose.yml
```

## Local environment

### 1) Start Postgres (and local services)

From repo root:

- `docker compose up -d`

Expected:
- Postgres is available on `localhost:5433`

### 2) Run API (FastAPI)

From `apps/api`:

- create a virtualenv
- install dependencies
- run migrations
- start dev server

Expected:
- API available on `http://localhost:8000`
- OpenAPI docs available on `http://localhost:8000/docs`

### 3) Run Web (Next.js)

From `apps/web`:

- install dependencies
- start dev server

Expected:
- Web available on `http://localhost:3000`

## Seed demo content

The MVP should include a seed command/script that creates:
- one published exam
- 20–50 questions with options and topic tags
- one admin user

## Run tests

- API: `pytest`
- Web unit: `vitest`
- Web E2E: `playwright test`

## Common troubleshooting

- If AI endpoints fail, the platform should still allow:
  - taking exams
  - submitting/scoring
  - reviewing deterministic results
