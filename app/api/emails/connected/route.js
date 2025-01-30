import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import clientPromise from "@/lib/db/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Get all connected emails for the user
    const connectedEmails = await db
      .collection("connectedEmails")
      .find({
        userId: session.user.id,
        status: "active",
      })
      .toArray();

    return Response.json({
      connectedEmails,
      count: connectedEmails.length,
    });
  } catch (error) {
    console.error("Error fetching connected emails:", error);
    return Response.json(
      { error: "Failed to fetch connected emails" },
      { status: 500 }
    );
  }
}
