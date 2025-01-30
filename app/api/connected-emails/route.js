import { NextResponse } from "next/server";
import clientPromise from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Get user details
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get emails using MongoDB userId
    const userEmails = await db
      .collection("connectedEmails")
      .find({ userId: userId })
      .toArray();

    // Add isPrimary flag based on user's primary email
    const emailsWithPrimary = userEmails.map((email) => ({
      ...email,
      _id: email._id.toString(),
      isPrimary: email.emailAddress === user.email,
    }));

    return NextResponse.json(emailsWithPrimary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch connected emails", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, accessToken, refreshToken } = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    const result = await db.collection("connectedEmails").insertOne({
      userId: session.user.id,
      emailAddress: email,
      provider: "Gmail",
      accessToken,
      refreshToken,
      status: "active",
      lastSynced: new Date(),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to store email connection" },
      { status: 500 }
    );
  }
}
