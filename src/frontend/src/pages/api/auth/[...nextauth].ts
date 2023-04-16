import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile && profile.email && profile.email.endsWith("@hyderabad.bits-pilani.ac.in")) return true;
      return false;
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
  },
});
