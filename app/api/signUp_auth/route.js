import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../lib/db/mongodb";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user following the schema
    const newUser = {
      fullName: name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Insert the new user
    const result = await usersCollection.insertOne(newUser);

    // Store email in connectedEmails collection
    const connectedEmailsCollection = db.collection("connectedEmails");
    await connectedEmailsCollection.insertOne({
      id: result.insertedId.toString() + "_" + email,
      userId: result.insertedId.toString(),
      emailAddress: email,
      isPrimary: true,
    });

    // Create a log entry
    const logsCollection = db.collection("logs");
    await logsCollection.insertOne({
      userId: result.insertedId.toString(),
      action: "user_created",
      timestamp: new Date(),
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
