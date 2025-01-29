import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db/mongodb";
import { parseEmailContent } from "@/lib/emailParser";
import { categorizeEmail } from "@/lib/categorization";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("Fetch API - No session found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    console.log("Fetch API - Fetching emails for category:", category);

    // Get user's connected email accounts
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const emailAccounts = await db
      .collection("connectedEmails")
      .find({ userId: session.user.id })
      .toArray();

    console.log("Fetch API - Found email accounts:", emailAccounts.length);

    let allEmails = [];

    for (const account of emailAccounts) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.NEXTAUTH_URL
      );

      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      // Fetch emails from the last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      try {
        const response = await gmail.users.messages.list({
          userId: "me",
          q: `after:${Math.floor(ninetyDaysAgo.getTime() / 1000)}`,
          maxResults: 100,
        });

        console.log(
          `Fetch API - Found ${
            response.data.messages?.length || 0
          } messages for account:`,
          account.emailAddress
        );

        if (response.data.messages) {
          const emailDetails = await Promise.all(
            response.data.messages.slice(0, 10).map(async (message) => {
              const details = await gmail.users.messages.get({
                userId: "me",
                id: message.id,
                format: "metadata",
                metadataHeaders: ["From", "Subject", "Date"],
              });

              const headers = details.data.payload.headers;
              return {
                id: message.id,
                subject: headers.find((h) => h.name === "Subject")?.value || "",
                from: headers.find((h) => h.name === "From")?.value || "",
                date: headers.find((h) => h.name === "Date")?.value || "",
                snippet: details.data.snippet || "",
                accountId: account._id.toString(),
              };
            })
          );

          allEmails = [...allEmails, ...emailDetails];
        }
      } catch (gmailError) {
        console.error(
          "Fetch API - Gmail error for account:",
          account.emailAddress,
          gmailError
        );
      }
    }

    console.log("Fetch API - Returning emails:", allEmails.length);

    return Response.json({
      success: true,
      emails: allEmails,
    });
  } catch (error) {
    console.error("Fetch API - Error:", error);
    return Response.json(
      { error: "Failed to fetch emails", details: error.message },
      { status: 500 }
    );
  }
}

async function fetchGmailEmails(emailId) {
  // Implement Gmail API fetching logic here
  // Use the stored credentials from the connected email
  // Return array of email objects
}
