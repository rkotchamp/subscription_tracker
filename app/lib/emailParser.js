import { z } from "zod";

// Define schema for subscription emails
const subscriptionEmailSchema = z.object({
  subject: z.string(),
  from: z.string(),
  date: z.string(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  renewalDate: z.date().optional(),
  invoiceUrl: z.string().url().optional(),
  requiresManualUpload: z.boolean().default(false),
});

export async function parseEmailContent(email) {
  try {
    // Extract headers
    const headers = email.payload.headers.reduce((acc, header) => {
      acc[header.name.toLowerCase()] = header.value;
      return acc;
    }, {});

    // Get email body
    const body = getEmailBody(email.payload);

    // Check if this is a subscription/invoice email using heuristics
    const isSubscription = checkIfSubscription(body, headers.subject);

    if (!isSubscription) {
      return { isSubscription: false };
    }

    // Extract relevant information
    const parsedData = {
      subject: headers.subject,
      from: headers.from,
      date: headers.date,
      ...extractSubscriptionDetails(body),
    };

    // Validate with Zod schema
    const validatedData = subscriptionEmailSchema.parse(parsedData);

    return {
      isSubscription: true,
      ...validatedData,
      messageId: email.id,
      threadId: email.threadId,
    };
  } catch (error) {
    console.error("Error parsing email:", error);
    return { isSubscription: false, error: error.message };
  }
}

function getEmailBody(payload) {
  if (payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString();
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
        return Buffer.from(part.body.data, "base64").toString();
      }
    }
  }

  return "";
}

function checkIfSubscription(body, subject) {
  const subscriptionKeywords = [
    "subscription",
    "invoice",
    "receipt",
    "billing",
    "payment",
    "renewal",
    "monthly",
    "annual",
  ];

  const lowercaseBody = body.toLowerCase();
  const lowercaseSubject = subject.toLowerCase();

  return subscriptionKeywords.some(
    (keyword) =>
      lowercaseBody.includes(keyword) || lowercaseSubject.includes(keyword)
  );
}

function extractSubscriptionDetails(body) {
  // Here you would implement more sophisticated parsing logic
  // This could include:
  // 1. Regular expressions for common patterns
  // 2. AI model integration for complex cases
  // 3. Template matching for known providers

  // This is a simplified example
  const amountMatch = body.match(/\$(\d+(\.\d{2})?)/);
  const dateMatch = body.match(/renewal date: ([^<\n]+)/i);

  return {
    amount: amountMatch ? parseFloat(amountMatch[1]) : undefined,
    renewalDate: dateMatch ? new Date(dateMatch[1]) : undefined,
    requiresManualUpload:
      body.includes("login to view") || body.includes("sign in to view"),
  };
}
