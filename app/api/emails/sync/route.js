import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db/mongodb";
import { createGmailClient } from "@/lib/gmail/gmailClient";
import { analyzeEmail } from "@/lib/aiAnalysis";
import { parseEmailContent } from "@/lib/emailParser";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("No session found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const connectedEmail = await db.collection("connectedEmails").findOne({
      userId: session.user.id,
      status: "active",
    });

    console.log("Connected email found:", connectedEmail?.emailAddress);

    if (!connectedEmail) {
      return Response.json({ error: "No connected email found" });
    }

    try {
      // Create Gmail client with both tokens
      const gmail = await createGmailClient(
        connectedEmail.accessToken,
        connectedEmail.refreshToken
      );

      // Fetch emails
      console.log("Fetching emails...");
      const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: 100,
        q: "subject:(invoice OR receipt OR payment OR subscription OR bill)",
      });

      const messages = response.data.messages || [];
      console.log(`Found ${messages.length} messages`);

      let processedCount = 0;

      // Process each email
      for (const message of messages) {
        try {
          // First check if this email was already processed
          const existingEmail = await db.collection("subscriptions").findOne({
            userId: session.user.id,
            emailId: message.id,
          });

          if (existingEmail) {
            console.log("Email already processed, skipping:", message.id);
            continue;
          }

          // Get full message content
          const email = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "full",
          });

          // Extract headers
          const headers = email.data.payload.headers;
          const subject = headers.find((h) => h.name === "Subject")?.value;
          const from = headers.find((h) => h.name === "From")?.value;
          const date = headers.find((h) => h.name === "Date")?.value;

          // Extract body content
          let body = "";
          if (email.data.payload.parts) {
            // Multipart message
            for (const part of email.data.payload.parts) {
              if (part.mimeType === "text/plain") {
                body += Buffer.from(part.body.data, "base64").toString();
              }
            }
          } else if (email.data.payload.body.data) {
            // Single part message
            body = Buffer.from(
              email.data.payload.body.data,
              "base64"
            ).toString();
          }

          console.log("Processing email:", { subject, from });

          // Analyze with AI
          const analysis = await analyzeEmail(body);
          console.log("AI Analysis result:", analysis);

          if (analysis.isSubscription) {
            // Check for duplicate subscription based on key attributes
            const existingSubscription = await db
              .collection("subscriptions")
              .findOne({
                userId: session.user.id,
                subscriptionName: analysis.serviceName,
                amount: analysis.amount,
                date: new Date(date),
                // Add any other fields you want to check for duplicates
              });

            if (existingSubscription) {
              console.log("Duplicate subscription found, skipping");
              continue;
            }

            // Insert new subscription
            await db.collection("subscriptions").insertOne({
              userId: session.user.id,
              emailId: message.id,
              subject,
              from,
              date: new Date(date),
              subscriptionName: analysis.serviceName,
              category: analysis.category,
              amount: analysis.amount,
              billingFrequency: analysis.billingFrequency,
              emailAccountTrackedFrom: connectedEmail.emailAddress,
              lastUpdated: new Date(),
              status: "active",
            });
            processedCount++;
          } else {
            // Check for duplicate untracked email
            const existingUntracked = await db
              .collection("untrackedEmails")
              .findOne({
                userId: session.user.id,
                subject,
                from,
                date: new Date(date),
              });

            if (!existingUntracked) {
              await db.collection("untrackedEmails").insertOne({
                userId: session.user.id,
                emailId: message.id,
                subject,
                from,
                date: new Date(date),
                content: body,
                status: "pending_review",
                createdAt: new Date(),
              });
            }
          }
        } catch (error) {
          console.error(`Error processing email ${message.id}:`, error);
        }
      }

      return Response.json({
        success: true,
        processedEmails: processedCount,
      });
    } catch (gmailError) {
      console.error("Gmail error:", gmailError);
      return Response.json(
        {
          error: "Failed to access Gmail: " + gmailError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Sync error:", error);
    return Response.json(
      {
        error: error.message || "Sync failed",
      },
      { status: 500 }
    );
  }
}
