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

          if (account.scope?.includes("gmail.readonly")) {
            console.log("Gmail integration request detected");
            await db.collection("connectedEmails").insertOne({
              userId: user.id,
              emailAddress: user.email,
              isPrimary: false,
              createdAt: new Date(),
            });
          }

          const existingUser = await db
            .collection("users")
            .findOne({ email: user.email });

          if (!existingUser) {
            await db.collection("users").insertOne({
              email: user.email,
              name: user.name,
              image: user.image,
              createdAt: new Date(),
            });
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
