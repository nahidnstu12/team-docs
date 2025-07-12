"use server";

import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * AdminAuthGuard - Authorization guard for administrative operations
 *
 * Internal class for admin authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class AdminAuthGuard extends BaseAuthGuard {
  /**
   * Protect admin routes - requires super admin privileges
   * @returns {Promise<Object>} Admin user session
   */
  static async protect() {
    return await this.requireSuperAdmin();
  }

  /**
   * Protect system-wide user management operations
   * @returns {Promise<Object>} Admin user session
   */
  static async protectUserManagement() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing user management`);
    return session;
  }

  /**
   * Protect system-wide workspace management operations
   * @returns {Promise<Object>} Admin user session
   */
  static async protectWorkspaceManagement() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing workspace management`);
    return session;
  }

  /**
   * Protect system settings and configuration
   * @returns {Promise<Object>} Admin user session
   */
  static async protectSystemSettings() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing system settings`);
    return session;
  }

  /**
   * Protect system analytics and reporting
   * @returns {Promise<Object>} Admin user session
   */
  static async protectAnalytics() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing system analytics`);
    return session;
  }

  /**
   * Protect system maintenance operations
   * @returns {Promise<Object>} Admin user session
   */
  static async protectMaintenance() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing maintenance operations`);
    return session;
  }

  /**
   * Protect audit log access
   * @returns {Promise<Object>} Admin user session
   */
  static async protectAuditLogs() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing audit logs`);
    return session;
  }

  /**
   * Protect role and permission management at system level
   * @returns {Promise<Object>} Admin user session
   */
  static async protectRolePermissionManagement() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing role/permission management`);
    return session;
  }

  /**
   * Protect system-wide invitation management
   * @returns {Promise<Object>} Admin user session
   */
  static async protectInvitationManagement() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing invitation management`);
    return session;
  }

  /**
   * Protect system notification broadcasting
   * @returns {Promise<Object>} Admin user session
   */
  static async protectNotificationBroadcast() {
    const session = await this.requireSuperAdmin();
    Logger.info(`Admin ${session.id} accessing notification broadcast`);
    return session;
  }

  /**
   * Check if current user has admin privileges
   * @returns {Promise<boolean>} True if user is admin
   */
  static async isAdmin() {
    try {
      const session = await this.getSession();
      return this.isSuperAdmin(session);
    } catch (error) {
      Logger.error("Failed to check admin status", error);
      return false;
    }
  }

  /**
   * Get admin context information
   * @returns {Promise<Object|null>} Admin context or null
   */
  static async getAdminContext() {
    try {
      const session = await this.getSession();

      if (!this.isSuperAdmin(session)) {
        return null;
      }

      return {
        adminId: session.id,
        adminUsername: session.username,
        adminEmail: session.email,
        loginTime: new Date(),
        permissions: ["all"], // Super admin has all permissions
      };
    } catch (error) {
      Logger.error("Failed to get admin context", error);
      return null;
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectAdmin() {
  return await AdminAuthGuard.protect();
}

export async function protectAdminUserManagement() {
  return await AdminAuthGuard.protectUserManagement();
}

export async function protectAdminWorkspaceManagement() {
  return await AdminAuthGuard.protectWorkspaceManagement();
}

export async function protectAdminSystemSettings() {
  return await AdminAuthGuard.protectSystemSettings();
}

export async function protectAdminAnalytics() {
  return await AdminAuthGuard.protectAnalytics();
}

export async function protectAdminMaintenance() {
  return await AdminAuthGuard.protectMaintenance();
}

export async function protectAdminAuditLogs() {
  return await AdminAuthGuard.protectAuditLogs();
}

export async function protectAdminRolePermissionManagement() {
  return await AdminAuthGuard.protectRolePermissionManagement();
}

export async function protectAdminInvitationManagement() {
  return await AdminAuthGuard.protectInvitationManagement();
}

export async function protectAdminNotificationBroadcast() {
  return await AdminAuthGuard.protectNotificationBroadcast();
}

export async function isAdmin() {
  return await AdminAuthGuard.isAdmin();
}

export async function getAdminContext() {
  return await AdminAuthGuard.getAdminContext();
}
