import { auth } from "@/app/auth";
import { forbidden } from "next/navigation";
import { UserModel } from "@/system/Models/UserModel";

export class Session {
  /**
   * Get the current user from session
   * @returns {Promise<UserModel|null>}
   */
  static async getCurrentUser() {
    const session = await auth();
    return session?.user || null;
  }

  /**
   * Check if the user is authenticated
   * @returns {Promise<boolean>}
   */
  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  /**
   * Redirect to forbidden page if not authenticated
   * @returns {Promise<void>}
   */
  static async requireAuth() {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      forbidden();
    }
  }

  /**
   * When workspaceId is not available in JWT, get it from database
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

  /**
   * Get the workspaceId for the current user.
   * Either from JWT or database
   * @returns {Promise<string|null>} The workspaceId or null if not found
   */
  static async getWorkspaceIdForUser() {
    const session = await this.getCurrentUser();
    if (!session) return null;

    // Try JWT first
    if (session.workspaceId) return session.workspaceId;

    // Fallback to database
    return this.getWorkspaceId(session.id);
  }

  // static async requireRole(role) {
  // 	await this.requireAuth();
  // 	const hasRole = await this.isAuthorized(role);
  // 	if (!hasRole) {
  // 		// This will trigger the unauthorized page
  // 		throw new Error("Unauthorized");
  // 	}
  // }

  // static async isAuthorized(requiredRole) {
  // 	const user = await this.getCurrentUser();
  // 	if (!user) return false;

  // 	// Placeholder for role check - customize as needed
  // 	return true; // Replace with actual role check logic
  // }
}
