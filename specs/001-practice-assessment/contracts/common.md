# API Contract: Common Conventions (MVP)

**Base**: `/` (prefix may be added later, e.g. `/api/v1`)

## Authentication

- Protected endpoints require an authenticated user.
- Auth session is JWT-based.

## Error Envelope

All non-2xx responses MUST return:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Pagination (where applicable)

List endpoints SHOULD support:
- `limit` (default 20)
- `cursor` (opaque)

Response SHOULD include:

```json
{ "items": [], "nextCursor": "string | null" }
```

## IDs

All major entities use UUID ids.
