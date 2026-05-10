<!--
Sync Impact Report

- Version change: template placeholders → 0.1.0
- Modified principles: Initialized and defined 7 product principles (no renames; template placeholders removed)
- Added sections: Constraints & Invariants; Workflow, Quality Gates & Definition of Done
- Removed sections: None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/tasks-template.md
	- ✅ .specify/templates/spec-template.md (no changes required)
	- N/A .specify/templates/commands/*.md (folder not present)
- Follow-up TODOs: None
-->

# Azure AI Apps & Agents Practice Assessment MVP Constitution

## Core Principles

### 1. Ship the exam core first
- The primary deliverable is a realistic, timed practice assessment experience.
- Any work that does not improve exam authoring, exam delivery, attempt lifecycle, scoring, or review MUST be deprioritized.
- “Nice-to-have” features MUST be cut if they delay a demo-ready MVP.

### 2. Prefer simple modularity over distributed complexity
- The system MUST be a modular monolith (single backend service + single frontend app).
- Do NOT introduce microservices, message buses, event-driven orchestration, or multi-repo complexity in the MVP.
- Favor clear module boundaries (folders, interfaces, schemas) over infrastructure boundaries.

### 3. Keep AI assistive, not authoritative
- Correctness and scoring MUST be deterministic and auditable (rule-based, explicit answer keys).
- AI MAY generate explanations, study recommendations, and tutoring responses.
- AI MUST NOT decide whether an answer is correct, nor modify scoring outcomes.

### 4. Optimize for clarity and speed
- Prefer explicit code and schemas over hidden magic.
- Prefer low-friction patterns that GitHub Copilot can extend predictably.
- Keep the happy path fast: reduce steps, reduce configuration, reduce unnecessary abstractions.

### 5. Design for extension
- Every layer MUST be ready to extend into: multi-exam support, subscriptions, future RAG, and mobile clients.
- Extension readiness means: stable contracts, clear module boundaries, and avoided dead ends (hard-coded single-exam assumptions).

### 6. Make the demo look polished
- The UI MUST feel like Microsoft Learn practice assessments: clean, consistent, and professional.
- Visual polish is a first-class requirement, not a post-MVP afterthought.
- UX MUST remain responsive and mobile-friendly.

### 7. Test critical paths
- The following MUST have automated tests whenever changed:
	- Authentication (email/password + JWT issuance/refresh as implemented)
	- Exam attempt lifecycle (start → answer → submit → results)
	- Scoring and correctness rules
	- Submission and persistence behavior
- Contract changes (API request/response shape) MUST include contract-level validation tests.

## Constraints & Invariants

### Engineering invariants (non-negotiable)
- **Frontend**: Next.js 15 + React + TypeScript + TailwindCSS + ShadCN UI + Zustand + React Query
- **Backend**: FastAPI + Python + SQLAlchemy + Pydantic
- **Database**: PostgreSQL
- **AI**: Azure OpenAI only (explanations, recommendations, tutor)
- **Auth**: JWT-based email/password authentication
- **Deployment**: Docker-first; target Azure App Service or Vercel + PostgreSQL

### Non-negotiable constraints (MVP scope control)
- Do NOT introduce microservices.
- Do NOT introduce CQRS, event buses, or workflow engines.
- Do NOT implement OAuth, deep RBAC, multi-tenancy, or native mobile in the MVP.
- Do NOT allow AI to determine correctness.
- Do NOT add features that delay a demo-ready build.

## Workflow, Quality Gates & Definition of Done

### Quality gates (for any change)
A change is acceptable only if it:
- Preserves a modular folder structure (clear domains/modules; no “misc” dumping grounds).
- Keeps API contracts typed and validated (Pydantic models; strict request/response shapes).
- Does not break the exam attempt lifecycle.
- Adds or updates tests where appropriate (mandatory for critical paths).
- Keeps the UI responsive and mobile-friendly.

### Definition of Done (feature-level)
A feature is done when:
- It works end-to-end in the UI and API.
- It is persisted in PostgreSQL if needed.
- It is documented in the relevant markdown file(s) for the feature.
- It has automated test coverage for critical paths.
- It is consistent with the architecture plan and task breakdown.

### Decision rule (when in doubt)
- Choose the simplest implementation that is production-minded.
- Prefer explicit code and schemas over hidden magic.
- Prefer stable UX over clever UX.
- Prefer deterministic backend behavior over AI-driven inference.

## Governance

### Authority
- This constitution supersedes planning templates and implementation preferences.
- If a plan, spec, or tasks list conflicts with this constitution, the plan/spec/tasks MUST be amended.

### Amendments
- Any amendment MUST include:
	- The reason for the change (what it enables or prevents)
	- The scope impact (what becomes in/out of scope)
	- Any migration notes needed for in-flight work

### Versioning policy
- Semantic versioning is used: MAJOR.MINOR.PATCH.
	- **MAJOR**: Backward-incompatible governance changes or principle removals/redefinitions.
	- **MINOR**: New principle/section added or materially expanded guidance.
	- **PATCH**: Clarifications, wording fixes, non-semantic refinements.

### Compliance checks
- Every implementation plan MUST include a “Constitution Check” section with explicit pass/fail notes.
- Every PR/change set MUST be reviewed against:
	- MVP scope constraints
	- Deterministic scoring rule
	- Testing requirements for critical paths

**Version**: 0.1.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
