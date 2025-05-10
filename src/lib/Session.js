import { auth } from "@/app/auth";
import { forbidden } from "next/navigation";
import prisma from "./prisma";
import { UserModel } from "@/system/Models/UserModel";
import Logger from "./Logger";

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

	/**
	 * Optionally, get the actual workspaceId
	 * @param {string} userId
	 * @returns {Promise<string|null>}
	 */
	static async getWorkspaceId(id) {
		try {
			const user = await UserModel.findUnique({
				where: { id },
				select: { workspaceId: true },
			});

			return user?.workspaceId;
		} catch (error) {
			console.error("[Session.getWorkspaceId] Error:", error);
			return null;
		}
	}
}
