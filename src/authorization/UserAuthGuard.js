"use server";

import { BaseAuthGuard } from "./BaseAuthGuard";
import prisma from "@/lib/prisma";
import Logger from "@/lib/Logger";

/**
 * UserAuthGuard - Authorization guard for user-related operations
 *
 * Internal class for user authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class UserAuthGuard extends BaseAuthGuard {
  /**
   * Protect any user-authenticated route
   * @returns {Promise<Object>} User session object
   */
  static async protect() {
    return await this.requireAuth();
  }

  /**
   * Protect user profile access - users can only access their own profile
   * @param {string} userId - User ID to access
   * @returns {Promise<Object>} User object if authorized
   */
  static async protectProfile(userId) {
    const session = await this.requireAuth();

    // Super admins can access any profile
    if (this.isSuperAdmin(session)) {
      return await this.validateResourceExists(
        (where) => prisma.user.findUnique(where),
        { where: { id: userId } },
        "User"
      );
    }

    // Users can only access their own profile
    this.requireOwnership(session.id, userId, "user profile");

    return await this.validateResourceExists(
      (where) => prisma.user.findUnique(where),
      { where: { id: userId } },
      "User"
    );
  }

  /**
   * Protect user management operations (admin only)
   * @returns {Promise<Object>} Admin user session
   */
  static async protectUserManagement() {
    return await this.requireSuperAdmin();
  }

  /**
   * Protect user list access with filtering based on permissions
   * @param {Object} filters - Optional filters for user list
   * @returns {Promise<Object>} Session and authorized filters
   */
  static async protectUserList(filters = {}) {
    const session = await this.requireAuth();

    // Super admins can see all users
    if (this.isSuperAdmin(session)) {
      return { session, filters };
    }

    // Regular users can only see users in their workspaces
    const workspaceIds = await this.getUserWorkspaceIds(session.id);

    return {
      session,
      filters: {
        ...filters,
        workspaces: {
          some: {
            id: { in: workspaceIds },
          },
        },
      },
    };
  }

  /**
   * Protect user update operations
   * @param {string} userId - User ID to update
   * @param {Object} updateData - Data being updated
   * @returns {Promise<Object>} User object if authorized
   */
  static async protectUserUpdate(userId, updateData = {}) {
    const session = await this.requireAuth();

    // Check if trying to update sensitive fields
    const sensitiveFields = ["isSuperAdmin", "status", "workspaceId"];
    const hasSensitiveUpdates = sensitiveFields.some((field) => field in updateData);

    if (hasSensitiveUpdates) {
      // Only super admins can update sensitive fields
      await this.requireSuperAdmin();
    } else {
      // Users can update their own profile, admins can update any
      if (!this.isSuperAdmin(session)) {
        this.requireOwnership(session.id, userId, "user profile");
      }
    }

    return await this.validateResourceExists(
      (where) => prisma.user.findUnique(where),
      { where: { id: userId } },
      "User"
    );
  }

  /**
   * Protect user deletion (admin only)
   * @param {string} userId - User ID to delete
   * @returns {Promise<Object>} User object if authorized
   */
  static async protectUserDeletion(userId) {
    const session = await this.requireSuperAdmin();

    // Prevent self-deletion
    if (session.id === userId) {
      Logger.warn(`Admin ${session.id} attempted to delete their own account`);
      this.redirectUnauthorized();
    }

    return await this.validateResourceExists(
      (where) => prisma.user.findUnique(where),
      { where: { id: userId } },
      "User"
    );
  }

  /**
   * Get workspace IDs for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of workspace IDs
   */
  static async getUserWorkspaceIds(userId) {
    try {
      const memberships = await prisma.workspaceMember.findMany({
        where: { userId },
        select: { workspaceId: true },
      });
      return memberships.map((m) => m.workspaceId);
    } catch (error) {
      Logger.error("Failed to get user workspace IDs", error);
      return [];
    }
  }

  /**
   * Check if user can invite others to workspace
   * @param {string} userId - User ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<boolean>} True if user can invite
   */
  static async canInviteToWorkspace(userId, workspaceId) {
    try {
      const membership = await this.getWorkspaceMembership(userId, workspaceId);
      if (!membership) return false;

      // Check if user has invite permission or is workspace owner
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerId: true },
      });

      return (
        workspace?.ownerId === userId ||
        (await this.hasPermission(userId, "invite:user", "workspace", workspaceId))
      );
    } catch (error) {
      Logger.error("Failed to check invite permission", error);
      return false;
    }
  }

  /**
   * Protect user invitation operations
   * @param {string} workspaceId - Workspace ID to invite to
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectUserInvitation(workspaceId) {
    const session = await this.requireAuth();

    const canInvite = await this.canInviteToWorkspace(session.id, workspaceId);
    if (!canInvite) {
      Logger.warn(
        `User ${session.id} attempted to invite to workspace ${workspaceId} without permission`
      );
      this.redirectUnauthorized();
    }

    return session;
  }
}

// Exported async functions for use in server components and actions
export async function protectUser() {
  return await UserAuthGuard.protect();
}

export async function protectUserProfile(userId) {
  return await UserAuthGuard.protectProfile(userId);
}

export async function protectUserManagement() {
  return await UserAuthGuard.protectUserManagement();
}

export async function protectUserList(filters = {}) {
  return await UserAuthGuard.protectUserList(filters);
}

export async function protectUserUpdate(userId, updateData = {}) {
  return await UserAuthGuard.protectUserUpdate(userId, updateData);
}

export async function protectUserDeletion(userId) {
  return await UserAuthGuard.protectUserDeletion(userId);
}

export async function protectUserInvitation(workspaceId) {
  return await UserAuthGuard.protectUserInvitation(workspaceId);
}
