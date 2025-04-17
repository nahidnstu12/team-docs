import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

				// Optionally enrich session with roles & permissions
				const userWithRoles = await prisma.user.findUnique({
					where: { id: token.sub },
					include: {
						userRoles: {
							include: {
								role: {
									include: {
										permissions: {
											include: {
												permission: true,
											},
										},
									},
								},
							},
						},
					},
				});

				if (userWithRoles) {
					session.user.roles = userWithRoles.userRoles.map((userRole) => ({
						id: userRole.role.id,
						name: userRole.role.name,
						permissions: userRole.role.permissions.map((rp) => ({
							id: rp.permission.id,
							name: rp.permission.name,
						})),
					}));
				}
			}

			return session;
		},

		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},

	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
});
