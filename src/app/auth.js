// src/auth.js or wherever your NextAuth config lives
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
	adapter: PrismaAdapter(prisma),

	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},

			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password)
					throw new Error("Invalid email or password");

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password)
					throw new Error("Invalid email or password");

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isValid) throw new Error("Invalid email or password");

				return user;
			},
		}),
	],

	session: {
		strategy: "jwt",
	},

	callbacks: {
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub;
				session.user.username = token.username;
				session.user.workspaceId = token.workspaceId ?? null;
			}
			return session;
		},

		async jwt({ token, user }) {
			if (user) {
				const dbUser = await prisma.user.findUnique({
					where: { id: user.id },
					select: {
						id: true,
						username: true,
						workspaceId: true,
					},
				});

				if (dbUser) {
					token.sub = dbUser.id;
					token.username = dbUser.username;
					token.workspaceId = dbUser.workspaceId ?? null;
				}
			}
			return token;
		},
	},
};

// Export individual handlers
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
