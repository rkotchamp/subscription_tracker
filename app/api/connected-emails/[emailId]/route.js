import { NextResponse } from "next/server";
import clientPromise from "@/lib/db/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    const { emailId } = params;
    const { status } = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    await db.collection("connectedEmails").updateOne(
      { id: emailId },
      {
        $set: {
          status,
          lastSynced: status === "active" ? new Date() : null,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating email status:", error);
    return NextResponse.json(
      { error: "Failed to update email status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailId } = params;
    if (!emailId) {
      return NextResponse.json(
        { error: "Email ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);

    // Check if it's the primary email
    const emailToDelete = await db.collection("connectedEmails").findOne({
      _id: emailId,
      userId: session.user.id,
    });

    if (!emailToDelete) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Prevent deletion if it's the primary email
    if (emailToDelete.emailAddress === session.user.email) {
      return NextResponse.json(
        { error: "Cannot delete primary email" },
        { status: 403 }
      );
    }

    // Proceed with deletion
    const result = await db.collection("connectedEmails").deleteOne({
      _id: emailId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete email" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
