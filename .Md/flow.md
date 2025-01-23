# App Workflow

## Step-by-Step Flow with Explanations and Pain Points

### 1. User Onboarding

- **Explanation**: Users create an account, log in, and connect their email accounts using OAuth2 (Gmail or Outlook API). This allows the app to fetch subscription-related emails securely.
- **Pain Points**:
  - Ensuring users trust the app to access their emails.
  - Managing OAuth2 token expiration and refreshing.

### 2. Email Parsing

- **Explanation**: Once connected, the app fetches emails and uses a combination of heuristics and schema validation (Zod) to identify subscription emails and invoices. AI models assist in detecting invoices with specific content patterns.
- **Pain Points**:
  - Handling varying email formats across providers.
  - Ensuring accurate parsing for edge cases, like incomplete or non-standard emails.

### 3. Subscription Dashboard

- **Explanation**: Displays all subscriptions from connected accounts, including invoice details, renewal dates, and statuses. Users can filter by email account or subscription type.
- **Pain Points**:
  - Designing an intuitive UI for large datasets.
  - Keeping the dashboard in sync with real-time email updates.

### 4. Invoice Upload Fallback

- **Explanation**: For emails referencing invoices that are inaccessible (e.g., links requiring login), users are notified to manually download and upload invoices.
- **Pain Points**:
  - Accurately detecting such cases to avoid false positives.
  - Ensuring a seamless upload experience without overwhelming the user.

### 5. Notifications

- **Explanation**: Users receive reminders for missing invoices, approaching renewal dates, or detected issues in email parsing.
- **Pain Points**:
  - Preventing notification overload while maintaining usefulness.
  - Handling timing issues, especially for users in different time zones.

### 6. Deployment

- **Explanation**: The app is deployed on Vercel for scalability and Firebase for file storage. CI/CD pipelines ensure updates are smooth and error-free.
- **Pain Points**:
  - Managing deployment configurations across environments (development, staging, production).
  - Ensuring Firebase is optimized for secure and efficient file handling.
