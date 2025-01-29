# Final Data Structures

## Users Collection

Stores user details and email account information.

```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "password": "hashed string",
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "imageUrl": "string"
}
```

## Subscriptions Collection

Tracks subscriptions linked to specific users and email accounts.

```json
{
  "id": "string",
  "userId": "string",
  "emailAccountTrackedFrom": "string",
  "subscriptionName": "string",
  "category": "string",
  "amount": "number",
  "date": "timestamp",
  "statement": "string"
}
```

## Connected Email Accounts Collection

Tracks email accounts linked to specific users.

```json
{
  "id": "string",
  "userId": "string",
  "emailAddress": "string",
  "isPrimary": "boolean",
  "accessToken": "string",
  "createdAt": "timestamp",
  "lastSynced": "timestamp",
  "provider": "string",
  "refreshToken": "string",
  "scope": "string",
  "status": "string"
}
```
