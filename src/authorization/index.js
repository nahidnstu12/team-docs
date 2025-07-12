/**
 * Authorization System Index
 *
 * Central export point for all authorization classes and functions.
 * Provides a Laravel-like authorization system for Next.js applications.
 *
 * @module Authorization
 */

// Base Authorization Class (utility - no "use server")
export { BaseAuthGuard } from "./BaseAuthGuard";

// Utility Classes (no "use server")
export { PermissionChecker } from "./PermissionChecker";
export { AuthorizationUtils } from "./AuthorizationUtils";

// Note: Import authorization functions directly from their respective guard files
// Example:
// import { protectUser } from "@/authorization/UserAuthGuard";
// import { protectAdmin } from "@/authorization/AdminAuthGuard";
// import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

/**
 * Permission constants for common operations
 */
export const Permissions = {
  // User permissions
  USER: {
    CREATE: "create:user",
    READ: "read:user",
    UPDATE: "update:user",
    DELETE: "delete:user",
    MANAGE: "manage:user",
  },

  // Workspace permissions
  WORKSPACE: {
    CREATE: "create:workspace",
    READ: "read:workspace",
    UPDATE: "update:workspace",
    DELETE: "delete:workspace",
    MANAGE: "manage:workspace",
    INVITE: "invite:user",
    MANAGE_MEMBERS: "manage:members",
  },

  // Project permissions
  PROJECT: {
    CREATE: "create:project",
    READ: "read:project",
    UPDATE: "update:project",
    DELETE: "delete:project",
    MANAGE: "manage:project",
    EDIT: "edit:project",
  },

  // Section permissions
  SECTION: {
    CREATE: "create:section",
    READ: "read:section",
    UPDATE: "update:section",
    DELETE: "delete:section",
    EDIT: "edit:section",
  },

  // Page permissions
  PAGE: {
    CREATE: "create:page",
    READ: "read:page",
    UPDATE: "update:page",
    DELETE: "delete:page",
    EDIT: "edit:page",
    SHARE: "share:page",
  },

  // Annotation permissions
  ANNOTATION: {
    CREATE: "create:annotation",
    READ: "read:annotation",
    UPDATE: "update:annotation",
    DELETE: "delete:annotation",
    RESOLVE: "resolve:annotation",
    MODERATE: "moderate:annotation",
  },

  // Role permissions
  ROLE: {
    CREATE: "create:role",
    READ: "read:role",
    UPDATE: "update:role",
    DELETE: "delete:role",
    ASSIGN: "assign:role",
  },

  // Permission permissions
  PERMISSION: {
    CREATE: "create:permission",
    READ: "read:permission",
    UPDATE: "update:permission",
    DELETE: "delete:permission",
    ASSIGN: "assign:permission",
  },

  // Notification permissions
  NOTIFICATION: {
    CREATE: "create:notification",
    READ: "read:notification",
    UPDATE: "update:notification",
    DELETE: "delete:notification",
    BROADCAST: "broadcast:notification",
  },

  // Invitation permissions
  INVITATION: {
    CREATE: "create:invitation",
    READ: "read:invitation",
    UPDATE: "update:invitation",
    DELETE: "delete:invitation",
    SEND: "send:invitation",
  },
};

/**
 * Scope constants
 */
export const Scopes = {
  SYSTEM: "system",
  WORKSPACE: "workspace",
  PROJECT: "project",
  SECTION: "section",
  PAGE: "page",
  USER: "user",
};

/**
 * Usage Examples
 *
 * // Basic authentication
 * const session = await requireAuth();
 *
 * // Resource protection
 * const { project } = await protectProjectBySlug(slug);
 *
 * // Permission checking
 * const canEdit = await hasPermission(userId, "edit:project", "project", projectId);
 *
 * // Admin protection
 * await protectAdmin();
 */
