import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "../../lib/db/mongodb";
import { sendResetEmail } from "../../lib/nodemailer/nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const usersCollection = db.collection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      // We still return success to prevent email enumeration
      return NextResponse.json(
        { message: "If an account exists, you will receive a reset email." },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token in password_resets collection
    await db.collection("password_resets").insertOne({
      email,
      token,
      expires: Date.now() + 3600000, // 1 hour expiry
    });

    // Send reset email
    await sendResetEmail(email, token);

    // Create a log entry
    const logsCollection = db.collection("logs");
    await logsCollection.insertOne({
      userId: user._id.toString(),
      action: "password_reset_requested",
      timestamp: new Date(),
    });

    return NextResponse.json(
      { message: "If an account exists, you will receive a reset email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recovery error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
