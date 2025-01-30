import { createGmailClient } from "./gmailClient";

export async function fetchGmailMessages(accessToken, maxResults = 100) {
  try {
    const gmail = createGmailClient(accessToken);

    // Get list of messages
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxResults,
      q: "subject:(invoice OR receipt OR payment OR subscription OR bill)",
    });

    const messages = response.data.messages || [];
    const emails = [];

    // Fetch full message details for each email
    for (const message of messages) {
      try {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });
        emails.push(email.data);
      } catch (error) {
        console.error(`Error fetching email ${message.id}:`, error);
      }
    }

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
}

// Helper function to get email body content
export function getEmailBody(payload) {
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain") {
        return Buffer.from(part.body.data, "base64").toString();
      }
      if (part.parts) {
        const body = getEmailBody(part);
        if (body) return body;
      }
    }
  }

  if (payload.body && payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString();
  }

  return "";
}

// Helper function to extract header value
export function getHeader(headers, name) {
  const header = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header ? header.value : null;
}
