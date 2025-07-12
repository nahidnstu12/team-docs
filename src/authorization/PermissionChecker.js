import prisma from "@/lib/prisma";
import Logger from "@/lib/Logger";

/**
 * PermissionChecker - Comprehensive permission checking system
 *
 * Provides centralized permission validation that integrates with the RBAC system,
 * supporting workspace-level, project-level, and resource-level permissions.
 *
 * @class PermissionChecker
 */
export class PermissionChecker {
  /**
   * Check if user has a specific permission
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name (e.g., "create:page")
   * @param {string} scope - Permission scope (e.g., "workspace", "project", "page")
   * @param {string} resourceId - Resource ID for scoped permissions
   * @returns {Promise<boolean>} True if user has permission
   */
  static async hasPermission(userId, permissionName, scope, resourceId = null) {
    try {
      // Check direct user permissions first
      const directPermission = await this.checkDirectUserPermission(
        userId,
        permissionName,
        scope,
        resourceId
      );
      if (directPermission) return true;

      // Check role-based permissions
      const rolePermission = await this.checkRoleBasedPermission(
        userId,
        permissionName,
        scope,
        resourceId
      );
      if (rolePermission) return true;

      // Check ownership-based permissions
      const ownershipPermission = await this.checkOwnershipPermission(
        userId,
        permissionName,
        scope,
        resourceId
      );
      if (ownershipPermission) return true;

      return false;
    } catch (error) {
      Logger.error("Failed to check permission", {
        userId,
        permissionName,
        scope,
        resourceId,
        error,
      });
      return false;
    }
  }

  /**
   * Check direct user permissions (ProjectUserPermission table)
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} True if user has direct permission
   */
  static async checkDirectUserPermission(userId, permissionName, scope, resourceId) {
    try {
      if (scope === "project" && resourceId) {
        const permission = await prisma.projectUserPermission.findFirst({
          where: {
            userId,
            projectId: resourceId,
            permission: {
              name: permissionName,
              scope,
            },
          },
        });
        return !!permission;
      }

      return false;
    } catch (error) {
      Logger.error("Failed to check direct user permission", error);
      return false;
    }
  }

  /**
   * Check role-based permissions through memberships
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} True if user has role-based permission
   */
  static async checkRoleBasedPermission(userId, permissionName, scope, resourceId) {
    try {
      if (scope === "workspace" && resourceId) {
        return await this.checkWorkspaceRolePermission(userId, permissionName, resourceId);
      }

      if (scope === "project" && resourceId) {
        return await this.checkProjectRolePermission(userId, permissionName, resourceId);
      }

      return false;
    } catch (error) {
      Logger.error("Failed to check role-based permission", error);
      return false;
    }
  }

  /**
   * Check workspace role permissions
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<boolean>} True if user has workspace role permission
   */
  static async checkWorkspaceRolePermission(userId, permissionName, workspaceId) {
    try {
      const membership = await prisma.workspaceMember.findFirst({
        where: {
          userId,
          workspaceId,
        },
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
      });

      if (!membership) return false;

      return membership.role.permissions.some(
        (rp) => rp.permission.name === permissionName && rp.permission.scope === "workspace"
      );
    } catch (error) {
      Logger.error("Failed to check workspace role permission", error);
      return false;
    }
  }

  /**
   * Check project role permissions
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} True if user has project role permission
   */
  static async checkProjectRolePermission(userId, permissionName, projectId) {
    try {
      const membership = await prisma.projectMember.findFirst({
        where: {
          userId,
          projectId,
        },
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
      });

      if (!membership) return false;

      return membership.role.permissions.some(
        (rp) => rp.permission.name === permissionName && rp.permission.scope === "project"
      );
    } catch (error) {
      Logger.error("Failed to check project role permission", error);
      return false;
    }
  }

  /**
   * Check ownership-based permissions
   * @param {string} userId - User ID
   * @param {string} permissionName - Permission name
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} True if user has ownership permission
   */
  static async checkOwnershipPermission(userId, permissionName, scope, resourceId) {
    try {
      // Define ownership-based permissions
      const ownershipPermissions = {
        workspace: ["manage:workspace", "delete:workspace", "invite:user", "manage:members"],
        project: ["manage:project", "delete:project", "edit:project", "create:section"],
        section: ["edit:section", "delete:section", "create:page"],
        page: ["edit:page", "delete:page", "share:page"],
      };

      if (!ownershipPermissions[scope]?.includes(permissionName)) {
        return false;
      }

      return await this.checkResourceOwnership(userId, scope, resourceId);
    } catch (error) {
      Logger.error("Failed to check ownership permission", error);
      return false;
    }
  }

  /**
   * Check if user owns a resource
   * @param {string} userId - User ID
   * @param {string} resourceType - Resource type
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} True if user owns resource
   */
  static async checkResourceOwnership(userId, resourceType, resourceId) {
    try {
      switch (resourceType) {
        case "workspace":
          const workspace = await prisma.workspace.findUnique({
            where: { id: resourceId },
            select: { ownerId: true },
          });
          return workspace?.ownerId === userId;

        case "project":
          const project = await prisma.project.findUnique({
            where: { id: resourceId },
            select: { ownerId: true },
          });
          return project?.ownerId === userId;

        case "section":
          const section = await prisma.section.findUnique({
            where: { id: resourceId },
            select: { ownerId: true },
          });
          return section?.ownerId === userId;

        case "page":
          const page = await prisma.page.findUnique({
            where: { id: resourceId },
            select: { ownerId: true },
          });
          return page?.ownerId === userId;

        default:
          return false;
      }
    } catch (error) {
      Logger.error("Failed to check resource ownership", error);
      return false;
    }
  }

  /**
   * Check multiple permissions at once
   * @param {string} userId - User ID
   * @param {Array} permissions - Array of permission objects {name, scope, resourceId}
   * @param {string} logic - "AND" or "OR" logic
   * @returns {Promise<boolean>} True if permission check passes
   */
  static async checkMultiplePermissions(userId, permissions, logic = "AND") {
    try {
      const results = await Promise.all(
        permissions.map((p) => this.hasPermission(userId, p.name, p.scope, p.resourceId))
      );

      return logic === "AND" ? results.every((r) => r) : results.some((r) => r);
    } catch (error) {
      Logger.error("Failed to check multiple permissions", error);
      return false;
    }
  }

  /**
   * Get all permissions for a user in a specific scope
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Array>} Array of permission names
   */
  static async getUserPermissions(userId, scope, resourceId = null) {
    try {
      const permissions = new Set();

      // Get direct permissions
      const directPermissions = await this.getDirectUserPermissions(userId, scope, resourceId);
      directPermissions.forEach((p) => permissions.add(p));

      // Get role-based permissions
      const rolePermissions = await this.getRoleBasedPermissions(userId, scope, resourceId);
      rolePermissions.forEach((p) => permissions.add(p));

      // Get ownership permissions
      const ownershipPermissions = await this.getOwnershipPermissions(userId, scope, resourceId);
      ownershipPermissions.forEach((p) => permissions.add(p));

      return Array.from(permissions);
    } catch (error) {
      Logger.error("Failed to get user permissions", error);
      return [];
    }
  }

  /**
   * Get direct user permissions
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Array>} Array of permission names
   */
  static async getDirectUserPermissions(userId, scope, resourceId) {
    try {
      if (scope === "project" && resourceId) {
        const permissions = await prisma.projectUserPermission.findMany({
          where: {
            userId,
            projectId: resourceId,
            permission: { scope },
          },
          include: { permission: true },
        });
        return permissions.map((p) => p.permission.name);
      }

      return [];
    } catch (error) {
      Logger.error("Failed to get direct user permissions", error);
      return [];
    }
  }

  /**
   * Get role-based permissions
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Array>} Array of permission names
   */
  static async getRoleBasedPermissions(userId, scope, resourceId) {
    try {
      const permissions = [];

      if (scope === "workspace" && resourceId) {
        const membership = await prisma.workspaceMember.findFirst({
          where: { userId, workspaceId: resourceId },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        if (membership) {
          permissions.push(
            ...membership.role.permissions
              .filter((rp) => rp.permission.scope === "workspace")
              .map((rp) => rp.permission.name)
          );
        }
      }

      if (scope === "project" && resourceId) {
        const membership = await prisma.projectMember.findFirst({
          where: { userId, projectId: resourceId },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        if (membership) {
          permissions.push(
            ...membership.role.permissions
              .filter((rp) => rp.permission.scope === "project")
              .map((rp) => rp.permission.name)
          );
        }
      }

      return permissions;
    } catch (error) {
      Logger.error("Failed to get role-based permissions", error);
      return [];
    }
  }

  /**
   * Get ownership-based permissions
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Array>} Array of permission names
   */
  static async getOwnershipPermissions(userId, scope, resourceId) {
    try {
      const ownershipPermissions = {
        workspace: ["manage:workspace", "delete:workspace", "invite:user", "manage:members"],
        project: ["manage:project", "delete:project", "edit:project", "create:section"],
        section: ["edit:section", "delete:section", "create:page"],
        page: ["edit:page", "delete:page", "share:page"],
      };

      const isOwner = await this.checkResourceOwnership(userId, scope, resourceId);
      return isOwner ? ownershipPermissions[scope] || [] : [];
    } catch (error) {
      Logger.error("Failed to get ownership permissions", error);
      return [];
    }
  }

  /**
   * Check if user can perform action on resource
   * @param {string} userId - User ID
   * @param {string} action - Action to perform
   * @param {string} resourceType - Resource type
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} True if action is allowed
   */
  static async canPerformAction(userId, action, resourceType, resourceId) {
    const permissionName = `${action}:${resourceType}`;
    return await this.hasPermission(userId, permissionName, resourceType, resourceId);
  }
}
