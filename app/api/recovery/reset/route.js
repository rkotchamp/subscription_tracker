import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/db/mongodb";

export async function POST(request) {
  try {
    const { password, token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is missing in the request" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Find the reset request
    const resetRequest = await db
      .collection("password_resets")
      .findOne({ token });

    if (!resetRequest || resetRequest.expires < Date.now()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await db
      .collection("users")
      .updateOne(
        { email: resetRequest.email },
        { $set: { password: hashedPassword } }
      );

    // Delete the used reset token
    await db.collection("password_resets").deleteOne({ token });

    // Create a log entry
    const user = await db
      .collection("users")
      .findOne({ email: resetRequest.email });
    if (user) {
      await db.collection("logs").insertOne({
        userId: user._id.toString(),
        action: "password_reset_completed",
        timestamp: new Date(),
      });
    }

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
