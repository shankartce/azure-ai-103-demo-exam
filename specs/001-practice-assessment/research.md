# Research: Azure AI Certification Practice Assessment Platform (MVP)

**Feature**: 001-practice-assessment  
**Date**: 2026-05-10

This document resolves implementation-affecting unknowns and records key technical decisions for the MVP.

## Decisions

### 1) Auth session strategy (JWT)
- **Decision**: Use JWT access tokens for protected routes. Store the token in an HttpOnly cookie (SameSite=Lax) to reduce accidental exposure. Keep the MVP simple by not implementing refresh tokens.
- **Rationale**: Meets the “JWT sessions” invariant while avoiding the complexity of refresh rotation and multi-token revocation in the MVP.
- **Alternatives considered**:
  - LocalStorage token storage: simpler, but higher risk of leakage via XSS.
  - Access + refresh token flow: more production-like, but increases MVP scope.

### 2) Password hashing algorithm
- **Decision**: Use Argon2id for password hashing via `passlib` (argon2 backend).
- **Rationale**: Strong modern hashing; straightforward integration in Python.
- **Alternatives considered**:
  - bcrypt: common and acceptable, but Argon2id is preferred when available.

### 3) Deterministic scoring and correctness
- **Decision**: Scoring is computed exclusively from persisted answer keys (correct option id) and the persisted submitted responses. AI output is never consulted for correctness.
- **Rationale**: Constitution requires deterministic, auditable scoring.
- **Alternatives considered**:
  - “AI grader” or LLM-based evaluation: explicitly prohibited.

### 4) Attempt timer enforcement
- **Decision**: Use server timestamps as the source of truth: `started_at`, `expires_at`, `submitted_at`. The API rejects writes (autosave) after expiry and finalizes the attempt via explicit submit or an “auto-submit on read/submit” rule.
- **Rationale**: Prevents client clock drift and ensures consistent behavior across refresh/devices.
- **Alternatives considered**:
  - Client-only timer: easier, but not reliable.

### 5) Topics modeling for MVP analytics
- **Decision**: Store question topic tags as a simple list on the question record (e.g., Postgres `text[]` or `jsonb` list) and compute weak-topic stats by aggregating attempt responses.
- **Rationale**: Minimizes schema complexity while supporting weak-topic breakdown and recommendations.
- **Alternatives considered**:
  - Normalized Topic table with many-to-many joins: more flexible, heavier for MVP.

### 6) API error envelope
- **Decision**: Standardize errors as:

```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```

- **Rationale**: Predictable client handling and testability.
- **Alternatives considered**:
  - Ad-hoc error shapes per endpoint: increases frontend branching.

### 7) Azure OpenAI response shape
- **Decision**: Require structured JSON responses from the AI endpoints (server validates and normalizes output).
- **Rationale**: Improves reliability and allows the UI to render consistently.
- **Alternatives considered**:
  - Free-form text only: simpler but harder to present and test.

### 8) Monorepo tooling
- **Decision**: Monorepo with `apps/web` and `apps/api`. Choose a single top-level workflow (`docker compose`) for local dev.
- **Rationale**: Matches desired repo layout and keeps local onboarding simple.
- **Alternatives considered**:
  - Separate repos: higher overhead.

## Open Questions (deferred; not blocking)

- Whether to add refresh tokens (and rotation) post-MVP.
- Whether to add a normalized Topic model when multi-exam support arrives.
