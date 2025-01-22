import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ subscriptions: [] });
}

export async function POST(request) {
  return NextResponse.json({ message: "Subscription created" });
}
