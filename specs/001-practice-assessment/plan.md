# Implementation Plan: Azure AI Certification Practice Assessment Platform (MVP)

**Branch**: `001-practice-assessment` | **Date**: 2026-05-10 | **Spec**: ./spec.md
**Input**: Feature specification from `specs/001-practice-assessment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a Microsoft Learn-style, timed practice assessment experience with deterministic scoring, post-submit review, and AI-assisted explanations/recommendations/tutor chat. Implement as a modular monolith with two deployable apps: a Next.js web frontend (`apps/web`) and a FastAPI backend (`apps/api`) backed by PostgreSQL.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Python 3.12 (API), TypeScript (Web), Node.js 20 LTS (Web)  
**Primary Dependencies**: FastAPI, SQLAlchemy 2.x, Pydantic v2, Alembic (API) + Next.js 15, React, TailwindCSS, ShadCN UI, Zustand, React Query (Web)  
**Storage**: PostgreSQL (system of record)  
**Testing**: pytest (API unit/integration), Playwright (Web E2E), Vitest (Web unit)  
**Target Platform**: Linux containers (Docker-first), optional Vercel for web + Azure App Service for API
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Autosave and navigation endpoints feel instant (target <250ms p95 locally); AI calls return quickly enough to feel integrated (target median <5s)  
**Constraints**: Deterministic scoring; one active attempt per user per exam; typed API contracts; mobile-responsive UX; no microservices/CQRS/event buses/workflow engines  
**Scale/Scope**: Portfolio-ready MVP (2–4 weeks solo), designed to extend to multi-exam and future RAG

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Scope control**: Confirms work is directly in service of the timed exam core.
- **Architecture**: Confirms modular monolith (no microservices / CQRS / event buses / workflow engines).
- **Determinism**: Confirms scoring/correctness is deterministic; AI is assistive only.
- **Stack invariants**: Confirms the feature fits Next.js 15 (frontend) + FastAPI/SQLAlchemy/Pydantic (backend) + PostgreSQL.
- **Quality gates**: Confirms typed/validated API contracts, attempt lifecycle preserved, UI remains responsive/mobile.
- **Testing**: Identifies critical paths touched and lists required automated tests.

**Result**: PASS (no constitution violations required)

**Critical-path tests REQUIRED for this MVP**:
- Auth: signup/login/me (happy path + invalid creds)
- Attempt lifecycle: start, autosave responses, submit, auto-submit on expiry
- Scoring: deterministic correctness and score computation from persisted answer keys
- Admin gating: non-admin denied admin actions

## Project Structure

### Documentation (this feature)

```text
specs/001-practice-assessment/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
apps/
├── api/
│   ├── src/
│   │   ├── api/                # FastAPI routers
│   │   ├── core/               # settings, logging, error handling
│   │   ├── db/                 # SQLAlchemy engine/session + migrations
│   │   ├── models/             # SQLAlchemy models
│   │   ├── repositories/       # DB access layer
│   │   ├── schemas/            # Pydantic request/response models
│   │   ├── services/           # business logic (auth/exam/attempt/ai/analytics)
│   │   └── utils/              # security, auth helpers, AI client
│   └── tests/
│       ├── unit/
│       └── integration/
└── web/
  ├── src/
  │   ├── app/                # Next.js App Router routes
  │   ├── components/
  │   ├── stores/             # Zustand
  │   ├── lib/                # API client, auth helpers
  │   └── styles/
  └── tests/
    ├── unit/
    └── e2e/

docs/
├── architecture/
├── api/
├── sdd/
└── diagrams/

infra/

docker-compose.yml
README.md
```

**Structure Decision**: Modular monolith with two deployable apps (`apps/web`, `apps/api`). The backend owns auth, exam logic, persistence, scoring, AI calls, and analytics aggregation. The frontend owns routing, presentation, and client state.

## Execution Outline (high level)

1. **Repo + foundations**: monorepo scaffolding, Docker Compose, Postgres, migrations.
2. **Auth**: email/password, JWT sessions, protected routes, admin gating.
3. **Content model**: exams/questions/options/topics; seed script for demo content.
4. **Attempt lifecycle**: start/resume, autosave, submit/expire, deterministic scoring.
5. **Results + analytics**: score breakdown, weak topics, attempt history.
6. **AI assist**: explanation/recommendations/tutor endpoints with strict boundaries (no scoring).
7. **Frontend**: Learn-style runner UX (timer, palette, review flags) + results pages + admin CRUD.
8. **Tests + polish**: critical-path automated tests + responsive/dark mode polish.

## Backend Architecture

### Layers

- **API routers**: HTTP and request/response wiring only
- **Service layer**: business logic (auth, exams, attempts, scoring, AI boundaries)
- **Repository layer**: database access
- **SQLAlchemy models**: persistence
- **Pydantic schemas**: request/response validation
- **Utilities**: auth/security helpers and Azure OpenAI client setup

### Services

- `AuthService`
- `ExamService`
- `QuestionService`
- `AttemptService`
- `AIService`
- `AnalyticsService`

### Backend rules

- Scoring correctness is deterministic and computed from persisted answer keys.
- Routers stay thin; business logic is in services.
- Repositories are the only layer that touches the database session.
- All input/output is validated with Pydantic models.
- Errors use the standardized envelope defined in `contracts/common.md`.

## Frontend Architecture

### State management

- React Query: server state (exams, questions, attempts, results, admin CRUD)
- Zustand: active attempt runner state (local UI state + optimistic response caching)

### Pages (App Router)

- Landing
- Login / signup
- Dashboard
- Exam list + exam detail
- Attempt runner
- Result/review
- Admin: exams + questions CRUD
- Analytics: score history + weak topics

### Key UI components

- Timer
- Question card
- Option list
- Question palette
- Progress bar
- Submission confirmation modal
- Score card
- Weak topics card
- AI explanation panel
- Tutor chat drawer

## API Surface (MVP)

The detailed request/response shapes live in `contracts/`.

### Auth
- POST `/auth/signup`
- POST `/auth/login`
- GET `/auth/me`

### Exams
- GET `/exams`
- GET `/exams/{exam_id}`
- POST `/exams` (admin)
- PATCH `/exams/{exam_id}` (admin)
- DELETE `/exams/{exam_id}` (admin)

### Questions
- GET `/exams/{exam_id}/questions`
- POST `/questions` (admin)
- PATCH `/questions/{question_id}` (admin)
- DELETE `/questions/{question_id}` (admin)

### Attempts
- POST `/attempts/start`
- PATCH `/attempts/{attempt_id}/responses`
- POST `/attempts/{attempt_id}/submit`
- GET `/attempts/{attempt_id}/result`
- GET `/attempts/me`

### AI
- POST `/ai/explanations`
- POST `/ai/recommendations`
- POST `/ai/tutor/chat`

### Analytics
- GET `/analytics/score-history`
- GET `/analytics/weak-topics`
- GET `/analytics/completion-metrics`

## AI Integration Plan

- Use Azure OpenAI with compact prompts for:
  - explanations
  - study recommendations
  - tutor chat
- Responses are short, structured JSON where possible and validated server-side.
- AI never changes correctness or score; AI operates only on submitted attempt data.

## Security Plan

- Hash passwords with a strong algorithm (Argon2id).
- Sign JWT access tokens and validate on protected routes.
- Protect admin routes with explicit admin checks.
- Validate all input (Pydantic) and enforce invariants (attempt status, expiry).
- Add basic rate limiting on auth and AI endpoints (MVP-safe approach).
- Store secrets in environment variables.

## Testing Plan

- **Unit tests**: auth helpers, scoring, attempt status transitions, AI prompt formatting/validation.
- **API tests**: auth, attempt lifecycle (start/autosave/submit/expire), admin CRUD gating.
- **E2E tests**: login, take exam, submit, view results.

## Deployment Plan

- **Local**: Docker Compose for API + Postgres (and optionally web if containerized).
- **Production**:
  - Web: Vercel or container hosting
  - API: Azure App Service (container)
  - DB: managed PostgreSQL
  - Optional: Redis for caching/rate limiting (post-MVP)

## Build Order

1. Repo setup and shared conventions
2. Auth and database foundation
3. Exam and attempt APIs
4. Frontend exam runner
5. Scoring and result pages
6. AI explanations and tutor
7. Admin CRUD and analytics
8. Tests, polish, and deployment

## Acceptance Criteria

- All core flows work end-to-end: auth → attempt → submit/expire → results.
- The UI is responsive and demo-ready with dark mode.
- The backend exposes OpenAPI documentation.
- The implementation is modular and extendable without restructuring.

## Constitution Re-check (post-design)

PASS: Modular monolith preserved; deterministic scoring enforced; AI remains assistive; stack invariants respected; critical-path tests explicitly planned.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

None expected for this MVP.
