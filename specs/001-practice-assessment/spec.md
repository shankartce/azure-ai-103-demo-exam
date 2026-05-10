# Feature Specification: Azure AI Certification Practice Assessment Platform (MVP)

**Feature Branch**: `001-practice-assessment`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: Product specification for a Microsoft Learn-style Azure AI certification practice assessment platform

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Take a timed practice exam end-to-end (Priority: P1)

As a learner, I can sign up/log in, choose an exam, complete a timed attempt with autosaved answers, submit (or be auto-submitted on time expiry), and see a deterministic score with a clear breakdown.

**Why this priority**: This is the core product value: realistic practice under exam conditions with deterministic scoring.

**Independent Test**: Can be tested by creating a learner account, starting an exam, answering questions, submitting, and verifying score + per-question correctness from stored answer keys.

**Acceptance Scenarios**:

1. **Given** a learner is authenticated and an exam exists, **When** they start an attempt, **Then** a timed attempt begins and is resumeable on refresh.
2. **Given** an active attempt, **When** the learner selects/changing answers and navigates between questions, **Then** the latest responses are saved and reflected when returning to a question.
3. **Given** an active attempt, **When** the learner submits, **Then** the attempt is finalized and scored deterministically from stored correct options.
4. **Given** an active attempt reaches time expiry, **When** time runs out, **Then** the attempt is finalized using the last saved responses and shown as expired/auto-submitted.
5. **Given** a learner has an active attempt for an exam, **When** they try to start the same exam again, **Then** they are prevented from creating a second active attempt.

---

### User Story 2 - Review results with AI-assisted explanations (Priority: P2)

As a learner, after submitting an attempt, I can review each question with correctness feedback and request an AI-assisted explanation that is explicitly tied to my submitted answer and the correct answer.

**Why this priority**: Fast feedback is a key learner pain point; explanations improve learning value without affecting scoring.

**Independent Test**: Can be tested by completing an attempt with at least one incorrect answer, requesting an explanation, and verifying that the score remains unchanged and the explanation references the submitted choice.

**Acceptance Scenarios**:

1. **Given** a submitted attempt, **When** the learner opens a question review, **Then** they see their submitted answer, the correct answer, and whether they were correct.
2. **Given** a submitted attempt, **When** the learner requests an AI explanation for a question, **Then** the explanation is returned for that question and is labeled as assistive content.
3. **Given** an AI request fails or times out, **When** the learner requests an explanation, **Then** the UI shows a clear failure state and still displays deterministic correctness/score.

---

### User Story 3 - See weak topics and study recommendations (Priority: P3)

As a learner, I can see which topics I performed poorly on (per attempt and over time) and receive AI-assisted study recommendations that reference those weak topics.

**Why this priority**: Learners want visibility into weak areas and what to study next.

**Independent Test**: Can be tested by submitting attempts with known topic-tag distributions and verifying weak-topic calculations and recommendation behavior.

**Acceptance Scenarios**:

1. **Given** a submitted attempt with topic-tagged questions, **When** the learner views results, **Then** they see a topic breakdown highlighting weak topics.
2. **Given** multiple submitted attempts, **When** the learner views progress, **Then** they see an aggregated weak-topic view derived from attempt history.
3. **Given** AI recommendations are unavailable, **When** the learner views weak topics, **Then** the deterministic topic breakdown still renders and recommendations degrade gracefully.

---

### User Story 4 - Admin manages exams and questions (Priority: P4)

As an admin/content manager, I can create, edit, and delete exams and questions so the platform content stays current and accurate.

**Why this priority**: Content management is required for maintainability; for the MVP demo, it can be internal-only and simple.

**Independent Test**: Can be tested by logging in as an admin, creating an exam with questions/options, and confirming it becomes available to learners.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they create or update an exam and its questions, **Then** learners can see the updated content in the exam list/detail views.
2. **Given** a non-admin authenticated user, **When** they try to access admin routes or actions, **Then** access is denied with a clear error.
3. **Given** malformed question content (e.g., missing options), **When** an admin attempts to save it, **Then** validation prevents publishing invalid content.

---

### User Story 5 - Get targeted help via AI tutor chat (Priority: P5)

As a learner, I can chat with an AI tutor to ask follow-up questions about concepts I missed, without the tutor changing scoring or overriding deterministic correctness.

**Why this priority**: Adds perceived value and showcases AI capability while remaining assistive.

**Independent Test**: Can be tested by opening tutor chat from a result context, asking a question, and confirming the chat does not change attempt state or score.

**Acceptance Scenarios**:

1. **Given** a submitted attempt, **When** the learner opens tutor chat and asks a question about a missed topic, **Then** they receive a response that is clearly assistive and does not change correctness/score.

---

### Edge Cases

- Learner refreshes the page during an active attempt.
- Network interruption during autosave.
- Attempt expires while the learner is on the review screen.
- Question references a missing option or invalid exam mapping.
- AI service timeout or failure (explanations/recommendations/tutor).
- Learner opens the same attempt on multiple devices/tabs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to sign up and log in using email/password authentication.
- **FR-002**: System MUST establish authenticated sessions for protected routes using token-based sessions (JWT).
- **FR-003**: System MUST provide an exam list and exam detail experience that allows a learner to understand what they are starting (name, description, question count, duration).
- **FR-004**: System MUST allow a learner to start a timed exam attempt.
- **FR-005**: System MUST enforce at most one active attempt per learner per exam at a time.
- **FR-006**: System MUST support multiple-choice, single-answer questions.
- **FR-007**: System MUST allow question navigation via next/previous controls and a question palette.
- **FR-008**: System MUST allow learners to mark questions for review.
- **FR-009**: System MUST autosave learner responses during an active attempt.
- **FR-010**: System MUST finalize and score attempts on explicit submission.
- **FR-011**: System MUST finalize attempts on timer expiration using the last saved responses.
- **FR-012**: System MUST compute attempt scores deterministically from stored correct options and persisted responses.
- **FR-013**: System MUST present a result view with overall score and per-question breakdown (correct/incorrect/unanswered) derived from submitted data.
- **FR-014**: System MUST allow learners to request AI-assisted explanations for questions after submission.
- **FR-015**: AI explanations MUST be tied to the submitted answer and MUST NOT modify correctness or score.
- **FR-016**: System MUST provide weak-topic tracking derived from submitted attempts (per attempt and aggregated over time).
- **FR-017**: System MUST allow learners to request AI-assisted study recommendations based on weak topics.
- **FR-018**: System MUST offer an AI tutor chat experience for learner questions and MUST keep tutor output assistive only.
- **FR-019**: System MUST provide admin capabilities to create, edit, and delete exams and questions.
- **FR-020**: System MUST restrict admin routes/actions to admin users and deny access to non-admin users.
- **FR-021**: System MUST validate exam/question content to prevent invalid questions from being presented to learners.
- **FR-022**: UI MUST be responsive on mobile and support dark mode.
- **FR-023**: System MUST include automated tests covering critical paths (auth, attempt lifecycle, scoring, submission) and core API contracts.

### Key Entities *(include if feature involves data)*

- **User**: Learner identity and profile; may include an admin flag.
- **Exam**: A named practice assessment with a duration and a collection of questions.
- **Question**: Prompt text with multiple options; tagged to one or more topics.
- **Option**: A selectable answer option for a question; one option is correct.
- **Attempt**: A learner’s timed instance of taking an exam (active/submitted/expired).
- **Attempt Response**: The learner’s selected option per question, including “marked for review” state.
- **Topic**: A content categorization unit used for weak-topic tracking.
- **AI Explanation**: Assistive explanation content associated with a submitted attempt question review.
- **AI Recommendation**: Assistive study guidance derived from weak-topic performance.
- **Tutor Conversation**: A learner’s chat history for targeted learning assistance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of users in a demo/test cohort can start and complete a full timed attempt without a blocking issue.
- **SC-002**: Attempt submission success rate is at least 99.5% in test runs (including auto-submission on expiry).
- **SC-003**: Given the same submitted responses and answer keys, the computed score is identical across repeated evaluations (100% deterministic).
- **SC-004**: Learners can find their overall score and per-question correctness in under 30 seconds after submission.
- **SC-005**: AI-assisted explanations return quickly enough to feel integrated (median under 5 seconds per explanation request in test conditions), and failures do not block review.
- **SC-006**: Admins can create an exam with at least 20 questions and publish it without developer assistance.

## Assumptions

- A single certification exam is sufficient for the MVP demo; multi-exam support is a future extension.
- Exam content can be seeded manually and/or managed by an internal admin user.
- Admin users are trusted internal users; sophisticated RBAC is out of scope for the MVP.
- Analytics/weak-topic views can be derived from persisted attempt records without a separate analytics system.
- AI usage is lightweight and request-based; if AI is unavailable, learners can still complete attempts and review deterministic results.
- Learners may refresh mid-attempt; the platform supports resuming with the current timer state.
- The MVP focuses on multiple-choice single-answer questions only.
- Out of scope for the MVP: OAuth login, multi-tenant SaaS, advanced RBAC, adaptive testing, drag-and-drop question types, labs/simulations, native mobile apps, PDF ingestion, and full retrieval/memory systems.
