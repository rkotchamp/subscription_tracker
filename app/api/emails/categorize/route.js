// Import required dependencies
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { categorizeEmail } from "@/lib/categorization";
import { authOptions } from "@/lib/auth";

// Define POST endpoint handler for email categorization
export async function POST(req) {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    // Return 401 if user is not authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body and extract email data
    const body = await req.json();
    const { email, userId, emailAccountTrackedFrom } = body;

    // Return 400 if email data is missing
    if (!email || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call categorization service with email and user ID
    const result = await categorizeEmail(
      email,
      userId,
      emailAccountTrackedFrom
    );

    // Return the categorization result
    return NextResponse.json(result);
  } catch (error) {
    // Log any errors and return 500 response
    return NextResponse.json(
      { error: "Failed to categorize email", details: error.message },
      { status: 500 }
    );
  }
}
