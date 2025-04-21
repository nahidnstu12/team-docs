// src/lib/Session.js

import { auth } from "@/app/auth";
import { forbidden } from "next/navigation";

export class Session {
	static async getCurrentUser() {
		const session = await auth();
		return session?.user || null;
	}

	static async isAuthenticated() {
		const user = await this.getCurrentUser();
		return !!user;
	}

	static async isAuthorized(requiredRole) {
		const user = await this.getCurrentUser();
		if (!user) return false;

		// Placeholder for role check - customize as needed
		return true; // Replace with actual role check logic
	}

	static async requireAuth() {
		const isAuth = await this.isAuthenticated();
		if (!isAuth) {
			// This will trigger the unauthenticated page
			forbidden();
			// throw new Error("Unauthenticated");
		}
	}

	static async requireRole(role) {
		await this.requireAuth();
		const hasRole = await this.isAuthorized(role);
		if (!hasRole) {
			// This will trigger the unauthorized page
			throw new Error("Unauthorized");
		}
	}
}
