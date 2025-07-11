import { Session } from "@/lib/Session";
import { notFound, forbidden } from "next/navigation";
import prisma from "@/lib/prisma";
import Logger from "@/lib/Logger";

/**
 * BaseAuthGuard - Laravel-like authorization base class
 *
 * Base class for authorization logic that can be inherited by
 * resource-specific authorization guards. This is a utility class
 * that does not use "use server" directive.
 */
export class BaseAuthGuard {
  /**
   * Get the current authenticated user session
   * @returns {Promise<Object|null>} User session object or null
   */
  static async getSession() {
    try {
      return await Session.getCurrentUser();
    } catch (error) {
      Logger.error("Failed to get session", error);
      return null;
    }
  }

  /**
   * Require authentication - throws forbidden if not authenticated
   * @returns {Promise<Object>} User session object
   * @throws {Error} Forbidden error if not authenticated
   */
  static async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      Logger.warn("Unauthorized access attempt");
      this.redirectUnauthorized();
    }
    return session;
  }

  /**
   * Check if user is a super admin
   * @param {Object} session - User session object
   * @returns {boolean} True if user is super admin
   */
  static isSuperAdmin(session) {
    return session?.isSuperAdmin === true;
  }

  /**
   * Require super admin privileges
   * @returns {Promise<Object>} User session object
   * @throws {Error} Forbidden error if not super admin
   */
  static async requireSuperAdmin() {
    const session = await this.requireAuth();
    if (!this.isSuperAdmin(session)) {
      Logger.warn(`Non-admin user ${session.id} attempted admin access`);
      this.redirectUnauthorized();
    }
    return session;
  }

  /**
   * Check if user owns a resource
   * @param {string} userId - User ID to check
   * @param {string} resourceOwnerId - Resource owner ID
   * @returns {boolean} True if user owns the resource
   */
  static isOwner(userId, resourceOwnerId) {
    return userId === resourceOwnerId;
  }

  /**
   * Require resource ownership
   * @param {string} userId - User ID to check
   * @param {string} resourceOwnerId - Resource owner ID
   * @param {string} resourceType - Type of resource for logging
   * @throws {Error} Forbidden error if not owner
   */
  static requireOwnership(userId, resourceOwnerId, resourceType = "resource") {
    if (!this.isOwner(userId, resourceOwnerId)) {
      Logger.warn(
        `User ${userId} attempted unauthorized access to ${resourceType} owned by ${resourceOwnerId}`
      );
      this.redirectUnauthorized();
    }
  }

  /**
   * Check if user has workspace membership
   * @param {string} userId - User ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object|null>} Workspace membership or null
   */
  static async getWorkspaceMembership(userId, workspaceId) {
    try {
      return await prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspaceId,
        },
        include: {
          role: true,
          workspace: true,
        },
      });
    } catch (error) {
      Logger.error("Failed to get workspace membership", error);
      return null;
    }
  }

  /**
   * Require workspace membership
   * @param {string} userId - User ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Workspace membership object
   * @throws {Error} Forbidden error if not a member
   */
  static async requireWorkspaceMembership(userId, workspaceId) {
    const membership = await this.getWorkspaceMembership(userId, workspaceId);
    if (!membership) {
      Logger.warn(`User ${userId} attempted access to workspace ${workspaceId} without membership`);
      this.redirectUnauthorized();
    }
    return membership;
  }

  /**
   * Check if user has project membership
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<Object|null>} Project membership or null
   */
  static async getProjectMembership(userId, projectId) {
    try {
      return await prisma.projectMember.findFirst({
        where: {
          userId,
          projectId,
        },
        include: {
          role: true,
          project: {
            include: {
              workspace: true,
            },
          },
        },
      });
    } catch (error) {
      Logger.error("Failed to get project membership", error);
      return null;
    }
  }

  /**
   * Require project membership
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project membership object
   * @throws {Error} Forbidden error if not a member
   */
  static async requireProjectMembership(userId, projectId) {
    const membership = await this.getProjectMembership(userId, projectId);
    if (!membership) {
      Logger.warn(`User ${userId} attempted access to project ${projectId} without membership`);
      this.redirectUnauthorized();
    }
    return membership;
  }

  /**
   * Check if user has specific permission
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name (e.g., "create:page")
   * @param {string} scope - Permission scope (e.g., "project", "workspace")
   * @param {string} resourceId - Resource ID for scoped permissions
   * @returns {Promise<boolean>} True if user has permission
   */
  static async hasPermission(userId, permissionName, scope, resourceId = null) {
    try {
      // Check direct user permissions
      const userPermission = await prisma.projectUserPermission.findFirst({
        where: {
          userId,
          ...(resourceId && { projectId: resourceId }),
          permission: {
            name: permissionName,
            scope,
          },
        },
        include: {
          permission: true,
        },
      });

      if (userPermission) return true;

      // Check role-based permissions through workspace membership
      if (scope === "workspace" && resourceId) {
        const membership = await this.getWorkspaceMembership(userId, resourceId);
        if (membership) {
          const rolePermission = await prisma.rolePermissionAssignment.findFirst({
            where: {
              roleId: membership.roleId,
              permission: {
                name: permissionName,
                scope,
              },
            },
          });
          return !!rolePermission;
        }
      }

      // Check role-based permissions through project membership
      if (scope === "project" && resourceId) {
        const membership = await this.getProjectMembership(userId, resourceId);
        if (membership) {
          const rolePermission = await prisma.rolePermissionAssignment.findFirst({
            where: {
              roleId: membership.roleId,
              permission: {
                name: permissionName,
                scope,
              },
            },
          });
          return !!rolePermission;
        }
      }

      return false;
    } catch (error) {
      Logger.error("Failed to check permission", error);
      return false;
    }
  }

  /**
   * Require specific permission
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID for scoped permissions
   * @throws {Error} Forbidden error if permission not granted
   */
  static async requirePermission(userId, permissionName, scope, resourceId = null) {
    const hasPermission = await this.hasPermission(userId, permissionName, scope, resourceId);
    if (!hasPermission) {
      Logger.warn(
        `User ${userId} lacks permission ${permissionName} for ${scope} ${resourceId || "global"}`
      );
      this.redirectUnauthorized();
    }
  }

  /**
   * Redirect to unauthorized page
   * @throws {Error} Forbidden error
   */
  static redirectUnauthorized() {
    return forbidden();
  }

  /**
   * Redirect to not found page
   * @throws {Error} Not found error
   */
  static notFound() {
    return notFound();
  }

  /**
   * Validate resource exists and return it
   * @param {Function} findFunction - Prisma find function
   * @param {Object} whereClause - Where clause for finding resource
   * @param {string} resourceType - Resource type for error logging
   * @returns {Promise<Object>} Resource object
   * @throws {Error} Not found error if resource doesn't exist
   */
  static async validateResourceExists(findFunction, whereClause, resourceType = "resource") {
    try {
      const resource = await findFunction(whereClause);
      if (!resource) {
        Logger.warn(`${resourceType} not found with criteria:`, whereClause);
        this.notFound();
      }
      return resource;
    } catch (error) {
      Logger.error(`Failed to validate ${resourceType} exists`, error);
      this.notFound();
    }
  }

  /**
   * Check multiple conditions with AND logic
   * @param {Array<Function>} conditions - Array of async condition functions
   * @returns {Promise<boolean>} True if all conditions pass
   */
  static async checkAllConditions(conditions) {
    try {
      const results = await Promise.all(conditions.map((condition) => condition()));
      return results.every((result) => result === true);
    } catch (error) {
      Logger.error("Failed to check conditions", error);
      return false;
    }
  }

  /**
   * Check multiple conditions with OR logic
   * @param {Array<Function>} conditions - Array of async condition functions
   * @returns {Promise<boolean>} True if any condition passes
   */
  static async checkAnyCondition(conditions) {
    try {
      const results = await Promise.all(conditions.map((condition) => condition()));
      return results.some((result) => result === true);
    } catch (error) {
      Logger.error("Failed to check conditions", error);
      return false;
    }
  }
}
