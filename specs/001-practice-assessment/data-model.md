# Data Model: Azure AI Certification Practice Assessment Platform (MVP)

**Feature**: 001-practice-assessment  
**Date**: 2026-05-10

This is an implementation-facing domain model for the MVP (entities, relationships, validations, and state transitions).

## Entities

### User
- **Purpose**: Identity for learners/admins.
- **Key fields**:
  - `id` (UUID, PK)
  - `email` (unique, required)
  - `password_hash` (required)
  - `is_admin` (bool, default false)
  - `created_at`, `updated_at`
- **Validation rules**:
  - Email must be normalized and unique.

### Exam
- **Purpose**: A practice assessment definition.
- **Key fields**:
  - `id` (UUID, PK)
  - `slug` (unique, optional but useful for URLs)
  - `title` (required)
  - `description` (optional)
  - `duration_seconds` (required, > 0)
  - `is_published` (bool, default false)
  - `created_at`, `updated_at`
- **Relationships**:
  - `Exam 1 -> N Question`

### Question
- **Purpose**: A single multiple-choice question.
- **Key fields**:
  - `id` (UUID, PK)
  - `exam_id` (FK)
  - `prompt` (required)
  - `position` (int, required; ordering within exam)
  - `topics` (list of strings; e.g., `text[]`/`jsonb`)
  - `explanation` (optional; non-AI author explanation)
  - `created_at`, `updated_at`
- **Validation rules**:
  - Must have >= 2 options.
  - Must have exactly 1 correct option.
  - `position` unique within an exam.
- **Relationships**:
  - `Question 1 -> N Option`

### Option
- **Purpose**: A selectable answer.
- **Key fields**:
  - `id` (UUID, PK)
  - `question_id` (FK)
  - `text` (required)
  - `is_correct` (bool, required)
  - `position` (int, required)

### Attempt
- **Purpose**: A timed instance of a user taking an exam.
- **Key fields**:
  - `id` (UUID, PK)
  - `user_id` (FK)
  - `exam_id` (FK)
  - `status` (enum: `active`, `submitted`, `expired`)
  - `started_at` (required)
  - `expires_at` (required)
  - `submitted_at` (nullable)
  - `score_percent` (nullable; set on finalize)
  - `created_at`, `updated_at`
- **Invariants**:
  - Only one `active` attempt per `(user_id, exam_id)`.
  - Status transition is monotonic (cannot return to active).

### AttemptResponse
- **Purpose**: The user’s answer state for a question within an attempt.
- **Key fields**:
  - `id` (UUID, PK)
  - `attempt_id` (FK)
  - `question_id` (FK)
  - `selected_option_id` (nullable FK to option)
  - `marked_for_review` (bool, default false)
  - `answered_at` (nullable)
  - `updated_at`
- **Validation rules**:
  - `selected_option_id` must belong to the same question.

### AIExplanation
- **Purpose**: Assistive explanation for a submitted attempt question.
- **Key fields**:
  - `id` (UUID, PK)
  - `attempt_id` (FK)
  - `question_id` (FK)
  - `user_id` (FK)
  - `model` (string)
  - `content` (structured JSON: short explanation + key points)
  - `created_at`
- **Invariants**:
  - Explanations are generated only after attempt finalization.

### AIRecommendation
- **Purpose**: Assistive study plan/recommendations derived from weak topics.
- **Key fields**:
  - `id` (UUID, PK)
  - `user_id` (FK)
  - `scope` (enum: `attempt`, `aggregate`)
  - `attempt_id` (nullable FK when scope = attempt)
  - `model` (string)
  - `content` (structured JSON)
  - `created_at`

### TutorConversation / TutorMessage
- **Purpose**: Tutor chat history for a user.
- **TutorConversation fields**:
  - `id` (UUID, PK)
  - `user_id` (FK)
  - `attempt_id` (nullable FK; allows contextual tutoring)
  - `created_at`
- **TutorMessage fields**:
  - `id` (UUID, PK)
  - `conversation_id` (FK)
  - `role` (enum: `user`, `assistant`)
  - `content` (text)
  - `created_at`

## State Transitions

### Attempt status
- `active` -> `submitted` (explicit submit)
- `active` -> `expired` (time expiry)
- No other transitions allowed.

## Derived/Computed Concepts

### Deterministic scoring
- For each question:
  - Correct if `selected_option_id` equals the persisted correct option id.
  - Unanswered if `selected_option_id` is null.
- Attempt score is derived from these outcomes and persisted on finalize.

### Weak topics
- Aggregate by joining `AttemptResponse -> Question.topics` for incorrect/unanswered items.
- Produce counts and percentages per topic for:
  - a single attempt
  - rolling aggregate over a user’s attempt history
