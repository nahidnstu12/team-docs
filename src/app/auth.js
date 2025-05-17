import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import authConfig from "@/lib/auth.config";

const credentialsProvider = authConfig.providers.find(
	(p) => p.id === "credentials"
);

// Now we add the `authorize` function in this file
if (credentialsProvider) {
	credentialsProvider.authorize = async (credentials) => {
		if (!credentials?.email || !credentials?.password) {
			throw new Error("Invalid email or password");
		}

		const user = await prisma.user.findUnique({
			where: { email: credentials.email },
		});

		if (!user || !user.password) {
			throw new Error("Invalid email or password");
		}

		const isValid = await bcrypt.compare(credentials.password, user.password);
		if (!isValid) {
			throw new Error("Invalid email or password");
		}

		return user;
	};
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),

	session: { strategy: "jwt" },

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

	...authConfig,
});
