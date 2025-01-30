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
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Get connected email
    const connectedEmail = await db.collection("connectedEmails").findOne({
      userId: session.user.id,
      status: "active",
    });

    if (!connectedEmail) {
      return Response.json({ error: "No connected email found" });
    }

    // Create Gmail client
    const gmail = createGmailClient(connectedEmail.accessToken);

    // Fetch emails
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 100,
      q: "subject:(invoice OR receipt OR payment OR subscription OR bill)",
    });

    const messages = response.data.messages || [];
    let processedCount = 0;

    // Process each email
    for (const message of messages) {
      try {
        // Get full email
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        // Parse email content
        const parsedEmail = await parseEmailContent(email.data);

        if (!parsedEmail.isSubscription) continue;

        // Analyze with AI
        const analysis = await analyzeEmail(parsedEmail.content);

        if (!analysis) continue;

        // Store in appropriate collection
        if (analysis.isSubscription) {
          await db.collection("subscriptions").insertOne({
            userId: session.user.id,
            emailId: message.id,
            subscriptionName: analysis.serviceName,
            category: analysis.category,
            amount: analysis.amount,
            billingFrequency: analysis.billingFrequency,
            emailSource: connectedEmail.emailAddress,
            lastUpdated: new Date(),
            status: "active",
          });
        } else {
          await db.collection("untrackedEmails").insertOne({
            userId: session.user.id,
            emailId: message.id,
            content: parsedEmail.content,
            status: "pending_review",
            createdAt: new Date(),
          });
        }

        processedCount++;
      } catch (error) {
        console.error(`Error processing email ${message.id}:`, error);
      }
    }

    return Response.json({
      success: true,
      processedEmails: processedCount,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}
