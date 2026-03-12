import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_AREAS_API_URL ||
            "https://express.prosental.com/api";
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          const data = await res.json();

          if (res.ok && data.access_token) {
            return {
              id: credentials?.email,
              email: credentials?.email,
              accessToken: data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login Error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.provider === "google") {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_AREAS_API_URL ||
            "https://express.prosental.com/api";
          const res = await fetch(`${apiUrl}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ id_token: account.id_token }),
          });
          const data = await res.json();
          if (res.ok && data.access_token) {
            token.accessToken = data.access_token;
            if (data.user) {
              token.user = data.user;
            }
          }
        } catch (error) {
          console.error("Google Backend Auth Error:", error);
        }
      } else if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      if (token.user) {
        session.user = { ...session.user, ...token.user };
      }
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET || "default_super_secret_for_development_only",
});

export { handler as GET, handler as POST };
