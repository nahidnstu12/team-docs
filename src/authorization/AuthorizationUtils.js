import { BaseAuthGuard } from "./BaseAuthGuard";
import { PermissionChecker } from "./PermissionChecker";
import Logger from "@/lib/Logger";

/**
 * AuthorizationUtils - Utility functions for authorization
 *
 * Provides helper functions, decorators, and utilities to streamline
 * authorization checks across server components, server actions, and API routes.
 *
 * @class AuthorizationUtils
 */
export class AuthorizationUtils {
  /**
   * Create an authorization decorator for server actions
   * @param {Function} authCheck - Authorization check function
   * @returns {Function} Decorator function
   */
  static withAuth(authCheck) {
    return function (target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args) {
        try {
          await authCheck(...args);
          return await originalMethod.apply(this, args);
        } catch (error) {
          Logger.error(`Authorization failed for ${propertyKey}`, error);
          throw error;
        }
      };

      return descriptor;
    };
  }

  /**
   * Create a permission-based authorization wrapper
   * @param {string} permission - Permission name
   * @param {string} scope - Permission scope
   * @param {Function} resourceIdExtractor - Function to extract resource ID from args
   * @returns {Function} Authorization wrapper
   */
  static requirePermission(permission, scope, resourceIdExtractor = null) {
    return async function (serverAction) {
      return async function (...args) {
        const session = await BaseAuthGuard.requireAuth();
        const resourceId = resourceIdExtractor ? resourceIdExtractor(...args) : null;

        const hasPermission = await PermissionChecker.hasPermission(
          session.id,
          permission,
          scope,
          resourceId
        );

        if (!hasPermission) {
          Logger.warn(
            `User ${session.id} lacks permission ${permission} for ${scope} ${
              resourceId || "global"
            }`
          );
          BaseAuthGuard.redirectUnauthorized();
        }

        return await serverAction(...args);
      };
    };
  }

  /**
   * Create an ownership-based authorization wrapper
   * @param {string} resourceType - Resource type
   * @param {Function} resourceIdExtractor - Function to extract resource ID from args
   * @returns {Function} Authorization wrapper
   */
  static requireOwnership(resourceType, resourceIdExtractor) {
    return async function (serverAction) {
      return async function (...args) {
        const session = await BaseAuthGuard.requireAuth();
        const resourceId = resourceIdExtractor(...args);

        const isOwner = await PermissionChecker.checkResourceOwnership(
          session.id,
          resourceType,
          resourceId
        );

        if (!isOwner && !BaseAuthGuard.isSuperAdmin(session)) {
          Logger.warn(
            `User ${session.id} attempted unauthorized access to ${resourceType} ${resourceId}`
          );
          BaseAuthGuard.redirectUnauthorized();
        }

        return await serverAction(...args);
      };
    };
  }

  /**
   * Create a workspace membership authorization wrapper
   * @param {Function} workspaceIdExtractor - Function to extract workspace ID from args
   * @returns {Function} Authorization wrapper
   */
  static requireWorkspaceMembership(workspaceIdExtractor) {
    return async function (serverAction) {
      return async function (...args) {
        const session = await BaseAuthGuard.requireAuth();
        const workspaceId = workspaceIdExtractor(...args);

        await BaseAuthGuard.requireWorkspaceMembership(session.id, workspaceId);

        return await serverAction(...args);
      };
    };
  }

  /**
   * Create a project membership authorization wrapper
   * @param {Function} projectIdExtractor - Function to extract project ID from args
   * @returns {Function} Authorization wrapper
   */
  static requireProjectMembership(projectIdExtractor) {
    return async function (serverAction) {
      return async function (...args) {
        const session = await BaseAuthGuard.requireAuth();
        const projectId = projectIdExtractor(...args);

        await BaseAuthGuard.requireProjectMembership(session.id, projectId);

        return await serverAction(...args);
      };
    };
  }

  /**
   * Create a multi-condition authorization wrapper
   * @param {Array} conditions - Array of condition functions
   * @param {string} logic - "AND" or "OR" logic
   * @returns {Function} Authorization wrapper
   */
  static requireConditions(conditions, logic = "AND") {
    return async function (serverAction) {
      return async function (...args) {
        const session = await BaseAuthGuard.requireAuth();

        const results = await Promise.all(
          conditions.map((condition) => condition(session, ...args))
        );

        const passed = logic === "AND" ? results.every((r) => r) : results.some((r) => r);

        if (!passed) {
          Logger.warn(`User ${session.id} failed multi-condition authorization check`);
          BaseAuthGuard.redirectUnauthorized();
        }

        return await serverAction(...args);
      };
    };
  }

  /**
   * Check if user can access resource with fallback to ownership
   * @param {string} userId - User ID
   * @param {string} permission - Permission name
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} True if user can access
   */
  static async canAccessWithOwnership(userId, permission, scope, resourceId) {
    try {
      // Check permission first
      const hasPermission = await PermissionChecker.hasPermission(
        userId,
        permission,
        scope,
        resourceId
      );
      if (hasPermission) return true;

      // Fallback to ownership check
      return await PermissionChecker.checkResourceOwnership(userId, scope, resourceId);
    } catch (error) {
      Logger.error("Failed to check access with ownership", error);
      return false;
    }
  }

  /**
   * Get user's effective permissions for a resource
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Object>} Permissions object with arrays of permissions
   */
  static async getUserEffectivePermissions(userId, scope, resourceId) {
    try {
      const [directPermissions, rolePermissions, ownershipPermissions] = await Promise.all([
        PermissionChecker.getDirectUserPermissions(userId, scope, resourceId),
        PermissionChecker.getRoleBasedPermissions(userId, scope, resourceId),
        PermissionChecker.getOwnershipPermissions(userId, scope, resourceId),
      ]);

      return {
        direct: directPermissions,
        role: rolePermissions,
        ownership: ownershipPermissions,
        all: [...new Set([...directPermissions, ...rolePermissions, ...ownershipPermissions])],
      };
    } catch (error) {
      Logger.error("Failed to get effective permissions", error);
      return { direct: [], role: [], ownership: [], all: [] };
    }
  }

  /**
   * Create authorization context for a user and resource
   * @param {string} userId - User ID
   * @param {string} scope - Permission scope
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Object>} Authorization context
   */
  static async createAuthContext(userId, scope, resourceId) {
    try {
      const [permissions, isOwner, session] = await Promise.all([
        this.getUserEffectivePermissions(userId, scope, resourceId),
        PermissionChecker.checkResourceOwnership(userId, scope, resourceId),
        BaseAuthGuard.getSession(),
      ]);

      return {
        userId,
        scope,
        resourceId,
        permissions,
        isOwner,
        isSuperAdmin: BaseAuthGuard.isSuperAdmin(session),
        canRead: await this.canAccessWithOwnership(userId, `read:${scope}`, scope, resourceId),
        canWrite: await this.canAccessWithOwnership(userId, `write:${scope}`, scope, resourceId),
        canDelete: await this.canAccessWithOwnership(userId, `delete:${scope}`, scope, resourceId),
        canManage: await this.canAccessWithOwnership(userId, `manage:${scope}`, scope, resourceId),
      };
    } catch (error) {
      Logger.error("Failed to create auth context", error);
      return null;
    }
  }

  /**
   * Validate authorization context for common operations
   * @param {Object} authContext - Authorization context
   * @param {string} operation - Operation to validate
   * @returns {boolean} True if operation is allowed
   */
  static validateOperation(authContext, operation) {
    if (!authContext) return false;

    switch (operation) {
      case "read":
        return authContext.canRead || authContext.isOwner || authContext.isSuperAdmin;
      case "write":
      case "update":
        return authContext.canWrite || authContext.isOwner || authContext.isSuperAdmin;
      case "delete":
        return authContext.canDelete || authContext.isOwner || authContext.isSuperAdmin;
      case "manage":
        return authContext.canManage || authContext.isOwner || authContext.isSuperAdmin;
      default:
        return (
          authContext.permissions.all.includes(`${operation}:${authContext.scope}`) ||
          authContext.isOwner ||
          authContext.isSuperAdmin
        );
    }
  }

  /**
   * Create a resource-specific authorization helper
   * @param {string} resourceType - Resource type
   * @returns {Object} Resource-specific authorization methods
   */
  static createResourceAuth(resourceType) {
    return {
      canRead: (userId, resourceId) =>
        this.canAccessWithOwnership(userId, `read:${resourceType}`, resourceType, resourceId),

      canWrite: (userId, resourceId) =>
        this.canAccessWithOwnership(userId, `write:${resourceType}`, resourceType, resourceId),

      canDelete: (userId, resourceId) =>
        this.canAccessWithOwnership(userId, `delete:${resourceType}`, resourceType, resourceId),

      canManage: (userId, resourceId) =>
        this.canAccessWithOwnership(userId, `manage:${resourceType}`, resourceType, resourceId),

      requireRead: this.requirePermission(
        `read:${resourceType}`,
        resourceType,
        (resourceId) => resourceId
      ),
      requireWrite: this.requirePermission(
        `write:${resourceType}`,
        resourceType,
        (resourceId) => resourceId
      ),
      requireDelete: this.requirePermission(
        `delete:${resourceType}`,
        resourceType,
        (resourceId) => resourceId
      ),
      requireManage: this.requirePermission(
        `manage:${resourceType}`,
        resourceType,
        (resourceId) => resourceId
      ),

      getContext: (userId, resourceId) => this.createAuthContext(userId, resourceType, resourceId),
    };
  }

  /**
   * Batch check permissions for multiple resources
   * @param {string} userId - User ID
   * @param {Array} resources - Array of {permission, scope, resourceId}
   * @returns {Promise<Object>} Object with resource IDs as keys and boolean values
   */
  static async batchCheckPermissions(userId, resources) {
    try {
      const results = {};

      await Promise.all(
        resources.map(async (resource) => {
          const key = `${resource.scope}:${resource.resourceId}`;
          results[key] = await PermissionChecker.hasPermission(
            userId,
            resource.permission,
            resource.scope,
            resource.resourceId
          );
        })
      );

      return results;
    } catch (error) {
      Logger.error("Failed to batch check permissions", error);
      return {};
    }
  }

  /**
   * Filter resources based on user permissions
   * @param {string} userId - User ID
   * @param {Array} resources - Array of resources with id and type
   * @param {string} permission - Permission to check
   * @returns {Promise<Array>} Filtered resources
   */
  static async filterResourcesByPermission(userId, resources, permission) {
    try {
      const filteredResources = [];

      await Promise.all(
        resources.map(async (resource) => {
          const hasPermission = await PermissionChecker.hasPermission(
            userId,
            permission,
            resource.type,
            resource.id
          );

          if (hasPermission) {
            filteredResources.push(resource);
          }
        })
      );

      return filteredResources;
    } catch (error) {
      Logger.error("Failed to filter resources by permission", error);
      return [];
    }
  }
}
