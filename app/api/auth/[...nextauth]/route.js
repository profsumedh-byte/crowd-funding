import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from "@/app/lib/prisma";

const handler = NextAuth({
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
        const users = await prisma.users.create({
          data: {
            email: user.email,
            name: user.name,
          },
        });
      }
      return true;



    }
  }
})

export { handler as GET, handler as POST }