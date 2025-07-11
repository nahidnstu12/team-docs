"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * ProjectAuthGuard - Authorization guard for project-related operations
 *
 * Internal class for project authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class ProjectAuthGuard extends BaseAuthGuard {
  /**
   * Protect project access by slug - requires workspace membership
   * @param {string} slug - Project slug
   * @returns {Promise<Object>} Project object with access info
   */
  static async protectBySlug(slug) {
    const session = await this.requireAuth();

    const project = await this.validateResourceExists(
      (where) =>
        prisma.project.findUnique({
          ...where,
          include: {
            workspace: {
              include: {
                members: {
                  where: { userId: session.id },
                  include: { role: true },
                },
              },
            },
          },
        }),
      { where: { slug } },
      "Project"
    );

    // Check workspace membership for access
    const membership = project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to access project ${project.id} without workspace membership`
      );
      this.redirectUnauthorized();
    }

    return { project, membership };
  }

  /**
   * Protect project access by ID - requires workspace membership
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project object with access info
   */
  static async protectById(projectId) {
    const session = await this.requireAuth();

    const project = await this.validateResourceExists(
      (where) =>
        prisma.project.findUnique({
          ...where,
          include: {
            workspace: {
              include: {
                members: {
                  where: { userId: session.id },
                  include: { role: true },
                },
              },
            },
          },
        }),
      { where: { id: projectId } },
      "Project"
    );

    // Check workspace membership for access
    const membership = project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to access project ${project.id} without workspace membership`
      );
      this.redirectUnauthorized();
    }

    return { project, membership };
  }

  /**
   * Protect project editor access - requires edit permissions
   * @param {string} slug - Project slug
   * @returns {Promise<Object>} Project object if user can edit
   */
  static async protectEditor(slug) {
    const session = await this.requireAuth();

    const { project, membership } = await this.protectBySlug(slug);

    // Check if user has edit permissions
    const canEdit = await this.canEditProject(session.id, project.id);
    if (!canEdit) {
      Logger.warn(`User ${session.id} attempted to edit project ${project.id} without permission`);
      this.redirectUnauthorized();
    }

    return { project, membership };
  }

  /**
   * Protect project ownership operations
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project object if user is owner
   */
  static async protectOwnership(projectId) {
    const session = await this.requireAuth();

    const project = await this.validateResourceExists(
      (where) => prisma.project.findUnique(where),
      { where: { id: projectId } },
      "Project"
    );

    // Super admins can manage any project
    if (!this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, project.ownerId, "project");
    }

    return project;
  }

  /**
   * Protect project management operations
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project object and user role
   */
  static async protectManagement(projectId) {
    const session = await this.requireAuth();

    const project = await this.validateResourceExists(
      (where) =>
        prisma.project.findUnique({
          ...where,
          include: { workspace: true },
        }),
      { where: { id: projectId } },
      "Project"
    );

    // Super admins can manage any project
    if (this.isSuperAdmin(session)) {
      return { project, role: "super_admin" };
    }

    // Project owners can manage their project
    if (this.isOwner(session.id, project.ownerId)) {
      return { project, role: "owner" };
    }

    // Workspace owners can manage projects in their workspace
    if (this.isOwner(session.id, project.workspace.ownerId)) {
      return { project, role: "workspace_owner" };
    }

    // Check for management permissions
    const hasManagePermission = await this.hasPermission(
      session.id,
      "manage:project",
      "project",
      projectId
    );

    if (!hasManagePermission) {
      Logger.warn(`User ${session.id} attempted to manage project ${projectId} without permission`);
      this.redirectUnauthorized();
    }

    return { project, role: "manager" };
  }

  /**
   * Protect project creation in workspace
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectCreation(workspaceId) {
    const session = await this.requireAuth();

    // Check workspace membership
    const membership = await this.requireWorkspaceMembership(session.id, workspaceId);

    // Check if user can create projects in this workspace
    const canCreate = await this.canCreateProject(session.id, workspaceId);
    if (!canCreate) {
      Logger.warn(
        `User ${session.id} attempted to create project in workspace ${workspaceId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { session, membership };
  }

  /**
   * Protect project deletion
   * @param {string} projectId - Project ID to delete
   * @returns {Promise<Object>} Project object if authorized
   */
  static async protectDeletion(projectId) {
    const session = await this.requireAuth();

    const project = await this.validateResourceExists(
      (where) =>
        prisma.project.findUnique({
          ...where,
          include: { workspace: true },
        }),
      { where: { id: projectId } },
      "Project"
    );

    // Only super admins, project owners, or workspace owners can delete
    const canDelete =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, project.ownerId) ||
      this.isOwner(session.id, project.workspace.ownerId);

    if (!canDelete) {
      Logger.warn(`User ${session.id} attempted to delete project ${projectId} without permission`);
      this.redirectUnauthorized();
    }

    return project;
  }

  /**
   * Protect project member management
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project and management info
   */
  static async protectMemberManagement(projectId) {
    const session = await this.requireAuth();

    const project = await this.validateResourceExists(
      (where) =>
        prisma.project.findUnique({
          ...where,
          include: { workspace: true },
        }),
      { where: { id: projectId } },
      "Project"
    );

    // Check if user can manage project members
    const canManage =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, project.ownerId) ||
      this.isOwner(session.id, project.workspace.ownerId) ||
      (await this.hasPermission(session.id, "manage:members", "project", projectId));

    if (!canManage) {
      Logger.warn(
        `User ${session.id} attempted to manage members in project ${projectId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { project, canManage: true };
  }

  /**
   * Check if user can edit project
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} True if user can edit
   */
  static async canEditProject(userId, projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { workspace: true },
      });

      if (!project) return false;

      // Project owners can edit
      if (project.ownerId === userId) return true;

      // Workspace owners can edit projects in their workspace
      if (project.workspace.ownerId === userId) return true;

      // Check for edit permission
      return await this.hasPermission(userId, "edit:project", "project", projectId);
    } catch (error) {
      Logger.error("Failed to check project edit permission", error);
      return false;
    }
  }

  /**
   * Check if user can create projects in workspace
   * @param {string} userId - User ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<boolean>} True if user can create projects
   */
  static async canCreateProject(userId, workspaceId) {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerId: true },
      });

      // Workspace owners can create projects
      if (workspace?.ownerId === userId) return true;

      // Check for create permission
      return await this.hasPermission(userId, "create:project", "workspace", workspaceId);
    } catch (error) {
      Logger.error("Failed to check project creation permission", error);
      return false;
    }
  }

  /**
   * Get user's role in project
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<string|null>} User's role in project
   */
  static async getUserRole(userId, projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { workspace: true },
      });

      if (!project) return null;

      // Check if user is project owner
      if (project.ownerId === userId) return "owner";

      // Check if user is workspace owner
      if (project.workspace.ownerId === userId) return "workspace_owner";

      // Check project membership
      const membership = await this.getProjectMembership(userId, projectId);
      return membership?.role?.name || null;
    } catch (error) {
      Logger.error("Failed to get user role in project", error);
      return null;
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectProjectBySlug(slug) {
  return await ProjectAuthGuard.protectBySlug(slug);
}

export async function protectProjectById(projectId) {
  return await ProjectAuthGuard.protectById(projectId);
}

export async function protectProjectEditor(slug) {
  return await ProjectAuthGuard.protectEditor(slug);
}

export async function protectProjectOwnership(projectId) {
  return await ProjectAuthGuard.protectOwnership(projectId);
}

export async function protectProjectManagement(projectId) {
  return await ProjectAuthGuard.protectManagement(projectId);
}

export async function protectProjectCreation(workspaceId) {
  return await ProjectAuthGuard.protectCreation(workspaceId);
}

export async function protectProjectDeletion(projectId) {
  return await ProjectAuthGuard.protectDeletion(projectId);
}

export async function protectProjectMemberManagement(projectId) {
  return await ProjectAuthGuard.protectMemberManagement(projectId);
}
