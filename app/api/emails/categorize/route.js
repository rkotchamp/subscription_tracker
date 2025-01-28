import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { categorizeEmail } from "@/lib/categorization";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email data is required" }, { status: 400 });
    }

    const result = await categorizeEmail(email, session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Categorization API Error:", error);
    return NextResponse.json(
      { error: "Failed to process email" },
      { status: 500 }
    );
  }
} 