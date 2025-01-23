import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "../../lib/db/mongodb";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const usersCollection = db.collection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ email });

    // Generic error message for security
    const authError =
      "Invalid email or password. Please check your credentials.";

    if (!user) {
      // Create a log entry for failed login attempt
      const logsCollection = db.collection("logs");
      await logsCollection.insertOne({
        email, // we don't have userId since user doesn't exist
        action: "login_failed",
        reason: "user_not_found",
        timestamp: new Date(),
      });

      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Create a log entry for failed login attempt
      const logsCollection = db.collection("logs");
      await logsCollection.insertOne({
        userId: user._id.toString(),
        action: "login_failed",
        reason: "invalid_password",
        timestamp: new Date(),
      });

      return NextResponse.json({ error: authError }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create a log entry for successful login
    const logsCollection = db.collection("logs");
    await logsCollection.insertOne({
      userId: user._id.toString(),
      action: "login_successful",
      timestamp: new Date(),
    });

    // Return success with token
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          email: user.email,
          emailAccounts: user.emailAccounts,
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
