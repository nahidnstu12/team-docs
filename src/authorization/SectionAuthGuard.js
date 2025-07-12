"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * SectionAuthGuard - Authorization guard for section-related operations
 *
 * Internal class for section authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class SectionAuthGuard extends BaseAuthGuard {
  /**
   * Protect section access by ID - requires project access
   * @param {string} sectionId - Section ID to access
   * @returns {Promise<Object>} Section object with access info
   */
  static async protectBySectionId(sectionId) {
    const session = await this.requireAuth();

    const section = await this.validateResourceExists(
      (where) =>
        prisma.section.findUnique({
          ...where,
          include: {
            project: {
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
            },
          },
        }),
      { where: { id: sectionId } },
      "Section"
    );

    // Check workspace membership for access
    const membership = section.project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to access section ${sectionId} without workspace membership`
      );
      this.redirectUnauthorized();
    }

    return { section, membership };
  }

  /**
   * Protect section creation in project
   * @param {string} projectId - Project ID to create section in
   * @returns {Promise<Object>} Project object if authorized
   */
  static async protectCreation(projectId) {
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

    // Check workspace membership
    const membership = project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to create section in project ${projectId} without workspace membership`
      );
      this.redirectUnauthorized();
    }

    // Check if user can create sections
    const canCreate = await this.canCreateSection(session.id, projectId);
    if (!canCreate) {
      Logger.warn(
        `User ${session.id} attempted to create section in project ${projectId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { project, membership };
  }

  /**
   * Protect section update operations
   * @param {string} sectionId - Section ID to update
   * @returns {Promise<Object>} Section object if authorized
   */
  static async protectUpdate(sectionId) {
    const session = await this.requireAuth();

    const { section, membership } = await this.protectBySectionId(sectionId);

    // Check if user can edit sections
    const canEdit = await this.canEditSection(session.id, sectionId);
    if (!canEdit) {
      Logger.warn(`User ${session.id} attempted to update section ${sectionId} without permission`);
      this.redirectUnauthorized();
    }

    return { section, membership };
  }

  /**
   * Protect section deletion
   * @param {string} sectionId - Section ID to delete
   * @returns {Promise<Object>} Section object if authorized
   */
  static async protectDeletion(sectionId) {
    const session = await this.requireAuth();

    const { section, membership } = await this.protectBySectionId(sectionId);

    // Check if user can delete sections
    const canDelete =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, section.ownerId) ||
      this.isOwner(session.id, section.project.ownerId) ||
      this.isOwner(session.id, section.project.workspace.ownerId) ||
      (await this.hasPermission(session.id, "delete:section", "project", section.projectId));

    if (!canDelete) {
      Logger.warn(`User ${session.id} attempted to delete section ${sectionId} without permission`);
      this.redirectUnauthorized();
    }

    return { section, membership };
  }

  /**
   * Protect section ownership operations
   * @param {string} sectionId - Section ID
   * @returns {Promise<Object>} Section object if user is owner
   */
  static async protectOwnership(sectionId) {
    const session = await this.requireAuth();

    const { section } = await this.protectBySectionId(sectionId);

    // Super admins can manage any section
    if (!this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, section.ownerId, "section");
    }

    return section;
  }

  /**
   * Protect section list access for project
   * @param {string} projectId - Project ID to list sections for
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Project and authorized filters
   */
  static async protectList(projectId, filters = {}) {
    const session = await this.requireAuth();

    const { project, membership } = await this.protectCreation(projectId);

    return {
      project,
      membership,
      filters: { ...filters, projectId },
    };
  }

  /**
   * Check if user can create sections in project
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} True if user can create sections
   */
  static async canCreateSection(userId, projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { workspace: true },
      });

      if (!project) return false;

      // Project owners can create sections
      if (project.ownerId === userId) return true;

      // Workspace owners can create sections in their projects
      if (project.workspace.ownerId === userId) return true;

      // Check for create permission
      return await this.hasPermission(userId, "create:section", "project", projectId);
    } catch (error) {
      Logger.error("Failed to check section creation permission", error);
      return false;
    }
  }

  /**
   * Check if user can edit section
   * @param {string} userId - User ID
   * @param {string} sectionId - Section ID
   * @returns {Promise<boolean>} True if user can edit
   */
  static async canEditSection(userId, sectionId) {
    try {
      const section = await prisma.section.findUnique({
        where: { id: sectionId },
        include: {
          project: {
            include: { workspace: true },
          },
        },
      });

      if (!section) return false;

      // Section owners can edit
      if (section.ownerId === userId) return true;

      // Project owners can edit sections in their project
      if (section.project.ownerId === userId) return true;

      // Workspace owners can edit sections in their workspace
      if (section.project.workspace.ownerId === userId) return true;

      // Check for edit permission
      return await this.hasPermission(userId, "edit:section", "project", section.projectId);
    } catch (error) {
      Logger.error("Failed to check section edit permission", error);
      return false;
    }
  }

  /**
   * Get user's role in section context
   * @param {string} userId - User ID
   * @param {string} sectionId - Section ID
   * @returns {Promise<string|null>} User's role in section context
   */
  static async getUserRole(userId, sectionId) {
    try {
      const section = await prisma.section.findUnique({
        where: { id: sectionId },
        include: {
          project: {
            include: { workspace: true },
          },
        },
      });

      if (!section) return null;

      // Check if user is section owner
      if (section.ownerId === userId) return "section_owner";

      // Check if user is project owner
      if (section.project.ownerId === userId) return "project_owner";

      // Check if user is workspace owner
      if (section.project.workspace.ownerId === userId) return "workspace_owner";

      // Check workspace membership
      const membership = await this.getWorkspaceMembership(userId, section.project.workspaceId);
      return membership?.role?.name || null;
    } catch (error) {
      Logger.error("Failed to get user role in section", error);
      return null;
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectSectionById(sectionId) {
  return await SectionAuthGuard.protectBySectionId(sectionId);
}

export async function protectSectionCreation(projectId) {
  return await SectionAuthGuard.protectCreation(projectId);
}

export async function protectSectionUpdate(sectionId) {
  return await SectionAuthGuard.protectUpdate(sectionId);
}

export async function protectSectionDeletion(sectionId) {
  return await SectionAuthGuard.protectDeletion(sectionId);
}

export async function protectSectionOwnership(sectionId) {
  return await SectionAuthGuard.protectOwnership(sectionId);
}

export async function protectSectionList(projectId, filters = {}) {
  return await SectionAuthGuard.protectList(projectId, filters);
}
