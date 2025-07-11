"use server";

import prisma from "@/lib/prisma";
import { BaseAuthGuard } from "./BaseAuthGuard";
import Logger from "@/lib/Logger";

/**
 * InvitationAuthGuard - Authorization guard for invitation-related operations
 *
 * Internal class for invitation authorization logic. Only async functions are exported
 * for use in server components and actions.
 */
class InvitationAuthGuard extends BaseAuthGuard {
  /**
   * Protect invitation access - only inviter and invitee can access
   * @param {string} invitationId - Invitation ID to access
   * @returns {Promise<Object>} Invitation object if authorized
   */
  static async protect(invitationId) {
    const session = await this.requireAuth();

    const invitation = await this.validateResourceExists(
      (where) =>
        prisma.invitation.findUnique({
          ...where,
          include: {
            workspace: true,
          },
        }),
      { where: { id: invitationId } },
      "Invitation"
    );

    // Super admins can access any invitation
    if (this.isSuperAdmin(session)) {
      return invitation;
    }

    // Inviter can access their sent invitations
    if (this.isOwner(session.id, invitation.invitedBy)) {
      return invitation;
    }

    // Invitee can access invitations sent to them
    if (session.email === invitation.email) {
      return invitation;
    }

    Logger.warn(
      `User ${session.id} attempted to access invitation ${invitationId} without permission`
    );
    this.redirectUnauthorized();
  }

  /**
   * Protect invitation by token (for public acceptance)
   * @param {string} token - Invitation token
   * @returns {Promise<Object>} Invitation object if valid
   */
  static async protectByToken(token) {
    const invitation = await this.validateResourceExists(
      (where) =>
        prisma.invitation.findUnique({
          ...where,
          include: {
            workspace: true,
          },
        }),
      { where: { token } },
      "Invitation"
    );

    // Check if invitation is still valid
    if (invitation.isAccepted) {
      Logger.warn(`Attempted to access already accepted invitation with token ${token}`);
      throw new Error("This invitation has already been accepted");
    }

    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      Logger.warn(`Attempted to access expired invitation with token ${token}`);
      throw new Error("This invitation has expired");
    }

    return invitation;
  }

  /**
   * Protect invitation creation for workspace
   * @param {string} workspaceId - Workspace ID to invite to
   * @returns {Promise<Object>} Workspace object if authorized
   */
  static async protectWorkspaceInvitation(workspaceId) {
    const session = await this.requireAuth();

    const workspace = await this.validateResourceExists(
      (where) => prisma.workspace.findUnique(where),
      { where: { id: workspaceId } },
      "Workspace"
    );

    // Check if user can invite to this workspace
    const canInvite = await this.canInviteToWorkspace(session.id, workspaceId);
    if (!canInvite) {
      Logger.warn(
        `User ${session.id} attempted to invite to workspace ${workspaceId} without permission`
      );
      this.redirectUnauthorized();
    }

    return workspace;
  }

  /**
   * Protect invitation creation for project
   * @param {string} projectId - Project ID to invite to
   * @returns {Promise<Object>} Project object if authorized
   */
  static async protectProjectInvitation(projectId) {
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

    // Check if user can invite to this project
    const canInvite = await this.canInviteToProject(session.id, projectId);
    if (!canInvite) {
      Logger.warn(
        `User ${session.id} attempted to invite to project ${projectId} without permission`
      );
      this.redirectUnauthorized();
    }

    return project;
  }

  /**
   * Protect invitation acceptance
   * @param {string} token - Invitation token
   * @param {string} acceptingUserId - User ID accepting the invitation
   * @returns {Promise<Object>} Invitation object if authorized
   */
  static async protectAcceptance(token, acceptingUserId) {
    const invitation = await this.protectByToken(token);

    // Verify the accepting user matches the invitation email
    const user = await prisma.user.findUnique({
      where: { id: acceptingUserId },
      select: { email: true },
    });

    if (!user || user.email !== invitation.email) {
      Logger.warn(`User ${acceptingUserId} attempted to accept invitation for ${invitation.email}`);
      throw new Error("You can only accept invitations sent to your email address");
    }

    return invitation;
  }

  /**
   * Protect invitation cancellation
   * @param {string} invitationId - Invitation ID to cancel
   * @returns {Promise<Object>} Invitation object if authorized
   */
  static async protectCancellation(invitationId) {
    const session = await this.requireAuth();

    const invitation = await this.validateResourceExists(
      (where) =>
        prisma.invitation.findUnique({
          ...where,
          include: { workspace: true },
        }),
      { where: { id: invitationId } },
      "Invitation"
    );

    // Super admins can cancel any invitation
    if (this.isSuperAdmin(session)) {
      return invitation;
    }

    // Inviter can cancel their own invitations
    if (this.isOwner(session.id, invitation.invitedBy)) {
      return invitation;
    }

    // Workspace owners can cancel invitations to their workspace
    if (this.isOwner(session.id, invitation.workspace.ownerId)) {
      return invitation;
    }

    Logger.warn(
      `User ${session.id} attempted to cancel invitation ${invitationId} without permission`
    );
    this.redirectUnauthorized();
  }

  /**
   * Protect invitation list access with filtering
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Session and authorized filters
   */
  static async protectList(filters = {}) {
    const session = await this.requireAuth();

    // Super admins can see all invitations
    if (this.isSuperAdmin(session)) {
      return { session, filters };
    }

    // Regular users can only see invitations they sent or received
    return {
      session,
      filters: {
        ...filters,
        OR: [{ invitedBy: session.id }, { email: session.email }],
      },
    };
  }

  /**
   * Check if user can invite to workspace
   * @param {string} userId - User ID
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<boolean>} True if user can invite
   */
  static async canInviteToWorkspace(userId, workspaceId) {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { ownerId: true },
      });

      if (!workspace) return false;

      // Workspace owners can invite
      if (workspace.ownerId === userId) return true;

      // Check for invite permission
      return await this.hasPermission(userId, "invite:user", "workspace", workspaceId);
    } catch (error) {
      Logger.error("Failed to check workspace invitation permission", error);
      return false;
    }
  }

  /**
   * Check if user can invite to project
   * @param {string} userId - User ID
   * @param {string} projectId - Project ID
   * @returns {Promise<boolean>} True if user can invite
   */
  static async canInviteToProject(userId, projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { workspace: true },
      });

      if (!project) return false;

      // Project owners can invite
      if (project.ownerId === userId) return true;

      // Workspace owners can invite to projects in their workspace
      if (project.workspace.ownerId === userId) return true;

      // Check for invite permission
      return await this.hasPermission(userId, "invite:user", "project", projectId);
    } catch (error) {
      Logger.error("Failed to check project invitation permission", error);
      return false;
    }
  }

  /**
   * Get pending invitations for user
   * @param {string} email - User email
   * @returns {Promise<Array>} Pending invitations
   */
  static async getPendingInvitations(email) {
    try {
      return await prisma.invitation.findMany({
        where: {
          email,
          isAccepted: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          workspace: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      Logger.error("Failed to get pending invitations", error);
      return [];
    }
  }

  /**
   * Get sent invitations for user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Sent invitations
   */
  static async getSentInvitations(userId, options = {}) {
    try {
      const session = await this.getSession();

      // Verify user can access sent invitations
      if (!this.isSuperAdmin(session) && session.id !== userId) {
        return [];
      }

      return await prisma.invitation.findMany({
        where: {
          invitedBy: userId,
          ...(options.workspaceId && { workspaceId: options.workspaceId }),
          ...(options.projectId && { projectId: options.projectId }),
        },
        include: {
          workspace: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: options.limit,
        skip: options.offset,
      });
    } catch (error) {
      Logger.error("Failed to get sent invitations", error);
      return [];
    }
  }

  /**
   * Check if invitation limit is reached for workspace
   * @param {string} workspaceId - Workspace ID
   * @returns {Promise<boolean>} True if limit is reached
   */
  static async isInvitationLimitReached(workspaceId) {
    try {
      // Get pending invitations count
      const pendingCount = await prisma.invitation.count({
        where: {
          workspaceId,
          isAccepted: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      // Define invitation limit (could be configurable per workspace plan)
      const INVITATION_LIMIT = 50;

      return pendingCount >= INVITATION_LIMIT;
    } catch (error) {
      Logger.error("Failed to check invitation limit", error);
      return true; // Err on the side of caution
    }
  }

  /**
   * Protect invitation creation with rate limiting
   * @param {string} workspaceId - Workspace ID
   * @param {string} inviterUserId - User ID sending invitation
   * @returns {Promise<Object>} Session if authorized
   */
  static async protectInvitationWithLimits(workspaceId, inviterUserId) {
    const session = await this.requireAuth();

    // Check basic invitation permission
    await this.protectWorkspaceInvitation(workspaceId);

    // Check invitation limits
    const limitReached = await this.isInvitationLimitReached(workspaceId);
    if (limitReached) {
      Logger.warn(`Invitation limit reached for workspace ${workspaceId}`);
      throw new Error("Invitation limit reached for this workspace");
    }

    return session;
  }
}

// Exported async functions for use in server components and actions
export async function protectInvitation(invitationId) {
  return await InvitationAuthGuard.protect(invitationId);
}

export async function protectInvitationCreation(workspaceId) {
  return await InvitationAuthGuard.protectCreation(workspaceId);
}

export async function protectInvitationUpdate(invitationId) {
  return await InvitationAuthGuard.protectUpdate(invitationId);
}

export async function protectInvitationDeletion(invitationId) {
  return await InvitationAuthGuard.protectDeletion(invitationId);
}

export async function protectInvitationSending(workspaceId) {
  return await InvitationAuthGuard.protectSending(workspaceId);
}

export async function protectInvitationAcceptance(invitationId) {
  return await InvitationAuthGuard.protectAcceptance(invitationId);
}

export async function protectInvitationRejection(invitationId) {
  return await InvitationAuthGuard.protectRejection(invitationId);
}

export async function protectInvitationList(workspaceId, filters = {}) {
  return await InvitationAuthGuard.protectList(workspaceId, filters);
}

export async function protectInvitationManagement(workspaceId) {
  return await InvitationAuthGuard.protectManagement(workspaceId);
}

export async function protectInvitationWithLimits(workspaceId, inviterUserId) {
  return await InvitationAuthGuard.protectInvitationWithLimits(workspaceId, inviterUserId);
}
