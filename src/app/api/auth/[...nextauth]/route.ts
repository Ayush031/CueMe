import { prismaClient } from "@/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
        async signIn(params) {
            if (!params.user.email) {
                return false
            }
            try {
                const existingUser = await prismaClient.user.findUnique({
                    where: {
                        email: params.user.email
                    }
                });
                if (!existingUser) {
                    await prismaClient.user.create({
                        data: {
                            email: params.user.email,
                            provider: 'GOOGLE'
                        }
                    });
                }
            } catch (error) {
                console.error("Error during sign in:", error);
                return false;
            }
            return true;
        }
    }
})

export { handler as GET, handler as POST }