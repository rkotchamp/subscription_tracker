import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/db/mongodb";

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
      console.log("SignIn callback:", { user, account });
      if (!user?.email) return false;
      if (account?.provider === "google") {
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGO_DB);

          const existingUser = await db
            .collection("users")
            .findOne({ email: user.email });

          if (!existingUser) {
            // Create new user
            const result = await db.collection("users").insertOne({
              fullName: user.name,
              email: user.email,
              image: user.image,
              createdAt: new Date(),
            });

            // Store as primary email in connectedEmails
            await db.collection("connectedEmails").insertOne({
              id: result.insertedId.toString() + "_" + user.email,
              userId: result.insertedId.toString(),
              emailAddress: user.email,
              isPrimary: true,
            });
          }

          // If Gmail scope is present, add as additional email
          if (account.scope?.includes("gmail.readonly") && existingUser) {
            const existingEmail = await db
              .collection("connectedEmails")
              .findOne({
                userId: existingUser._id.toString(),
                emailAddress: user.email,
              });

            if (!existingEmail) {
              await db.collection("connectedEmails").insertOne({
                id: existingUser._id.toString() + "_" + user.email,
                userId: existingUser._id.toString(),
                emailAddress: user.email,
                isPrimary: false,
              });
            }
          }

          return true;
        } catch (error) {
          console.error("Database error:", error);
          return false;
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard/email-accounts`;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
