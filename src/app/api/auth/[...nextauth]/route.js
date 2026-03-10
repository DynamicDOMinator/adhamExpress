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
        // Mock authorization: any non-empty credentials pass
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: credentials.email.split("@")[0],
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret:
    process.env.NEXTAUTH_SECRET || "default_super_secret_for_development_only",
});

export { handler as GET, handler as POST };
