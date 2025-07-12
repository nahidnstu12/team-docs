"use server";
import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * NotificationAuthGuard - Authorization guard for notification-related operations
 *
 * Internal class for notification authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class NotificationAuthGuard extends BaseAuthGuard {
  /**
   * Protect notification access - users can only access their own notifications
   * @param {string} notificationId - Notification ID to access
   * @returns {Promise<Object>} Notification object if authorized
   */
  static async protect(notificationId) {
    const session = await this.requireAuth();

    const notification = await this.validateResourceExists(
      (where) => prisma.notification.findUnique(where),
      { where: { id: notificationId } },
      "Notification"
    );

    // Super admins can access any notification
    if (this.isSuperAdmin(session)) {
      return notification;
    }

    // Users can only access their own notifications
    if (!this.isOwner(session.id, notification.userId)) {
      Logger.warn(
        `User ${session.id} attempted to access notification ${notificationId} belonging to user ${notification.userId}`
      );
      this.redirectUnauthorized();
    }

    return notification;
  }

  /**
   * Protect notification creation (system/admin operation)
   * @param {string} targetUserId - User ID to create notification for
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectCreation(targetUserId) {
    const session = await this.requireAuth();

    // Check if user can create notifications for the target user
    const canCreate = await this.canCreateNotification(session.id, targetUserId);
    if (!canCreate) {
      Logger.warn(
        `User ${session.id} attempted to create notification for user ${targetUserId} without permission`
      );
      this.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect notification update operations (mark as read, etc.)
   * @param {string} notificationId - Notification ID to update
   * @returns {Promise<Object>} Notification object if authorized
   */
  static async protectUpdate(notificationId) {
    const session = await this.requireAuth();

    const notification = await this.protect(notificationId);

    // Users can only update their own notifications
    if (!this.isSuperAdmin(session) && !this.isOwner(session.id, notification.userId)) {
      Logger.warn(
        `User ${session.id} attempted to update notification ${notificationId} without permission`
      );
      this.redirectUnauthorized();
    }

    return notification;
  }

  /**
   * Protect notification deletion
   * @param {string} notificationId - Notification ID to delete
   * @returns {Promise<Object>} Notification object if authorized
   */
  static async protectDeletion(notificationId) {
    const session = await this.requireAuth();

    const notification = await this.protect(notificationId);

    // Users can delete their own notifications, admins can delete any
    if (!this.isSuperAdmin(session) && !this.isOwner(session.id, notification.userId)) {
      Logger.warn(
        `User ${session.id} attempted to delete notification ${notificationId} without permission`
      );
      this.redirectUnauthorized();
    }

    return notification;
  }

  /**
   * Protect notification list access with filtering
   * @param {string} userId - User ID to get notifications for
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Session and authorized filters
   */
  static async protectList(userId, filters = {}) {
    const session = await this.requireAuth();

    // Super admins can access any user's notifications
    if (this.isSuperAdmin(session)) {
      return {
        session,
        filters: { ...filters, userId },
      };
    }

    // Users can only access their own notifications
    if (!this.isOwner(session.id, userId)) {
      Logger.warn(`User ${session.id} attempted to access notifications for user ${userId}`);
      this.redirectUnauthorized();
    }

    return {
      session,
      filters: { ...filters, userId: session.id },
    };
  }

  /**
   * Protect bulk notification operations (mark all as read, delete all, etc.)
   * @param {string} userId - User ID for bulk operations
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectBulkOperations(userId) {
    const session = await this.requireAuth();

    // Super admins can perform bulk operations on any user's notifications
    if (this.isSuperAdmin(session)) {
      return session;
    }

    // Users can only perform bulk operations on their own notifications
    if (!this.isOwner(session.id, userId)) {
      Logger.warn(`User ${session.id} attempted bulk notification operations for user ${userId}`);
      this.redirectUnauthorized();
    }

    return session;
  }

  /**
   * Protect notification broadcasting/sending operations
   * @param {Array} targetUserIds - Array of user IDs to send notifications to
   * @param {string} notificationType - Type of notification
   * @returns {Promise<Object>} Session and authorized targets
   */
  static async protectBroadcast(targetUserIds, notificationType) {
    const session = await this.requireAuth();

    // Check if user can broadcast this type of notification
    const canBroadcast = await this.canBroadcastNotification(session.id, notificationType);
    if (!canBroadcast) {
      Logger.warn(
        `User ${session.id} attempted to broadcast ${notificationType} notifications without permission`
      );
      this.redirectUnauthorized();
    }

    // Filter target users based on permissions
    const authorizedTargets = await this.getAuthorizedNotificationTargets(
      session.id,
      targetUserIds
    );

    return { session, authorizedTargets };
  }

  /**
   * Check if user can create notifications for target user
   * @param {string} userId - User ID creating notification
   * @param {string} targetUserId - Target user ID
   * @returns {Promise<boolean>} True if user can create notification
   */
  static async canCreateNotification(userId, targetUserId) {
    try {
      const session = await this.getSession();

      // Super admins can create notifications for anyone
      if (this.isSuperAdmin(session)) return true;

      // Users can create notifications for themselves (self-notifications)
      if (userId === targetUserId) return true;

      // Check if users are in the same workspace (for workspace notifications)
      const sharedWorkspaces = await this.getSharedWorkspaces(userId, targetUserId);
      if (sharedWorkspaces.length > 0) {
        // Check if user has notification permission in any shared workspace
        for (const workspaceId of sharedWorkspaces) {
          const hasPermission = await this.hasPermission(
            userId,
            "create:notification",
            "workspace",
            workspaceId
          );
          if (hasPermission) return true;
        }
      }

      return false;
    } catch (error) {
      Logger.error("Failed to check notification creation permission", error);
      return false;
    }
  }

  /**
   * Check if user can broadcast notifications of given type
   * @param {string} userId - User ID
   * @param {string} notificationType - Notification type
   * @returns {Promise<boolean>} True if user can broadcast
   */
  static async canBroadcastNotification(userId, notificationType) {
    try {
      const session = await this.getSession();

      // Super admins can broadcast any notification type
      if (this.isSuperAdmin(session)) return true;

      // Define which notification types require special permissions
      const restrictedTypes = ["system_announcement", "maintenance_alert", "security_notice"];

      if (restrictedTypes.includes(notificationType)) {
        // Only admins can broadcast restricted notification types
        return false;
      }

      // For other types, check if user has broadcast permission
      return await this.hasPermission(userId, "broadcast:notification", "system");
    } catch (error) {
      Logger.error("Failed to check notification broadcast permission", error);
      return false;
    }
  }

  /**
   * Get shared workspaces between two users
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @returns {Promise<Array>} Array of shared workspace IDs
   */
  static async getSharedWorkspaces(userId1, userId2) {
    try {
      const user1Workspaces = await prisma.workspaceMember.findMany({
        where: { userId: userId1 },
        select: { workspaceId: true },
      });

      const user2Workspaces = await prisma.workspaceMember.findMany({
        where: { userId: userId2 },
        select: { workspaceId: true },
      });

      const user1WorkspaceIds = user1Workspaces.map((w) => w.workspaceId);
      const user2WorkspaceIds = user2Workspaces.map((w) => w.workspaceId);

      return user1WorkspaceIds.filter((id) => user2WorkspaceIds.includes(id));
    } catch (error) {
      Logger.error("Failed to get shared workspaces", error);
      return [];
    }
  }

  /**
   * Get authorized notification targets from a list of user IDs
   * @param {string} userId - User ID sending notifications
   * @param {Array} targetUserIds - Array of target user IDs
   * @returns {Promise<Array>} Array of authorized target user IDs
   */
  static async getAuthorizedNotificationTargets(userId, targetUserIds) {
    try {
      const authorizedTargets = [];

      for (const targetUserId of targetUserIds) {
        const canNotify = await this.canCreateNotification(userId, targetUserId);
        if (canNotify) {
          authorizedTargets.push(targetUserId);
        }
      }

      return authorizedTargets;
    } catch (error) {
      Logger.error("Failed to get authorized notification targets", error);
      return [];
    }
  }

  /**
   * Get user's notification preferences and permissions
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Notification preferences and permissions
   */
  static async getUserNotificationContext(userId) {
    try {
      const session = await this.getSession();

      // Users can only get their own notification context unless admin
      if (!this.isSuperAdmin(session) && session.id !== userId) {
        return null;
      }

      // Get user's workspaces for context
      const workspaces = await prisma.workspaceMember.findMany({
        where: { userId },
        include: {
          workspace: {
            select: { id: true, name: true },
          },
          role: {
            select: { name: true },
          },
        },
      });

      return {
        userId,
        workspaces: workspaces.map((w) => ({
          id: w.workspace.id,
          name: w.workspace.name,
          role: w.role.name,
        })),
        canBroadcast: await this.canBroadcastNotification(userId, "general"),
        isAdmin: this.isSuperAdmin(session),
      };
    } catch (error) {
      Logger.error("Failed to get user notification context", error);
      return null;
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectNotification(notificationId) {
  return await NotificationAuthGuard.protect(notificationId);
}

export async function protectNotificationCreation() {
  return await NotificationAuthGuard.protectCreation();
}

export async function protectNotificationUpdate(notificationId) {
  return await NotificationAuthGuard.protectUpdate(notificationId);
}

export async function protectNotificationDeletion(notificationId) {
  return await NotificationAuthGuard.protectDeletion(notificationId);
}

export async function protectNotificationList(filters = {}) {
  return await NotificationAuthGuard.protectList(filters);
}

export async function protectNotificationBroadcast() {
  return await NotificationAuthGuard.protectBroadcast();
}

export async function protectNotificationManagement() {
  return await NotificationAuthGuard.protectManagement();
}

export async function protectNotificationMarkAsRead(notificationId) {
  return await NotificationAuthGuard.protectMarkAsRead(notificationId);
}

export async function protectNotificationMarkAllAsRead() {
  return await NotificationAuthGuard.protectMarkAllAsRead();
}

export async function getUserNotificationContext() {
  return await NotificationAuthGuard.getUserNotificationContext();
}
