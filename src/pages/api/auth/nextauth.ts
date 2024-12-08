import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Add user ID to session object
      return session;
    },
    async signIn({ account, profile }) {
      // Optional: Add custom logic for sign-in
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this if you use a secret
});
