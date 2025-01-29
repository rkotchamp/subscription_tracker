import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;

      try {
        console.log("Sign in callback - User:", user);
        console.log("Sign in callback - Account:", account);

        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB);

        // First insert/update the user
        const userResult = await db.collection("users").findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              fullName: user.name,
              email: user.email,
              imageUrl: user.image,
              lastLogin: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          {
            upsert: true,
            returnDocument: "after", // This ensures we get the updated document
          }
        );

        // Get the user document from the result
        const dbUser = userResult.value || userResult; // Handle different MongoDB versions
        if (!dbUser) {
          console.error("Failed to create/update user");
          return false;
        }

        const userId = dbUser._id.toString();
        console.log("MongoDB User ID:", userId);

        // Store email connection with MongoDB userId
        if (account?.provider === "google") {
          await db.collection("connectedEmails").findOneAndUpdate(
            {
              userId: userId,
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
                isPrimary: true, // Set primary flag for initial email
              },
              $setOnInsert: {
                createdAt: new Date(),
              },
            },
            {
              upsert: true,
              returnDocument: "after",
            }
          );
        }

        return true;
      } catch (error) {
        console.error("Database error during sign in:", error);
        return false;
      }
    },
    async session({ session, token, user }) {
      if (session.user) {
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGO_DB);

          const dbUser = await db
            .collection("users")
            .findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.fullName = dbUser.fullName;
            session.user.isPrimary = dbUser.isPrimary;
          }
        } catch (error) {
          console.error("Error updating session:", error);
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};
