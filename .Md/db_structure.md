# Database Structure

## Explanation

The database is designed to efficiently store and manage user data, subscriptions, and notifications. MongoDB is chosen for its flexibility in handling semi-structured data.

### Users Collection

Stores user details and email account information.

```json
{
  "id": "string",
  "email": "string",
  "password": "hashed string",
  "emailAccounts": ["array of connected email addresses"],
  "createdAt": "timestamp"
}
```

### Subscriptions Collection

Tracks subscriptions linked to specific users and email accounts.

```json
{
  "id": "string",
  "userId": "string",
  "emailAccount": "string",
  "subscriptionName": "string",
  "invoice": {
    "fileUrl": "string",
    "uploaded": "boolean"
  },
  "renewalDate": "timestamp",
  "createdAt": "timestamp"
}
```

### Notifications Collection

Stores notification data for each user.

```json
{
  "id": "string",
  "userId": "string",
  "type": "string",
  "message": "string",
  "createdAt": "timestamp",
  "read": "boolean"
}
```

### Logs Collection

Records app activities for audit and debugging purposes.

```json
{
  "id": "string",
  "userId": "string",
  "action": "string",
  "timestamp": "timestamp"
}
```
