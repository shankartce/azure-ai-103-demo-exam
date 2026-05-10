# API Contract: Questions

## GET /exams/{exam_id}/questions

Returns questions for an exam (for the attempt runner). This endpoint should not expose which option is correct.

**Response 200**
```json
{
  "items": [
    {
      "id": "uuid",
      "examId": "uuid",
      "position": 1,
      "prompt": "string",
      "topics": ["string"],
      "options": [
        { "id": "uuid", "position": 1, "text": "string" }
      ]
    }
  ]
}
```

## POST /questions (admin)

Creates a question.

**Request**
```json
{
  "examId": "uuid",
  "position": 1,
  "prompt": "string",
  "topics": ["string"],
  "options": [
    { "position": 1, "text": "string", "isCorrect": false },
    { "position": 2, "text": "string", "isCorrect": true }
  ]
}
```

**Response 201**
```json
{ "question": { "id": "uuid" } }
```

## PATCH /questions/{question_id} (admin)

Updates a question.

**Request**
```json
{
  "position": 1,
  "prompt": "string",
  "topics": ["string"],
  "options": [
    { "id": "uuid", "position": 1, "text": "string", "isCorrect": false },
    { "id": "uuid", "position": 2, "text": "string", "isCorrect": true }
  ]
}
```

**Response 200**
```json
{ "question": { "id": "uuid" } }
```

## DELETE /questions/{question_id} (admin)

Deletes a question.

**Response 204**

No body.
