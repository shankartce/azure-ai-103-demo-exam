# API Contract: Auth

## POST /auth/signup

Creates a new user account.

**Request**
```json
{ "email": "user@example.com", "password": "string" }
```

**Response 201**
```json
{ "user": { "id": "uuid", "email": "user@example.com", "isAdmin": false } }
```

## POST /auth/login

Authenticates the user and establishes a JWT session.

**Request**
```json
{ "email": "user@example.com", "password": "string" }
```

**Response 200**
```json
{ "user": { "id": "uuid", "email": "user@example.com", "isAdmin": false } }
```

## GET /auth/me

Returns the authenticated user.

**Response 200**
```json
{ "user": { "id": "uuid", "email": "user@example.com", "isAdmin": false } }
```
