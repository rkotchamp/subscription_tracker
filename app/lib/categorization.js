import clientPromise from "@/lib/db/mongodb";
import { analyzeEmail } from "./aiAnalysis";
import { parseEmailContent } from "./emailParser";

export async function categorizeEmail(email, userId, emailAccountTrackedFrom) {
  try {
    console.log("Categorization - Starting for email:", {
      subject: email.subject,
      sender: email.from,
      userId,
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Parse email content
    const parsedContent = await parseEmailContent(email);

    if (!parsedContent.isSubscription) {
      return { tracked: false };
    }

    // If manual access required, store as untracked
    if (parsedContent.requiresManualAccess) {
      const untracked = {
        userId,
        emailAccountTrackedFrom,
        emailId: email.id,
        content: parsedContent.content,
        status: "pending_review",
        createdAt: new Date(),
      };

      await db.collection("untrackedEmails").insertOne(untracked);
      return { tracked: false, requiresManualAccess: true };
    }

    // Get AI analysis for valid subscription emails
    const analysis = await analyzeEmail(parsedContent);

    // Store as subscription if we have valid data
    if (analysis && parsedContent.amount) {
      const subscription = {
        userId,
        emailAccountTrackedFrom,
        emailId: email.id,
        category: analysis.category,
        subscriptionName: parsedContent.subscriptionName,
        amount: parsedContent.amount,
        date: parsedContent.date,
        statement: parsedContent.statement,
        billingFrequency: parsedContent.billingFrequency,
        confidence: analysis.confidence,
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: "active",
      };

      await db.collection("subscriptions").insertOne(subscription);
      console.log("Subscription inserted:", subscription);
      return { tracked: true, analysis };
    }

    return { tracked: false };
  } catch (error) {
    console.error("Categorization Error:", error);
    throw error;
  }
}
