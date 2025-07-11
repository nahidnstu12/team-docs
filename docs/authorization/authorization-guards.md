# Authorization Guards Reference

## Overview

Authorization guards provide resource-specific protection methods following Laravel's authorization patterns. Each guard handles authorization for a specific resource type and provides standardized methods for common operations.

## BaseAuthGuard

The foundation class that all other guards extend.

### Core Methods

```javascript
import { BaseAuthGuard } from "@/authorization";

// Session management
const session = await BaseAuthGuard.getSession();
const user = await BaseAuthGuard.requireAuth();
const admin = await BaseAuthGuard.requireSuperAdmin();

// Permission checking
const hasPermission = await BaseAuthGuard.hasPermission(userId, "edit:project", "project", projectId);
await BaseAuthGuard.requirePermission(userId, "manage:workspace", "workspace", workspaceId);

// Ownership validation
const isOwner = BaseAuthGuard.isOwner(userId, resourceOwnerId);
BaseAuthGuard.requireOwnership(userId, resourceOwnerId, "project");

// Membership validation
const membership = await BaseAuthGuard.getWorkspaceMembership(userId, workspaceId);
await BaseAuthGuard.requireWorkspaceMembership(userId, workspaceId);
```

## UserAuthGuard

Handles user-related authorization operations.

### Methods

```javascript
import { UserAuthGuard } from "@/authorization";

// Basic protection
const session = await UserAuthGuard.protect();

// Profile access (users can only access their own profile)
const user = await UserAuthGuard.protectProfile(userId);

// User management (admin only)
const adminSession = await UserAuthGuard.protectUserManagement();

// User list with filtering
const { session, filters } = await UserAuthGuard.protectUserList({ status: "active" });

// User updates with sensitive field protection
const user = await UserAuthGuard.protectUserUpdate(userId, updateData);

// User deletion (admin only, prevents self-deletion)
const user = await UserAuthGuard.protectUserDeletion(userId);

// Invitation permissions
const session = await UserAuthGuard.protectUserInvitation(workspaceId);
```

### Usage Examples

```javascript
// In server component
export default async function UserProfile({ params }) {
  const user = await UserAuthGuard.protectProfile(params.userId);
  return <UserProfileComponent user={user} />;
}

// In server action
export async function updateUserProfile(userId, data) {
  await UserAuthGuard.protectUserUpdate(userId, data);
  return await prisma.user.update({
    where: { id: userId },
    data
  });
}
```

## AdminAuthGuard

Handles administrative operations requiring super admin privileges.

### Methods

```javascript
import { AdminAuthGuard } from "@/authorization";

// Basic admin protection
const adminSession = await AdminAuthGuard.protect();

// Specific admin operations
const session = await AdminAuthGuard.protectUserManagement();
const session = await AdminAuthGuard.protectWorkspaceManagement();
const session = await AdminAuthGuard.protectSystemSettings();
const session = await AdminAuthGuard.protectAnalytics();
const session = await AdminAuthGuard.protectMaintenance();
const session = await AdminAuthGuard.protectAuditLogs();

// Utility methods
const isAdmin = await AdminAuthGuard.isAdmin();
const context = await AdminAuthGuard.getAdminContext();
```

## WorkspaceAuthGuard

Handles workspace-level authorization.

### Methods

```javascript
import { WorkspaceAuthGuard } from "@/authorization";

// Basic workspace access
const membership = await WorkspaceAuthGuard.protect(workspaceId);
const { workspace, membership } = await WorkspaceAuthGuard.protectBySlug(slug);

// Ownership operations
const workspace = await WorkspaceAuthGuard.protectOwnership(workspaceId);

// Management operations
const { workspace, role } = await WorkspaceAuthGuard.protectManagement(workspaceId);

// Creation and deletion
const session = await WorkspaceAuthGuard.protectCreation();
const workspace = await WorkspaceAuthGuard.protectDeletion(workspaceId);

// Member management
const { workspace, canManage } = await WorkspaceAuthGuard.protectMemberManagement(workspaceId);

// Settings access
const workspace = await WorkspaceAuthGuard.protectSettings(workspaceId);

// Invitations
const session = await WorkspaceAuthGuard.protectInvitation(workspaceId);
```

### Usage Examples

```javascript
// Workspace dashboard
export default async function WorkspacePage({ params }) {
  const { workspace, membership } = await WorkspaceAuthGuard.protectBySlug(params.slug);
  
  return (
    <div>
      <h1>{workspace.name}</h1>
      <p>Your role: {membership.role.name}</p>
    </div>
  );
}

// Workspace settings
export default async function WorkspaceSettings({ params }) {
  const workspace = await WorkspaceAuthGuard.protectSettings(params.workspaceId);
  return <WorkspaceSettingsForm workspace={workspace} />;
}
```

## ProjectAuthGuard

Handles project-level authorization.

### Methods

```javascript
import { ProjectAuthGuard } from "@/authorization";

// Basic project access
const { project, membership } = await ProjectAuthGuard.protectBySlug(slug);
const { project, membership } = await ProjectAuthGuard.protectById(projectId);

// Editor access (requires edit permissions)
const { project, membership } = await ProjectAuthGuard.protectEditor(slug);

// Ownership and management
const project = await ProjectAuthGuard.protectOwnership(projectId);
const { project, role } = await ProjectAuthGuard.protectManagement(projectId);

// Creation and deletion
const { session, membership } = await ProjectAuthGuard.protectCreation(workspaceId);
const project = await ProjectAuthGuard.protectDeletion(projectId);

// Member management
const { project, canManage } = await ProjectAuthGuard.protectMemberManagement(projectId);
```

## SectionAuthGuard

Handles section-level authorization.

### Methods

```javascript
import { SectionAuthGuard } from "@/authorization";

// Basic section access
const { section, membership } = await SectionAuthGuard.protectBySectionId(sectionId);

// Creation in project
const { project, membership } = await SectionAuthGuard.protectCreation(projectId);

// Update and deletion
const { section, membership } = await SectionAuthGuard.protectUpdate(sectionId);
const { section, membership } = await SectionAuthGuard.protectDeletion(sectionId);

// Ownership
const section = await SectionAuthGuard.protectOwnership(sectionId);

// List access
const { project, membership, filters } = await SectionAuthGuard.protectList(projectId, filters);
```

## PageAuthGuard

Handles page-level authorization.

### Methods

```javascript
import { PageAuthGuard } from "@/authorization";

// Basic page access
const { page, membership } = await PageAuthGuard.protectByPageId(pageId);

// Creation in section
const { section, membership } = await PageAuthGuard.protectCreation(sectionId);

// Update and deletion
const { page, membership } = await PageAuthGuard.protectUpdate(pageId);
const { page, membership } = await PageAuthGuard.protectDeletion(pageId);

// Ownership
const page = await PageAuthGuard.protectOwnership(pageId);

// Public access (for shared pages)
const page = await PageAuthGuard.protectPublicAccess(pageId, password);

// Sharing operations
const { page, membership } = await PageAuthGuard.protectSharing(pageId);

// List access
const { section, membership, filters } = await PageAuthGuard.protectList(sectionId, filters);
```

## RoleAuthGuard

Handles role management authorization.

### Methods

```javascript
import { RoleAuthGuard } from "@/authorization";

// Basic role access
const role = await RoleAuthGuard.protect(roleId);

// Creation and updates
const session = await RoleAuthGuard.protectCreation();
const role = await RoleAuthGuard.protectUpdate(roleId, updateData);
const role = await RoleAuthGuard.protectDeletion(roleId);

// Role assignment
const { role, canAssign } = await RoleAuthGuard.protectAssignment(roleId, userId, scope, scopeId);

// List access with filtering
const { session, filters } = await RoleAuthGuard.protectList(filters);
```

## PermissionAuthGuard

Handles permission management authorization.

### Methods

```javascript
import { PermissionAuthGuard } from "@/authorization";

// Basic permission access
const permission = await PermissionAuthGuard.protect(permissionId);

// Creation and updates
const session = await PermissionAuthGuard.protectCreation();
const permission = await PermissionAuthGuard.protectUpdate(permissionId, updateData);
const permission = await PermissionAuthGuard.protectDeletion(permissionId);

// Permission assignment
const { permission, role } = await PermissionAuthGuard.protectRoleAssignment(permissionId, roleId);
const { permission, canAssign } = await PermissionAuthGuard.protectUserAssignment(permissionId, userId, projectId);

// List and scope access
const { session, filters } = await PermissionAuthGuard.protectList(filters);
const session = await PermissionAuthGuard.protectScopeAccess(scope);
```

## AnnotationAuthGuard

Handles annotation authorization.

### Methods

```javascript
import { AnnotationAuthGuard } from "@/authorization";

// Basic annotation access
const { annotation, membership } = await AnnotationAuthGuard.protect(annotationId);

// Creation on page
const { page, membership } = await AnnotationAuthGuard.protectCreation(pageId);

// Update and deletion
const { annotation, membership } = await AnnotationAuthGuard.protectUpdate(annotationId);
const { annotation, membership } = await AnnotationAuthGuard.protectDeletion(annotationId);

// Resolution operations
const { annotation, membership } = await AnnotationAuthGuard.protectResolution(annotationId);

// List access with filtering
const { page, membership, filters } = await AnnotationAuthGuard.protectList(pageId, filters);

// Moderation
const session = await AnnotationAuthGuard.protectModeration(pageId);
```

## NotificationAuthGuard

Handles notification authorization.

### Methods

```javascript
import { NotificationAuthGuard } from "@/authorization";

// Basic notification access (own notifications only)
const notification = await NotificationAuthGuard.protect(notificationId);

// Creation (system/admin operation)
const session = await NotificationAuthGuard.protectCreation(targetUserId);

// Update and deletion
const notification = await NotificationAuthGuard.protectUpdate(notificationId);
const notification = await NotificationAuthGuard.protectDeletion(notificationId);

// List access with filtering
const { session, filters } = await NotificationAuthGuard.protectList(userId, filters);

// Bulk operations
const session = await NotificationAuthGuard.protectBulkOperations(userId);

// Broadcasting
const { session, authorizedTargets } = await NotificationAuthGuard.protectBroadcast(targetUserIds, notificationType);
```

## InvitationAuthGuard

Handles invitation authorization.

### Methods

```javascript
import { InvitationAuthGuard } from "@/authorization";

// Basic invitation access
const invitation = await InvitationAuthGuard.protect(invitationId);

// Token-based access (for public acceptance)
const invitation = await InvitationAuthGuard.protectByToken(token);

// Creation for workspace/project
const workspace = await InvitationAuthGuard.protectWorkspaceInvitation(workspaceId);
const project = await InvitationAuthGuard.protectProjectInvitation(projectId);

// Acceptance and cancellation
const invitation = await InvitationAuthGuard.protectAcceptance(token, acceptingUserId);
const invitation = await InvitationAuthGuard.protectCancellation(invitationId);

// List access with filtering
const { session, filters } = await InvitationAuthGuard.protectList(filters);

// Rate limiting
const session = await InvitationAuthGuard.protectInvitationWithLimits(workspaceId, inviterUserId);
```

## Common Patterns

### Error Handling

All guards automatically handle authorization errors by calling `forbidden()` or `notFound()`. You don't need to manually handle authorization failures.

```javascript
try {
  const { project } = await ProjectAuthGuard.protectBySlug(slug);
  // Continue with business logic
} catch (error) {
  // Only handle non-authorization errors here
  // Authorization errors are automatically handled
}
```

### Chaining Guards

You can chain multiple authorization checks:

```javascript
// First check workspace access, then project access
const { workspace } = await WorkspaceAuthGuard.protectBySlug(workspaceSlug);
const { project } = await ProjectAuthGuard.protectById(projectId);

// Verify project belongs to workspace
if (project.workspaceId !== workspace.id) {
  throw new Error("Project not in workspace");
}
```

### Custom Authorization Logic

Extend guards for custom authorization logic:

```javascript
class CustomProjectAuthGuard extends ProjectAuthGuard {
  static async protectSpecialOperation(projectId) {
    const { project, membership } = await this.protectById(projectId);
    
    // Custom logic
    if (project.status !== "ACTIVE") {
      throw new Error("Project not active");
    }
    
    return { project, membership };
  }
}
```
