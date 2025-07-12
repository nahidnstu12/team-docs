"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * RoleAuthGuard - Authorization guard for role-related operations
 *
 * Internal class for role authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class RoleAuthGuard extends BaseAuthGuard {
  /**
   * Protect role access - users can only access their own roles or system roles
   * @param {string} roleId - Role ID to access
   * @returns {Promise<Object>} Role object if authorized
   */
  static async protect(roleId) {
    const session = await this.requireAuth();

    const role = await this.validateResourceExists(
      (where) => prisma.role.findUnique(where),
      { where: { id: roleId } },
      "Role"
    );

    // Super admins can access any role
    if (this.isSuperAdmin(session)) {
      return role;
    }

    // Users can access system roles or their own created roles
    if (!role.isSystem && !this.isOwner(session.id, role.ownerId)) {
      Logger.warn(`User ${session.id} attempted to access role ${roleId} without permission`);
      this.redirectUnauthorized();
    }

    return role;
  }

  /**
   * Protect role creation
   * @returns {Promise<Object>} User session if authorized
   */
  static async protectCreation() {
    const session = await this.requireAuth();

    // Check if user can create roles
    const canCreate = await this.canCreateRole(session.id);
    if (!canCreate) {
      Logger.warn(`User ${session.id} attempted to create role without permission`);
      this.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect role update operations
   * @param {string} roleId - Role ID to update
   * @param {Object} updateData - Data being updated
   * @returns {Promise<Object>} Role object if authorized
   */
  static async protectUpdate(roleId, updateData = {}) {
    const session = await this.requireAuth();

    const role = await this.validateResourceExists(
      (where) => prisma.role.findUnique(where),
      { where: { id: roleId } },
      "Role"
    );

    // System roles can only be updated by super admins
    if (role.isSystem && !this.isSuperAdmin(session)) {
      Logger.warn(`User ${session.id} attempted to update system role ${roleId}`);
      this.redirectUnauthorized();
    }

    // Custom roles can only be updated by their owners or super admins
    if (!role.isSystem && !this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, role.ownerId, "role");
    }

    return role;
  }

  /**
   * Protect role deletion
   * @param {string} roleId - Role ID to delete
   * @returns {Promise<Object>} Role object if authorized
   */
  static async protectDeletion(roleId) {
    const session = await this.requireAuth();

    const role = await this.validateResourceExists(
      (where) => prisma.role.findUnique(where),
      { where: { id: roleId } },
      "Role"
    );

    // System roles cannot be deleted
    if (role.isSystem) {
      Logger.warn(`User ${session.id} attempted to delete system role ${roleId}`);
      this.redirectUnauthorized();
    }

    // Custom roles can only be deleted by their owners or super admins
    if (!this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, role.ownerId, "role");
    }

    // Check if role is in use before deletion
    const isInUse = await this.isRoleInUse(roleId);
    if (isInUse) {
      Logger.warn(`User ${session.id} attempted to delete role ${roleId} that is in use`);
      throw new Error("Cannot delete role that is currently assigned to users");
    }

    return role;
  }

  /**
   * Protect role assignment operations
   * @param {string} roleId - Role ID to assign
   * @param {string} targetUserId - User ID to assign role to
   * @param {string} scope - Assignment scope (workspace, project)
   * @param {string} scopeId - Scope ID
   * @returns {Promise<Object>} Role and assignment info
   */
  static async protectAssignment(roleId, targetUserId, scope, scopeId) {
    const session = await this.requireAuth();

    const role = await this.protect(roleId);

    // Check if user can assign roles in the given scope
    const canAssign = await this.canAssignRole(session.id, scope, scopeId);
    if (!canAssign) {
      Logger.warn(
        `User ${session.id} attempted to assign role ${roleId} in ${scope} ${scopeId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { role, canAssign: true };
  }

  /**
   * Protect role list access with filtering
   * @param {Object} filters - Optional filters for role list
   * @returns {Promise<Object>} Session and authorized filters
   */
  static async protectList(filters = {}) {
    const session = await this.requireAuth();

    // Super admins can see all roles
    if (this.isSuperAdmin(session)) {
      return { session, filters };
    }

    // Regular users can only see system roles and their own roles
    return {
      session,
      filters: {
        ...filters,
        OR: [{ isSystem: true }, { ownerId: session.id }],
      },
    };
  }

  /**
   * Check if user can create roles
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user can create roles
   */
  static async canCreateRole(userId) {
    try {
      // For now, all authenticated users can create custom roles
      // This could be extended to check workspace limits, etc.
      return true;
    } catch (error) {
      Logger.error("Failed to check role creation permission", error);
      return false;
    }
  }

  /**
   * Check if user can assign roles in given scope
   * @param {string} userId - User ID
   * @param {string} scope - Assignment scope
   * @param {string} scopeId - Scope ID
   * @returns {Promise<boolean>} True if user can assign roles
   */
  static async canAssignRole(userId, scope, scopeId) {
    try {
      if (scope === "workspace") {
        const workspace = await prisma.workspace.findUnique({
          where: { id: scopeId },
          select: { ownerId: true },
        });

        // Workspace owners can assign roles
        if (workspace?.ownerId === userId) return true;

        // Check for role assignment permission
        return await this.hasPermission(userId, "assign:role", "workspace", scopeId);
      }

      if (scope === "project") {
        const project = await prisma.project.findUnique({
          where: { id: scopeId },
          include: { workspace: true },
        });

        // Project owners can assign roles
        if (project?.ownerId === userId) return true;

        // Workspace owners can assign roles in their projects
        if (project?.workspace.ownerId === userId) return true;

        // Check for role assignment permission
        return await this.hasPermission(userId, "assign:role", "project", scopeId);
      }

      return false;
    } catch (error) {
      Logger.error("Failed to check role assignment permission", error);
      return false;
    }
  }

  /**
   * Check if role is currently in use
   * @param {string} roleId - Role ID
   * @returns {Promise<boolean>} True if role is in use
   */
  static async isRoleInUse(roleId) {
    try {
      const workspaceUsage = await prisma.workspaceMember.count({
        where: { roleId },
      });

      const projectUsage = await prisma.projectMember.count({
        where: { roleId },
      });

      return workspaceUsage > 0 || projectUsage > 0;
    } catch (error) {
      Logger.error("Failed to check role usage", error);
      return true; // Err on the side of caution
    }
  }

  /**
   * Get roles available to user
   * @param {string} userId - User ID
   * @param {string} scope - Role scope
   * @returns {Promise<Array>} Available roles
   */
  static async getAvailableRoles(userId, scope = null) {
    try {
      const session = await this.getSession();

      if (this.isSuperAdmin(session)) {
        // Super admins can see all roles
        return await prisma.role.findMany({
          where: scope ? { scope } : undefined,
          orderBy: { name: "asc" },
        });
      }

      // Regular users can see system roles and their own roles
      return await prisma.role.findMany({
        where: {
          OR: [{ isSystem: true }, { ownerId: userId }],
          ...(scope && { scope }),
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      Logger.error("Failed to get available roles", error);
      return [];
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectRole(roleId) {
  return await RoleAuthGuard.protect(roleId);
}

export async function protectRoleCreation() {
  return await RoleAuthGuard.protectCreation();
}

export async function protectRoleUpdate(roleId) {
  return await RoleAuthGuard.protectUpdate(roleId);
}

export async function protectRoleDeletion(roleId) {
  return await RoleAuthGuard.protectDeletion(roleId);
}

export async function protectRoleAssignment(roleId, targetUserId) {
  return await RoleAuthGuard.protectAssignment(roleId, targetUserId);
}

export async function protectRoleList(filters = {}) {
  return await RoleAuthGuard.protectList(filters);
}

export async function protectRoleManagement() {
  return await RoleAuthGuard.protectManagement();
}

export async function protectRolePermissionManagement(roleId) {
  return await RoleAuthGuard.protectPermissionManagement(roleId);
}

export async function getAvailableRoles(scope = null) {
  return await RoleAuthGuard.getAvailableRoles(scope);
}
