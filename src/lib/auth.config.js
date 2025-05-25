// src/lib/auth.config.js
import Credentials from "next-auth/providers/credentials";

export default {
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			// DO NOT define `authorize` here
		}),
	],
};
