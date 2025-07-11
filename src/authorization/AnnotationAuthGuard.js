"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * AnnotationAuthGuard - Authorization guard for annotation-related operations
 *
 * Internal class for annotation authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class AnnotationAuthGuard extends BaseAuthGuard {
  /**
   * Protect annotation access - requires page access
   * @param {string} annotationId - Annotation ID to access
   * @returns {Promise<Object>} Annotation object with page access info
   */
  static async protect(annotationId) {
    const session = await this.requireAuth();

    const annotation = await this.validateResourceExists(
      (where) =>
        prisma.annotation.findUnique({
          ...where,
          include: {
            page: {
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
            },
            user: true,
          },
        }),
      { where: { id: annotationId } },
      "Annotation"
    );

    // Check if user has access to the page containing this annotation
    const membership = annotation.page.section.project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to access annotation ${annotationId} without page access`
      );
      this.redirectUnauthorized();
    }

    return { annotation, membership };
  }

  /**
   * Protect annotation creation on a page
   * @param {string} pageId - Page ID to create annotation on
   * @returns {Promise<Object>} Page object if user can annotate
   */
  static async protectCreation(pageId) {
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

    // Check if user has access to the page
    const membership = page.section.project.workspace.members[0];
    if (!membership) {
      Logger.warn(
        `User ${session.id} attempted to create annotation on page ${pageId} without access`
      );
      this.redirectUnauthorized();
    }

    // Check if user can create annotations
    const canAnnotate = await this.canCreateAnnotation(session.id, pageId);
    if (!canAnnotate) {
      Logger.warn(
        `User ${session.id} attempted to create annotation on page ${pageId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { page, membership };
  }

  /**
   * Protect annotation update operations
   * @param {string} annotationId - Annotation ID to update
   * @returns {Promise<Object>} Annotation object if authorized
   */
  static async protectUpdate(annotationId) {
    const session = await this.requireAuth();

    const { annotation, membership } = await this.protect(annotationId);

    // Users can only update their own annotations unless they have special permissions
    const canUpdate =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, annotation.userId) ||
      (await this.hasPermission(session.id, "edit:annotation", "page", annotation.pageId));

    if (!canUpdate) {
      Logger.warn(
        `User ${session.id} attempted to update annotation ${annotationId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { annotation, membership };
  }

  /**
   * Protect annotation deletion
   * @param {string} annotationId - Annotation ID to delete
   * @returns {Promise<Object>} Annotation object if authorized
   */
  static async protectDeletion(annotationId) {
    const session = await this.requireAuth();

    const { annotation, membership } = await this.protect(annotationId);

    // Users can delete their own annotations, or moderators can delete any
    const canDelete =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, annotation.userId) ||
      (await this.hasPermission(session.id, "delete:annotation", "page", annotation.pageId));

    if (!canDelete) {
      Logger.warn(
        `User ${session.id} attempted to delete annotation ${annotationId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { annotation, membership };
  }

  /**
   * Protect annotation resolution operations
   * @param {string} annotationId - Annotation ID to resolve/unresolve
   * @returns {Promise<Object>} Annotation object if authorized
   */
  static async protectResolution(annotationId) {
    const session = await this.requireAuth();

    const { annotation, membership } = await this.protect(annotationId);

    // Users can resolve their own annotations, or moderators can resolve any
    const canResolve =
      this.isSuperAdmin(session) ||
      this.isOwner(session.id, annotation.userId) ||
      (await this.hasPermission(session.id, "resolve:annotation", "page", annotation.pageId));

    if (!canResolve) {
      Logger.warn(
        `User ${session.id} attempted to resolve annotation ${annotationId} without permission`
      );
      this.redirectUnauthorized();
    }

    return { annotation, membership };
  }

  /**
   * Protect annotation list access for a page
   * @param {string} pageId - Page ID to list annotations for
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Page and authorized filters
   */
  static async protectList(pageId, filters = {}) {
    const session = await this.requireAuth();

    const { page, membership } = await this.protectCreation(pageId);

    // Apply user-specific filters if not admin
    let authorizedFilters = { ...filters, pageId };

    if (!this.isSuperAdmin(session)) {
      // Regular users might only see their own annotations or public ones
      // This depends on your business logic
      const canViewAll = await this.hasPermission(
        session.id,
        "view:all_annotations",
        "page",
        pageId
      );

      if (!canViewAll) {
        authorizedFilters = {
          ...authorizedFilters,
          OR: [
            { userId: session.id }, // Own annotations
            { isResolved: false }, // Unresolved annotations (example business rule)
          ],
        };
      }
    }

    return { page, membership, filters: authorizedFilters };
  }

  /**
   * Check if user can create annotations on a page
   * @param {string} userId - User ID
   * @param {string} pageId - Page ID
   * @returns {Promise<boolean>} True if user can create annotations
   */
  static async canCreateAnnotation(userId, pageId) {
    try {
      // Check if user has annotation permission for this page
      return await this.hasPermission(userId, "create:annotation", "page", pageId);
    } catch (error) {
      Logger.error("Failed to check annotation creation permission", error);
      return false;
    }
  }

  /**
   * Get annotations for a page with proper authorization
   * @param {string} pageId - Page ID
   * @param {string} userId - User ID requesting annotations
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Authorized annotations
   */
  static async getAuthorizedAnnotations(pageId, userId, options = {}) {
    try {
      const session = await this.getSession();

      // Verify page access first
      await this.protectCreation(pageId);

      let whereClause = { pageId };

      // Apply authorization filters
      if (!this.isSuperAdmin(session)) {
        const canViewAll = await this.hasPermission(userId, "view:all_annotations", "page", pageId);

        if (!canViewAll) {
          whereClause = {
            ...whereClause,
            OR: [
              { userId }, // Own annotations
              { isResolved: false }, // Unresolved annotations
            ],
          };
        }
      }

      return await prisma.annotation.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
        orderBy: options.orderBy || { createdAt: "desc" },
        take: options.limit,
        skip: options.offset,
      });
    } catch (error) {
      Logger.error("Failed to get authorized annotations", error);
      return [];
    }
  }

  /**
   * Check if user can moderate annotations (resolve, delete others' annotations)
   * @param {string} userId - User ID
   * @param {string} pageId - Page ID
   * @returns {Promise<boolean>} True if user can moderate
   */
  static async canModerateAnnotations(userId, pageId) {
    try {
      const session = await this.getSession();

      if (this.isSuperAdmin(session)) return true;

      // Check for moderation permissions
      return await this.hasPermission(userId, "moderate:annotation", "page", pageId);
    } catch (error) {
      Logger.error("Failed to check annotation moderation permission", error);
      return false;
    }
  }

  /**
   * Protect annotation moderation operations
   * @param {string} pageId - Page ID
   * @returns {Promise<Object>} Session if authorized to moderate
   */
  static async protectModeration(pageId) {
    const session = await this.requireAuth();

    const canModerate = await this.canModerateAnnotations(session.id, pageId);
    if (!canModerate) {
      Logger.warn(
        `User ${session.id} attempted to moderate annotations on page ${pageId} without permission`
      );
      this.redirectUnauthorized();
    }

    return session;
  }
}

// Exported async functions for use in server components and actions
export async function protectAnnotation(annotationId) {
  return await AnnotationAuthGuard.protect(annotationId);
}

export async function protectAnnotationCreation(pageId) {
  return await AnnotationAuthGuard.protectCreation(pageId);
}

export async function protectAnnotationUpdate(annotationId) {
  return await AnnotationAuthGuard.protectUpdate(annotationId);
}

export async function protectAnnotationDeletion(annotationId) {
  return await AnnotationAuthGuard.protectDeletion(annotationId);
}

export async function protectAnnotationOwnership(annotationId) {
  return await AnnotationAuthGuard.protectOwnership(annotationId);
}

export async function protectAnnotationList(pageId, filters = {}) {
  return await AnnotationAuthGuard.protectList(pageId, filters);
}

export async function protectAnnotationResolution(annotationId) {
  return await AnnotationAuthGuard.protectResolution(annotationId);
}

export async function protectAnnotationModeration(annotationId) {
  return await AnnotationAuthGuard.protectModeration(annotationId);
}

export async function protectAnnotationReply(annotationId) {
  return await AnnotationAuthGuard.protectReply(annotationId);
}

export async function protectAnnotationSharing(annotationId) {
  return await AnnotationAuthGuard.protectSharing(annotationId);
}
