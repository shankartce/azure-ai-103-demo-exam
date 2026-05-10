# API Contract: Attempts

## POST /attempts/start

Starts an attempt for an exam (or returns the active attempt if one exists).

**Request**
```json
{ "examId": "uuid" }
```

**Response 200**
```json
{
  "attempt": {
    "id": "uuid",
    "examId": "uuid",
    "status": "active",
    "startedAt": "iso-8601",
    "expiresAt": "iso-8601"
  }
}
```

## PATCH /attempts/{attempt_id}/responses

Autosaves responses and review flags. Server rejects writes after `expiresAt`.

**Request**
```json
{
  "responses": [
    {
      "questionId": "uuid",
      "selectedOptionId": "uuid | null",
      "markedForReview": false
    }
  ]
}
```

**Response 200**
```json
{ "attemptId": "uuid" }
```

## POST /attempts/{attempt_id}/submit

Finalizes and scores the attempt.

**Response 200**
```json
{ "attemptId": "uuid", "status": "submitted" }
```

## GET /attempts/{attempt_id}/result

Returns result breakdown. This endpoint MAY include correct options (for review only).

**Response 200**
```json
{
  "result": {
    "attemptId": "uuid",
    "scorePercent": 72.5,
    "status": "submitted | expired",
    "items": [
      {
        "questionId": "uuid",
        "isCorrect": true,
        "selectedOptionId": "uuid | null",
        "correctOptionId": "uuid",
        "topics": ["string"]
      }
    ],
    "weakTopics": [
      { "topic": "string", "incorrectCount": 3, "questionCount": 10 }
    ]
  }
}
```

## GET /attempts/me

Lists a user’s attempts (for dashboard/history).

**Response 200**
```json
{ "items": [ { "id": "uuid", "examId": "uuid", "status": "submitted", "scorePercent": 80.0 } ] }
```
