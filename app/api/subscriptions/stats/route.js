import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Get all subscriptions for the user
    const subscriptions = await db
      .collection("subscriptions")
      .find({ userId: session.user.id })
      .toArray();

    // Calculate categories
    const categoryMap = new Map();
    let total = 0;

    subscriptions.forEach((sub) => {
      const amount = sub.amount || 0;
      total += amount;

      if (sub.category) {
        const existing = categoryMap.get(sub.category) || {
          total: 0,
          count: 0,
        };
        categoryMap.set(sub.category, {
          total: existing.total + amount,
          count: existing.count + 1,
        });
      }
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
      })
    );

    // Get untracked emails count
    const untrackedCount = await db
      .collection("untrackedEmails")
      .countDocuments({ userId: session.user.id });

    return Response.json({
      categories,
      total,
      untracked: untrackedCount,
      upcoming: [], // You can implement upcoming payments logic here
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
