import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple in-memory TOTP verification (in production, use a proper TOTP library)
async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  // This is a simplified version - in production use otplib or similar
  // For now, we'll mock the TOTP verification for development
  return true;
}

export default NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "TOTP Code (6 digits)", type: "text" }
      },
      async authorize(credentials, req) {
        // In production, validate credentials against the database
        // For demo purposes, accept any credentials that match our test admin
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        // Find admin user
        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
          include: { wallets: true }
        });

        if (!admin) {
          throw new Error("Invalid email or password");
        }

        // Verify password (in production, use bcrypt.compare)
        const isPasswordValid = admin.password === credentials.password; // Simplified for demo
        
        if (!isPasswordValid || !admin.totpSecret) {
          throw new Error("Invalid email or password");
        }

        // Verify TOTP code
        const isValidTotp = await verifyTOTP(admin.totpSecret, credentials.totpCode);

        if (!isValidTotp) {
          throw new Error("Invalid TOTP code");
        }

        return {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          totpEnabled: admin.totpEnabled
        };
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async signIn({ account, user }) {
      // Additional validation if needed
      console.log("User signed in:", user);
      return true;
    }
  },

  pages: {
    signIn: "/login"
  },

  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
});
