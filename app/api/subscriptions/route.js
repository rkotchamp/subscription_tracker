import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db/mongodb";
import { fetchGmailMessages } from "@/lib/gmail/gmailApi";
import { categorizeEmail } from "@/lib/categorization";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Get user ID from session
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all active subscriptions for the user
    const subscriptions = await db
      .collection("subscriptions")
      .find({
        userId: userId,
        status: "active",
        amount: { $ne: null }, // Ensure amount exists
        emailAccountTrackedFrom: { $ne: null }, // Ensure email source exists
      })
      .toArray();

    // Get untracked emails
    const untracked = await db
      .collection("untrackedEmails")
      .find({
        userId: userId,
        status: "pending_review",
      })
      .toArray();

    // Get upcoming renewals
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcoming = await db
      .collection("subscriptions")
      .find({
        userId: userId,
        status: "active",
        renewalDate: {
          $gte: new Date(),
          $lte: thirtyDaysFromNow,
        },
      })
      .toArray();

    console.log("Fetched subscriptions:", {
      subscriptionsCount: subscriptions.length,
      untrackedCount: untracked.length,
      upcomingCount: upcoming.length,
    });

    return Response.json({
      subscriptions,
      untracked,
      upcoming,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Get all connected email accounts for the user
    const connectedEmails = await db
      .collection("connectedEmails")
      .find({
        userId: userId,
        status: "active",
      })
      .toArray();

    if (!connectedEmails.length) {
      return Response.json({ message: "No connected emails found" });
    }

    let processedEmails = 0;

    // Process each connected email account
    for (const emailAccount of connectedEmails) {
      // Fetch emails from Gmail
      const emails = await fetchGmailMessages(emailAccount.accessToken);

      // Process each email
      for (const email of emails) {
        try {
          await categorizeEmail(email, userId, emailAccount.email);
          processedEmails++;
        } catch (error) {
          console.error(`Error processing email ${email.id}:`, error);
        }
      }
    }

    return Response.json({
      success: true,
      processedEmails,
    });
  } catch (error) {
    console.error("Email sync error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
