# API Contract: Exams

## GET /exams

Lists published exams for learners.

**Response 200**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "durationSeconds": 3600,
      "questionCount": 45
    }
  ],
  "nextCursor": null
}
```

## GET /exams/{exam_id}

Returns exam details.

**Response 200**
```json
{
  "exam": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "durationSeconds": 3600,
    "questionCount": 45
  }
}
```

## POST /exams (admin)

Creates an exam.

**Request**
```json
{ "title": "string", "description": "string", "durationSeconds": 3600, "isPublished": false }
```

**Response 201**
```json
{ "exam": { "id": "uuid" } }
```

## PATCH /exams/{exam_id} (admin)

Updates an exam.

**Request**
```json
{ "title": "string", "description": "string", "durationSeconds": 3600, "isPublished": true }
```

**Response 200**
```json
{ "exam": { "id": "uuid" } }
```

## DELETE /exams/{exam_id} (admin)

Deletes an exam.

**Response 204**

No body.
