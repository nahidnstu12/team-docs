# Permission System Documentation

## Overview

The permission system provides fine-grained access control through a comprehensive Role-Based Access Control (RBAC) implementation. It supports direct user permissions, role-based permissions, and ownership-based permissions across multiple scopes.

## Permission Structure

### Permission Format

Permissions follow the format: `action:resource`

```javascript
// Examples
"create:project"     // Can create projects
"edit:page"          // Can edit pages
"manage:workspace"   // Can manage workspace
"delete:section"     // Can delete sections
"invite:user"        // Can invite users
"view:analytics"     // Can view analytics
```

### Permission Scopes

Permissions are scoped to different levels of the application hierarchy:

- **system** - System-wide permissions (admin operations)
- **workspace** - Workspace-scoped permissions
- **project** - Project-scoped permissions
- **section** - Section-scoped permissions
- **page** - Page-scoped permissions
- **user** - User-scoped permissions

## Permission Types

### 1. Direct User Permissions

Permissions assigned directly to users for specific resources.

```javascript
// Database: ProjectUserPermission table
{
  userId: "user-123",
  projectId: "project-456",
  permissionId: "permission-789"
}
```

### 2. Role-Based Permissions

Permissions inherited through role assignments.

```javascript
// User has role in workspace/project
// Role has permissions assigned
// User inherits permissions through role
```

### 3. Ownership Permissions

Permissions automatically granted to resource owners.

```javascript
// Workspace owners automatically get:
["manage:workspace", "delete:workspace", "invite:user", "manage:members"]

// Project owners automatically get:
["manage:project", "delete:project", "edit:project", "create:section"]
```

## Permission Checking

### Basic Permission Check

```javascript
import { PermissionChecker } from "@/authorization";

const hasPermission = await PermissionChecker.hasPermission(
  userId,           // User ID
  "edit:project",   // Permission name
  "project",        // Scope
  projectId         // Resource ID (optional)
);
```

### Multiple Permission Checks

```javascript
// Check multiple permissions with AND logic
const hasAllPermissions = await PermissionChecker.checkMultiplePermissions(
  userId,
  [
    { name: "edit:project", scope: "project", resourceId: projectId },
    { name: "create:section", scope: "project", resourceId: projectId }
  ],
  "AND"
);

// Check multiple permissions with OR logic
const hasAnyPermission = await PermissionChecker.checkMultiplePermissions(
  userId,
  [
    { name: "edit:project", scope: "project", resourceId: projectId },
    { name: "manage:project", scope: "project", resourceId: projectId }
  ],
  "OR"
);
```

### Get User Permissions

```javascript
// Get all permissions for a user in a scope
const permissions = await PermissionChecker.getUserPermissions(
  userId,
  "project",
  projectId
);

// Returns array of permission names
console.log(permissions); // ["edit:project", "create:section", "delete:page"]
```

## Permission Hierarchy

### System Level
```
Super Admin
├── All system permissions
├── All workspace permissions
├── All project permissions
└── All resource permissions
```

### Workspace Level
```
Workspace Owner
├── manage:workspace
├── delete:workspace
├── invite:user
├── manage:members
└── All project permissions in workspace
```

### Project Level
```
Project Owner
├── manage:project
├── delete:project
├── edit:project
├── create:section
└── All section/page permissions in project
```

### Resource Level
```
Resource Owner (Section/Page)
├── edit:resource
├── delete:resource
└── Resource-specific permissions
```

## Standard Permissions

### User Permissions
```javascript
const USER_PERMISSIONS = {
  "create:user": "Can create new users",
  "read:user": "Can view user profiles",
  "update:user": "Can update user information",
  "delete:user": "Can delete users",
  "manage:user": "Can manage user accounts"
};
```

### Workspace Permissions
```javascript
const WORKSPACE_PERMISSIONS = {
  "create:workspace": "Can create workspaces",
  "read:workspace": "Can view workspace",
  "update:workspace": "Can update workspace settings",
  "delete:workspace": "Can delete workspace",
  "manage:workspace": "Can manage workspace",
  "invite:user": "Can invite users to workspace",
  "manage:members": "Can manage workspace members"
};
```

### Project Permissions
```javascript
const PROJECT_PERMISSIONS = {
  "create:project": "Can create projects",
  "read:project": "Can view project",
  "update:project": "Can update project settings",
  "delete:project": "Can delete project",
  "manage:project": "Can manage project",
  "edit:project": "Can edit project content"
};
```

### Section Permissions
```javascript
const SECTION_PERMISSIONS = {
  "create:section": "Can create sections",
  "read:section": "Can view section",
  "update:section": "Can update section",
  "delete:section": "Can delete section",
  "edit:section": "Can edit section content"
};
```

### Page Permissions
```javascript
const PAGE_PERMISSIONS = {
  "create:page": "Can create pages",
  "read:page": "Can view page",
  "update:page": "Can update page",
  "delete:page": "Can delete page",
  "edit:page": "Can edit page content",
  "share:page": "Can share page publicly"
};
```

### Annotation Permissions
```javascript
const ANNOTATION_PERMISSIONS = {
  "create:annotation": "Can create annotations",
  "read:annotation": "Can view annotations",
  "update:annotation": "Can update annotations",
  "delete:annotation": "Can delete annotations",
  "resolve:annotation": "Can resolve annotations",
  "moderate:annotation": "Can moderate annotations"
};
```

## Permission Usage Patterns

### Server Components

```javascript
import { PermissionChecker } from "@/authorization";

export default async function ProjectEditor({ params }) {
  const session = await Session.getCurrentUser();
  
  // Check edit permission
  const canEdit = await PermissionChecker.hasPermission(
    session.id,
    "edit:project",
    "project",
    params.projectId
  );
  
  if (!canEdit) {
    return <div>You don't have permission to edit this project.</div>;
  }
  
  return <ProjectEditorComponent projectId={params.projectId} />;
}
```

### Server Actions

```javascript
"use server";

import { PermissionChecker } from "@/authorization";

export async function updateProject(projectId, data) {
  const session = await Session.getCurrentUser();
  
  // Check permission before action
  const hasPermission = await PermissionChecker.hasPermission(
    session.id,
    "edit:project",
    "project",
    projectId
  );
  
  if (!hasPermission) {
    throw new Error("Insufficient permissions");
  }
  
  return await prisma.project.update({
    where: { id: projectId },
    data
  });
}
```

### Conditional Rendering

```javascript
import { PermissionChecker } from "@/authorization";

export default async function WorkspaceDashboard({ workspaceId }) {
  const session = await Session.getCurrentUser();
  
  // Get user's permissions
  const permissions = await PermissionChecker.getUserPermissions(
    session.id,
    "workspace",
    workspaceId
  );
  
  return (
    <div>
      <h1>Workspace Dashboard</h1>
      
      {permissions.includes("create:project") && (
        <CreateProjectButton />
      )}
      
      {permissions.includes("manage:members") && (
        <MemberManagementPanel />
      )}
      
      {permissions.includes("manage:workspace") && (
        <WorkspaceSettings />
      )}
    </div>
  );
}
```

## Permission Management

### Creating Custom Permissions

```javascript
// In database migration or seed
await prisma.permission.create({
  data: {
    name: "export:data",
    description: "Can export workspace data",
    scope: "workspace",
    ownerId: null // System permission
  }
});
```

### Assigning Permissions to Roles

```javascript
// Assign permission to role
await prisma.rolePermissionAssignment.create({
  data: {
    roleId: "role-123",
    permissionId: "permission-456"
  }
});
```

### Direct User Permission Assignment

```javascript
// Assign permission directly to user for specific project
await prisma.projectUserPermission.create({
  data: {
    userId: "user-123",
    projectId: "project-456",
    permissionId: "permission-789"
  }
});
```

## Advanced Permission Patterns

### Conditional Permissions

```javascript
// Permission that depends on resource state
export async function canEditProject(userId, projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });
  
  // Can't edit archived projects
  if (project.status === "ARCHIVED") {
    return false;
  }
  
  return await PermissionChecker.hasPermission(
    userId,
    "edit:project",
    "project",
    projectId
  );
}
```

### Time-Based Permissions

```javascript
// Permission that expires
export async function hasTemporaryAccess(userId, resourceId) {
  const permission = await prisma.temporaryPermission.findFirst({
    where: {
      userId,
      resourceId,
      expiresAt: { gt: new Date() }
    }
  });
  
  return !!permission;
}
```

### Cascading Permissions

```javascript
// Check permission at multiple levels
export async function canAccessPage(userId, pageId) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: {
      section: {
        include: {
          project: {
            include: { workspace: true }
          }
        }
      }
    }
  });
  
  // Check at each level
  const checks = await Promise.all([
    PermissionChecker.hasPermission(userId, "read:page", "page", pageId),
    PermissionChecker.hasPermission(userId, "read:section", "section", page.sectionId),
    PermissionChecker.hasPermission(userId, "read:project", "project", page.section.projectId),
    PermissionChecker.hasPermission(userId, "read:workspace", "workspace", page.section.project.workspaceId)
  ]);
  
  return checks.some(check => check === true);
}
```

## Performance Considerations

### Batch Permission Checks

```javascript
// Instead of multiple individual checks
const permissions = await Promise.all([
  PermissionChecker.hasPermission(userId, "read:project", "project", project1Id),
  PermissionChecker.hasPermission(userId, "read:project", "project", project2Id),
  PermissionChecker.hasPermission(userId, "read:project", "project", project3Id)
]);

// Use batch checking
const permissions = await PermissionChecker.batchCheckPermissions(userId, [
  { permission: "read:project", scope: "project", resourceId: project1Id },
  { permission: "read:project", scope: "project", resourceId: project2Id },
  { permission: "read:project", scope: "project", resourceId: project3Id }
]);
```

### Caching Permissions

```javascript
// Cache user permissions for session
const userPermissions = await PermissionChecker.getUserPermissions(
  userId,
  "workspace",
  workspaceId
);

// Store in session or cache
session.permissions = userPermissions;
```

## Testing Permissions

```javascript
import { PermissionChecker } from "@/authorization";

describe("Permission System", () => {
  it("should grant permission to project owner", async () => {
    const hasPermission = await PermissionChecker.hasPermission(
      ownerId,
      "edit:project",
      "project",
      projectId
    );
    
    expect(hasPermission).toBe(true);
  });
  
  it("should deny permission to non-member", async () => {
    const hasPermission = await PermissionChecker.hasPermission(
      nonMemberId,
      "edit:project",
      "project",
      projectId
    );
    
    expect(hasPermission).toBe(false);
  });
});
```

## Migration and Seeding

### Default Permissions

```javascript
// Create default system permissions
const defaultPermissions = [
  { name: "create:workspace", scope: "system", description: "Can create workspaces" },
  { name: "manage:user", scope: "system", description: "Can manage users" },
  { name: "view:analytics", scope: "system", description: "Can view system analytics" }
];

for (const permission of defaultPermissions) {
  await prisma.permission.upsert({
    where: { name: permission.name },
    update: {},
    create: permission
  });
}
```

### Default Roles with Permissions

```javascript
// Create admin role with all permissions
const adminRole = await prisma.role.create({
  data: {
    name: "Admin",
    description: "Full system access",
    isSystem: true
  }
});

// Assign all permissions to admin role
const allPermissions = await prisma.permission.findMany();
for (const permission of allPermissions) {
  await prisma.rolePermissionAssignment.create({
    data: {
      roleId: adminRole.id,
      permissionId: permission.id
    }
  });
}
```

This permission system provides flexible, scalable, and maintainable access control that can adapt to complex authorization requirements while maintaining performance and security.
