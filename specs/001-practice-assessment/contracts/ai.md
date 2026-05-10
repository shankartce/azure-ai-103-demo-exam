# API Contract: AI Assist (Azure OpenAI)

AI is assistive only. AI endpoints MUST NOT affect deterministic scoring.

## POST /ai/explanations

Generates an explanation for a question in a submitted attempt.

**Request**
```json
{ "attemptId": "uuid", "questionId": "uuid" }
```

**Response 200**
```json
{
  "explanation": {
    "questionId": "uuid",
    "summary": "string",
    "keyPoints": ["string"],
    "whyCorrect": "string",
    "whyYourAnswer": "string"
  }
}
```

## POST /ai/recommendations

Generates study recommendations from weak topics.

**Request**
```json
{ "scope": "attempt | aggregate", "attemptId": "uuid | null" }
```

**Response 200**
```json
{
  "recommendations": {
    "weakTopics": ["string"],
    "studyPlan": [
      { "topic": "string", "actions": ["string"] }
    ]
  }
}
```

## POST /ai/tutor/chat

Tutor chat. Optional attempt context.

**Request**
```json
{ "conversationId": "uuid | null", "attemptId": "uuid | null", "message": "string" }
```

**Response 200**
```json
{ "conversationId": "uuid", "reply": "string" }
```
