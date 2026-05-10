# API Contract: Analytics

Analytics are derived from attempts; no external analytics system in MVP.

## GET /analytics/score-history

**Response 200**
```json
{
  "items": [
    { "attemptId": "uuid", "examId": "uuid", "submittedAt": "iso-8601", "scorePercent": 80.0 }
  ]
}
```

## GET /analytics/weak-topics

**Response 200**
```json
{
  "items": [
    { "topic": "string", "incorrectCount": 5, "questionCount": 20, "weaknessScore": 0.25 }
  ]
}
```

## GET /analytics/completion-metrics

**Response 200**
```json
{
  "metrics": {
    "attemptsStarted": 10,
    "attemptsSubmitted": 9,
    "attemptsExpired": 1,
    "submissionSuccessRate": 0.9
  }
}
```
