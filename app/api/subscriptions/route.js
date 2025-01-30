import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db/mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const query = {
      userId: session.user.id,
      ...(category && { category: category }),
    };

    const subscriptions = await db
      .collection("subscriptions")
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return Response.json(subscriptions);
  } catch (error) {
    console.error("Subscriptions API Error:", error);
    return Response.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return NextResponse.json({ message: "Subscription created" });
}
