import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/db/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;

      if (account?.provider === "google") {
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGO_DB);

          await db.collection("connectedEmails").updateOne(
            {
              userId: user.id,
              emailAddress: user.email,
            },
            {
              $set: {
                status: "active",
                lastSynced: new Date(),
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                provider: "Gmail",
                scope: account.scope,
              },
            },
            { upsert: true }
          );

          return true;
        } catch (error) {
          console.error("Database error:", error);
          return false;
        }
      }
      return true;
    },
  },
};
