# Subscription Tracker App

## Overview

The Subscription Tracker App is a Next.js application designed to help users manage subscriptions and invoices from multiple email accounts. It automates the tracking of subscription-related emails, identifies invoices, and provides fallback mechanisms for cases where manual intervention is required. The app also supports multiple email account integration and a centralized dashboard for streamlined management.

---

## Key Features

1. **Email Parsing and Subscription Detection**

   - Automatically parses connected email accounts for subscription-related emails and invoices.
   - Flags emails that require manual invoice uploads.

2. **Multi-Email Account Integration**

   - Users can connect multiple email accounts (e.g., Gmail, Outlook) to track subscriptions across accounts.

3. **Centralized Subscription Dashboard**

   - Unified view of all tracked subscriptions and invoices.
   - Filter subscriptions by email account.

4. **Invoice Upload Fallback**

   - Detects emails that reference invoices requiring manual action.
   - Allows users to upload invoices manually through the app.

5. **Notifications**

   - Sends reminders for missing invoices or upcoming subscription renewals.

6. **Secure Authentication**

   - Supports OAuth2 for email integration and JWT for app authentication.

7. **UI/UX Enhancements**

   - Built with ShadCN UI and TailwindCSS for a modern, responsive design.

8. **File and Image Storage**

   - Utilizes Firebase Storage for securely storing uploaded files and images.

9. **AI-Powered Analysis**

   - Uses OpenAI's GPT-4 to analyze email content for invoice-related references, enhancing detection accuracy.

10. **Future Mobile App Conversion**
    - While the app is initially developed as a web application, there are plans to convert it into a mobile app once the web version is complete.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, ShadCN UI, TailwindCSS
- **Validation**: Zod, Zod Resolver
- **Authentication**: JWT, OAuth2 (Gmail, Outlook APIs)
- **Email Parsing**: IMAP, Nodemailer, Gmail API, Outlook API
- **Database**: MongoDB
- **Deployment**: Vercel (for hosting)
- **File Storage**: Firebase Storage
- **Notifications**: Firebase Cloud Messaging or Twilio
- **Real-Time Updates**: Socket.IO (optional, for dynamic updates on the dashboard)

---

## Suggested Tools to Integrate

1. **Gmail API and Outlook API**: For fetching emails securely using OAuth2.
2. **Firebase Storage**: For securely storing uploaded invoices and images.
3. **Twilio SendGrid**: For sending notification emails.
4. **Redis**: For caching parsed email data to optimize performance.
5. **pdf-lib**: For parsing and extracting text from PDF invoices.
6. **Tesseract.js**: For OCR-based text extraction from images.
7. **OpenAI GPT-4**: For analyzing email content to detect invoice-related patterns and generating user prompts for manual uploads.

---

## App Development Process

### 1. **Planning and Requirements**

- Define key features and functionalities.
- Identify required tools and technologies.

### 2. **Setup**

- Initialize the Next.js app with the App Router structure.
- Install dependencies:
  ```bash
  npm install next react react-dom zod @hookform/resolvers jwt-decode tailwindcss shadcn-ui
  ```
- Configure TailwindCSS and ShadCN UI.
- Set up the MongoDB database.

### 3. **Authentication**

- Implement JWT-based user authentication for the app.
- Set up OAuth2 authentication for email account integration using Gmail and Outlook APIs.

### 4. **Email Parsing**

- Integrate Gmail and Outlook APIs for fetching emails.
- Parse emails using Nodemailer and validate content with Zod schemas.
- Detect subscription-related content using OpenAI's GPT-4 for enhanced pattern recognition.

### 5. **UI/UX Design**

- Build responsive, modern UI components with ShadCN UI and TailwindCSS.
- Create a multi-panel dashboard for managing subscriptions:
  - Panel 1: Email Accounts List
  - Panel 2: Subscriptions List
  - Panel 3: Subscription Details & Invoice Upload

### 6. **Multi-Email Management**

- Add functionality for connecting multiple email accounts.
- Implement a "Manage Accounts" section to view and manage connected accounts.

### 7. **Fallback for Manual Uploads**

- Use GPT-4 to analyze emails that reference invoices requiring user action.
- Provide a UI for uploading invoices manually and tagging them to the relevant subscription.

### 8. **File and Image Storage**

- Configure Firebase Storage for handling uploaded files and images securely.

### 9. **Notifications**

- Implement Firebase Cloud Messaging or Twilio for email and in-app notifications.
- Notify users of missing invoices or subscription renewals.

### 10. **Testing**

- Write unit tests for key functionalities (e.g., email parsing, subscription detection).
- Conduct end-to-end testing to ensure smooth user experience.

### 11. **Deployment**

- Deploy the app on Vercel.
- Configure Firebase Storage for handling file uploads.
- Set up CI/CD pipelines for seamless updates.

---

## Folder Structure

```
├── public
├── app
│   ├── components
│   │   ├── Dashboard
│   │   ├── EmailIntegration
│   │   ├── FallbackUpload
│   │   ├── Notifications
│   │   └── Authentication
│   ├── lib
│   │   ├── email
│   │   ├── gpt-analysis
│   │   ├── firebase
│   │   └── utils
│   ├── api
│   │   ├── auth
│   │   ├── email
│   │   ├── subscriptions
│   │   └── upload
│   ├── dashboard
│   ├── manage
│   ├── login
│   └── styles
└── tests
```

---

## Future Enhancements

1. **Mobile App**: Build a React Native app for mobile users.
2. **Custom Tags**: Allow users to tag subscriptions for better categorization.
3. **Payment Tracking**: Integrate with payment gateways to track subscription payments directly.
4. **Advanced Search**: Implement a robust search feature to find subscriptions or invoices quickly.
5. **Multi-Language Support**: Support multiple languages for a wider user base.
6. **Improved AI Suggestions**: Train custom GPT-4 prompts for specific user behavior and data patterns.

---

## Conclusion

This app offers users an intuitive and powerful solution to manage their subscriptions and invoices efficiently. With modern tools and thoughtful design, it is scalable and easy to maintain while addressing real-world user needs.
