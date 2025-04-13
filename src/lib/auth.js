import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";

/**
 * Auth.js (NextAuth) route handler
 * This file sets up authentication for the application using credentials provider
 * with JWT token and cookie-based sessions
 */
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // User not found or inactive
        if (!user || !user.isActive) {
          return null;
        }

        // Check password
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        // Return user without sensitive data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    // Include user id in session
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        
        // Fetch user roles if needed
        const userWithRoles = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true
                      }
                    }
                  }
                }
              }
            }
          }
        });

        // Add roles and permissions to session
        if (userWithRoles) {
          session.user.roles = userWithRoles.userRoles.map(userRole => ({
            id: userRole.role.id,
            name: userRole.role.name,
            permissions: userRole.role.permissions.map(rp => ({
              id: rp.permission.id,
              name: rp.permission.name
            }))
          }));
        }
      }
      return session;
    },
    // JWT callback
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };