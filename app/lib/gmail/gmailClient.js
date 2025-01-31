import { google } from "googleapis";

export async function createGmailClient(accessToken, refreshToken) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + "/api/auth/callback/google"
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      scope: "https://www.googleapis.com/auth/gmail.readonly",
    });

    // Force token refresh if needed
    const { token } = await oauth2Client.getAccessToken();
    console.log("Token refreshed successfully:", !!token);

    // Create Gmail service
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // Test the connection
    await gmail.users.getProfile({ userId: "me" });
    console.log("Gmail client created successfully");

    return gmail;
  } catch (error) {
    console.error("Error creating Gmail client:", error);
    throw new Error(`Failed to create Gmail client: ${error.message}`);
  }
}
