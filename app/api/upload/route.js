import { NextResponse } from "next/server";

export async function POST(request) {
  return NextResponse.json({ message: "File upload endpoint" });
}
