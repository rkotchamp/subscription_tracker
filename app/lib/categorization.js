import clientPromise from "@/lib/db/mongodb";
import { analyzeEmail } from "./aiAnalysis";

export async function categorizeEmail(email, userId, emailAccountTrackedFrom) {
  try {
    console.log("Categorization - Starting for email:", {
      subject: email.subject,
      sender: email.sender,
      userId
    });

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Extract email content
    const emailContent = {
      subject: email.subject,
      body: email.snippet, // Using snippet instead of body
      sender: email.from,
      date: email.date,
    };

    console.log("Categorization - Extracted content:", emailContent);

    // Analyze with AI
    const analysis = await analyzeEmail(JSON.stringify(emailContent));
    console.log("Categorization - Raw AI analysis:", analysis);

    const parsedAnalysis = typeof analysis === "string" ? JSON.parse(analysis) : analysis;
    console.log("Categorization - Parsed analysis:", parsedAnalysis);

    // Determine if email should be tracked
    const shouldTrack = parsedAnalysis.confidence > 0.8 && parsedAnalysis.isSubscription;
    console.log("Categorization - Should track:", shouldTrack);

    if (shouldTrack) {
      const subscription = {
        userId,
        emailAccountTrackedFrom,
        emailId: email.id,
        category: parsedAnalysis.category,
        subscriptionName: parsedAnalysis.serviceName,
        amount: parsedAnalysis.amount,
        date: new Date(email.date),
        statement: email.subject,
        billingFrequency: parsedAnalysis.billingFrequency,
        confidence: parsedAnalysis.confidence,
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: "active",
      };

      console.log("Categorization - Inserting subscription:", subscription);
      await db.collection("subscriptions").insertOne(subscription);
    } else {
      const untracked = {
        userId,
        emailAccountTrackedFrom,
        emailId: email.id,
        content: emailContent,
        analysis: parsedAnalysis,
        status: "pending_review",
        createdAt: new Date(),
      };

      console.log("Categorization - Inserting untracked email:", untracked);
      await db.collection("untrackedEmails").insertOne(untracked);
    }

    return {
      tracked: shouldTrack,
      analysis: parsedAnalysis,
      email: emailContent,
    };
  } catch (error) {
    console.error("Categorization Error:", error);
    throw error;
  }
}
