"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * WorkspaceAuthGuard - Authorization guard for workspace-related operations
 *
 * Internal class for workspace authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class WorkspaceAuthGuard extends BaseAuthGuard {
  /**
   * Protect workspace access - requires membership
   * @param {string} workspaceId - Workspace ID to access
   * @returns {Promise<Object>} Workspace membership object
   */
  static async protect(workspaceId) {
    const session = await this.requireAuth();
    return await this.requireWorkspaceMembership(session.id, workspaceId);
  }

  /**
   * Protect workspace by slug - requires membership
   * @param {string} slug - Workspace slug
   * @returns {Promise<Object>} Workspace object with membership
   */
  static async protectBySlug(slug) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { slug } },
      "Workspace"
    );

    const membership = await this.requireWorkspaceMembership(session.id, workspace.id);

    return { workspace, membership };
  }

  /**
   * Protect workspace ownership operations
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Workspace object if user is owner
   */
  static async protectOwnership(workspaceId) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { id: workspaceId } },
      "Workspace"
    );

    // Super admins can manage any workspace
    if (!this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, workspace.ownerId, "workspace");
    }

    return workspace;
  }

  /**
   * Protect workspace management operations (owner or admin)
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Workspace object and user role
   */
  static async protectManagement(workspaceId) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { id: workspaceId } },
      "Workspace"
    );

    // Super admins can manage any workspace
    if (this.isSuperAdmin(session)) {
      return { workspace, role: "super_admin" };
    }

    // Workspace owners can manage their workspace
    if (this.isOwner(session.id, workspace.ownerId)) {
      return { workspace, role: "owner" };
    }

    // Check for management permissions
    const hasManagePermission = await this.hasPermission(
      session.id,
      "manage:workspace",
      "workspace",
      workspaceId
    );

    if (!hasManagePermission) {
      Logger.warn(
        `User ${session.id} attempted to manage workspace ${workspaceId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { workspace, role: "manager" };
  }

  /**
   * Protect workspace creation
   * @returns {Promise<Object>} User session if authorized
   */
  static async protectCreation() {
    const session = await this.requireAuth();

    // Check if user can create workspaces (could be limited by plan, etc.)
    const canCreate = await this.canCreateWorkspace(session.id);
    if (!canCreate) {
      Logger.warn(`User ${session.id} attempted to create workspace without permission`);
      this.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect workspace deletion (owner only)
   * @param {string} workspaceId - Workspace ID to delete
   * @returns {Promise<Object>} Workspace object if authorized
   */
  static async protectDeletion(workspaceId) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { id: workspaceId } },
      "Workspace"
    );

    // Only super admins or workspace owners can delete
    if (!this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, workspace.ownerId, "workspace");
    }

    return workspace;
  }

  /**
   * Protect workspace member management
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Workspace and membership info
   */
  static async protectMemberManagement(workspaceId) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { id: workspaceId } },
      "Workspace"
    );

    // Super admins can manage any workspace members
    if (this.isSuperAdmin(session)) {
      return { workspace, canManage: true, role: "super_admin" };
    }

    // Workspace owners can manage members
    if (this.isOwner(session.id, workspace.ownerId)) {
      return { workspace, canManage: true, role: "owner" };
    }

    // Check for member management permissions
    const canManageMembers = await this.hasPermission(
      session.id,
      "manage:members",
      "workspace",
      workspaceId
    );

    if (!canManageMembers) {
      Logger.warn(
        `User ${session.id} attempted to manage members in workspace ${workspaceId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { workspace, canManage: true, role: "manager" };
  }

  /**
   * Protect workspace settings access
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Workspace object if authorized
   */
  static async protectSettings(workspaceId) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { id: workspaceId } },
      "Workspace"
    );

    // Check if user can access workspace settings
    const canAccessSettings =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, workspace.ownerId) ||
      (await this.hasPermission(session.id, "view:settings", "workspace", workspaceId));

    if (!canAccessSettings) {
      Logger.warn(
        `User ${session.id} attempted to access settings for workspace ${workspaceId} without permission`
      );
      this.redirectUnauthorized();
    }

    return workspace;
  }

  /**
   * Check if user can create workspaces
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user can create workspaces
   */
  static async canCreateWorkspace(userId) {
    try {
      // For now, all authenticated users can create workspaces
      // This could be extended to check subscription limits, etc.
      return true;
    } catch (error) {
      Logger.error("Failed to check workspace creation permission", error);
      return false;
    }
  }

  /**
   * Get user's role in workspace
   * @param {string} userId - User ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<string|null>} User's role in workspace
   */
  static async getUserRole(userId, workspaceId) {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerId: true },
      });

      if (workspace?.ownerId === userId) {
        return "owner";
      }

      const membership = await this.getWorkspaceMembership(userId, workspaceId);
      return membership?.role?.name || null;
    } catch (error) {
      Logger.error("Failed to get user role in workspace", error);
      return null;
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
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerId: true },
      });

      // Workspace owners can always invite
      if (workspace?.ownerId === userId) {
        return true;
      }

      // Check for invite permission
      return await this.hasPermission(userId, "invite:user", "workspace", workspaceId);
    } catch (error) {
      Logger.error("Failed to check invite permission", error);
      return false;
    }
  }

  /**
   * Protect workspace invitation operations
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectInvitation(workspaceId) {
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
export async function protectWorkspace(workspaceId) {
  return await WorkspaceAuthGuard.protect(workspaceId);
}

export async function protectWorkspaceBySlug(slug) {
  return await WorkspaceAuthGuard.protectBySlug(slug);
}

export async function protectWorkspaceOwnership(workspaceId) {
  return await WorkspaceAuthGuard.protectOwnership(workspaceId);
}

export async function protectWorkspaceManagement(workspaceId) {
  return await WorkspaceAuthGuard.protectManagement(workspaceId);
}

export async function protectWorkspaceCreation() {
  return await WorkspaceAuthGuard.protectCreation();
}

export async function protectWorkspaceDeletion(workspaceId) {
  return await WorkspaceAuthGuard.protectDeletion(workspaceId);
}

export async function protectWorkspaceMemberManagement(workspaceId) {
  return await WorkspaceAuthGuard.protectMemberManagement(workspaceId);
}

export async function protectWorkspaceSettings(workspaceId) {
  return await WorkspaceAuthGuard.protectSettings(workspaceId);
}

export async function protectWorkspaceInvitation(workspaceId) {
  return await WorkspaceAuthGuard.protectInvitation(workspaceId);
}
