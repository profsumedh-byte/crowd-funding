import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from "@/app/lib/prisma";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const candidate = await prisma.users.findUnique({
        where: { email: user.email },
      });
      if (candidate === null) {
        await prisma.users.create({
          data: {
            email: user.email,
            name: user.name,
            about: "Hey there! I am a full-time digital creator dedicated to building sleek open-source templates, streaming high-framerate gameplay setups, and sharing design tricks. By backing my campaigns or joining a membership tier, you help fund new hardware, server environments, and content schedules. Thank you for visiting and supporting the journey!"
          },
        });
      }
      return true;
    },
    async session({ session, token }) {
      const dbUser = await prisma.users.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) {
        session.user.id = dbUser.user_id.toString();
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }