import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongodb";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          googleId: profile.sub,
          fullName: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          imageUrl: profile.picture,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Users: "users",
    },
    databaseName: process.env.MONGO_DB,
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/sign-up",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Google Sign In Data:", {
        user: {
          googleId: user.googleId,
          fullName: user.fullName,
          email: user.email,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
        profile: {
          sub: profile.sub,
          given_name: profile.given_name,
          family_name: profile.family_name,
          email: profile.email,
          email_verified: profile.email_verified,
          picture: profile.picture,
        },
      });

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.googleId = user.googleId;
        token.fullName = user.fullName;
        token.imageUrl = user.imageUrl;
        token.createdAt = user.createdAt;
        token.lastLogin = new Date().toISOString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.googleId = token.googleId;
        session.user.fullName = token.fullName;
        session.user.imageUrl = token.imageUrl;
        session.user.createdAt = token.createdAt;
        session.user.lastLogin = token.lastLogin;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user) {
        user.lastLogin = new Date().toISOString();
      }
    },
  },
});

export { handler as GET, handler as POST };
