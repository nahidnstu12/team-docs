"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * PageAuthGuard - Authorization guard for page-related operations
 *
 * Internal class for page authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class PageAuthGuard extends BaseAuthGuard {
  /**
   * Protect page access by ID - requires section/project access
   * @param {string} pageId - Page ID to access
   * @returns {Promise<Object>} Page object with access info
   */
  static async protectByPageId(pageId) {
    const session = await this.requireAuth();

    const page = await this.validateResourceExists(
      (where) =>
        prisma.page.findUnique({
          ...where,
          include: {
            section: {
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
            },
          },
        }),
      { where: { id: pageId } },
      "Page"
    );

    // Check workspace membership for access
    const membership = page.section.project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to access page ${pageId} without workspace membership`
      );
      this.redirectUnauthorized();
    }

    return { page, membership };
  }

  /**
   * Protect page creation in section
   * @param {string} sectionId - Section ID to create page in
   * @returns {Promise<Object>} Section object if authorized
   */
  static async protectCreation(sectionId) {
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

    // Check workspace membership
    const membership = section.project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to create page in section ${sectionId} without workspace membership`
      );
      this.redirectUnauthorized();
    }

    // Check if user can create pages
    const canCreate = await this.canCreatePage(session.id, sectionId);
    if (!canCreate) {
      Logger.warn(
        `User ${session.id} attempted to create page in section ${sectionId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { section, membership };
  }

  /**
   * Protect page update operations
   * @param {string} pageId - Page ID to update
   * @returns {Promise<Object>} Page object if authorized
   */
  static async protectUpdate(pageId) {
    const session = await this.requireAuth();

    const { page, membership } = await this.protectByPageId(pageId);

    // Check if user can edit pages
    const canEdit = await this.canEditPage(session.id, pageId);
    if (!canEdit) {
      Logger.warn(`User ${session.id} attempted to update page ${pageId} without permission`);
      this.redirectUnauthorized();
    }

    return { page, membership };
  }

  /**
   * Protect page deletion
   * @param {string} pageId - Page ID to delete
   * @returns {Promise<Object>} Page object if authorized
   */
  static async protectDeletion(pageId) {
    const session = await this.requireAuth();

    const { page, membership } = await this.protectByPageId(pageId);

    // Check if user can delete pages
    const canDelete =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, page.ownerId) ||
      this.isOwner(session.id, page.section.ownerId) ||
      this.isOwner(session.id, page.section.project.ownerId) ||
      this.isOwner(session.id, page.section.project.workspace.ownerId) ||
      (await this.hasPermission(session.id, "delete:page", "section", page.sectionId));

    if (!canDelete) {
      Logger.warn(`User ${session.id} attempted to delete page ${pageId} without permission`);
      this.redirectUnauthorized();
    }

    return { page, membership };
  }

  /**
   * Protect page ownership operations
   * @param {string} pageId - Page ID
   * @returns {Promise<Object>} Page object if user is owner
   */
  static async protectOwnership(pageId) {
    const session = await this.requireAuth();

    const { page } = await this.protectByPageId(pageId);

    // Super admins can manage any page
    if (!this.isSuperAdmin(session)) {
      this.requireOwnership(session.id, page.ownerId, "page");
    }

    return page;
  }

  /**
   * Protect page list access for section
   * @param {string} sectionId - Section ID to list pages for
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Section and authorized filters
   */
  static async protectList(sectionId, filters = {}) {
    const session = await this.requireAuth();

    const { section, membership } = await this.protectCreation(sectionId);

    return {
      section,
      membership,
      filters: { ...filters, sectionId },
    };
  }

  /**
   * Protect public page access (for shared pages)
   * @param {string} pageId - Page ID
   * @param {string} password - Optional password for protected pages
   * @returns {Promise<Object>} Page object if accessible
   */
  static async protectPublicAccess(pageId, password = null) {
    const page = await this.validateResourceExists(
      (where) => prisma.page.findUnique(where),
      { where: { id: pageId } },
      "Page"
    );

    // Check if page is public
    if (!page.isPublic) {
      Logger.warn(`Attempted to access non-public page ${pageId} via public route`);
      this.redirectUnauthorized();
    }

    // Check password if page is password protected
    if (page.password && page.password !== password) {
      Logger.warn(`Incorrect password provided for protected page ${pageId}`);
      throw new Error("Incorrect password");
    }

    return page;
  }

  /**
   * Protect page sharing operations
   * @param {string} pageId - Page ID to share
   * @returns {Promise<Object>} Page object if authorized
   */
  static async protectSharing(pageId) {
    const session = await this.requireAuth();

    const { page, membership } = await this.protectByPageId(pageId);

    // Check if user can share pages
    const canShare =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, page.ownerId) ||
      (await this.hasPermission(session.id, "share:page", "section", page.sectionId));

    if (!canShare) {
      Logger.warn(`User ${session.id} attempted to share page ${pageId} without permission`);
      this.redirectUnauthorized();
    }

    return { page, membership };
  }

  /**
   * Check if user can create pages in section
   * @param {string} userId - User ID
   * @param {string} sectionId - Section ID
   * @returns {Promise<boolean>} True if user can create pages
   */
  static async canCreatePage(userId, sectionId) {
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

      // Section owners can create pages
      if (section.ownerId === userId) return true;

      // Project owners can create pages in their sections
      if (section.project.ownerId === userId) return true;

      // Workspace owners can create pages in their workspace
      if (section.project.workspace.ownerId === userId) return true;

      // Check for create permission
      return await this.hasPermission(userId, "create:page", "section", sectionId);
    } catch (error) {
      Logger.error("Failed to check page creation permission", error);
      return false;
    }
  }

  /**
   * Check if user can edit page
   * @param {string} userId - User ID
   * @param {string} pageId - Page ID
   * @returns {Promise<boolean>} True if user can edit
   */
  static async canEditPage(userId, pageId) {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: {
          section: {
            include: {
              project: {
                include: { workspace: true },
              },
            },
          },
        },
      });

      if (!page) return false;

      // Page owners can edit
      if (page.ownerId === userId) return true;

      // Section owners can edit pages in their section
      if (page.section.ownerId === userId) return true;

      // Project owners can edit pages in their project
      if (page.section.project.ownerId === userId) return true;

      // Workspace owners can edit pages in their workspace
      if (page.section.project.workspace.ownerId === userId) return true;

      // Check for edit permission
      return await this.hasPermission(userId, "edit:page", "section", page.sectionId);
    } catch (error) {
      Logger.error("Failed to check page edit permission", error);
      return false;
    }
  }

  /**
   * Get user's role in page context
   * @param {string} userId - User ID
   * @param {string} pageId - Page ID
   * @returns {Promise<string|null>} User's role in page context
   */
  static async getUserRole(userId, pageId) {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: {
          section: {
            include: {
              project: {
                include: { workspace: true },
              },
            },
          },
        },
      });

      if (!page) return null;

      // Check if user is page owner
      if (page.ownerId === userId) return "page_owner";

      // Check if user is section owner
      if (page.section.ownerId === userId) return "section_owner";

      // Check if user is project owner
      if (page.section.project.ownerId === userId) return "project_owner";

      // Check if user is workspace owner
      if (page.section.project.workspace.ownerId === userId) return "workspace_owner";

      // Check workspace membership
      const membership = await this.getWorkspaceMembership(
        userId,
        page.section.project.workspaceId
      );
      return membership?.role?.name || null;
    } catch (error) {
      Logger.error("Failed to get user role in page", error);
      return null;
    }
  }

  /**
   * Check if page can be accessed by anonymous users
   * @param {string} pageId - Page ID
   * @returns {Promise<boolean>} True if page is publicly accessible
   */
  static async isPubliclyAccessible(pageId) {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        select: { isPublic: true },
      });

      return page?.isPublic === true;
    } catch (error) {
      Logger.error("Failed to check page public accessibility", error);
      return false;
    }
  }
}

// Exported async functions for use in server components and actions
export async function protectPageById(pageId) {
  return await PageAuthGuard.protectByPageId(pageId);
}

export async function protectPageCreation(sectionId) {
  return await PageAuthGuard.protectCreation(sectionId);
}

export async function protectPageUpdate(pageId) {
  return await PageAuthGuard.protectUpdate(pageId);
}

export async function protectPageDeletion(pageId) {
  return await PageAuthGuard.protectDeletion(pageId);
}

export async function protectPageOwnership(pageId) {
  return await PageAuthGuard.protectOwnership(pageId);
}

export async function protectPageList(sectionId, filters = {}) {
  return await PageAuthGuard.protectList(sectionId, filters);
}

export async function protectPagePublicAccess(pageId, password = null) {
  return await PageAuthGuard.protectPublicAccess(pageId, password);
}

export async function protectPageSharing(pageId) {
  return await PageAuthGuard.protectSharing(pageId);
}
