import clientPromise from "@/lib/db/mongodb";
import { analyzeEmail } from "./aiAnalysis";

export async function categorizeEmail(email, userId) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Extract email content
    const emailContent = {
      subject: email.subject,
      body: email.body,
      sender: email.sender,
      date: email.date,
    };

    // Analyze with AI
    const analysis = await analyzeEmail(JSON.stringify(emailContent));
    const parsedAnalysis =
      typeof analysis === "string" ? JSON.parse(analysis) : analysis;

    // Determine if email should be tracked
    const shouldTrack =
      parsedAnalysis.confidence > 0.8 && parsedAnalysis.isSubscription;

    if (shouldTrack) {
      // Store as tracked subscription
      await db.collection("subscriptions").insertOne({
        userId,
        emailId: email.id,
        category: parsedAnalysis.category,
        serviceName: parsedAnalysis.serviceName,
        amount: parsedAnalysis.amount,
        billingFrequency: parsedAnalysis.billingFrequency,
        confidence: parsedAnalysis.confidence,
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: "active",
      });
    } else {
      // Store as untracked email
      await db.collection("untrackedEmails").insertOne({
        userId,
        emailId: email.id,
        content: emailContent,
        analysis: parsedAnalysis,
        status: "pending_review",
        createdAt: new Date(),
      });
    }

    return {
      tracked: shouldTrack,
      analysis: parsedAnalysis,
    };
  } catch (error) {
    console.error("Categorization Error:", error);
    throw new Error("Failed to categorize email");
  }
}
