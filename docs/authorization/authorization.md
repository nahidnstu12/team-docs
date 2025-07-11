# Authorization System Documentation

## Overview

The authorization system provides a comprehensive, Laravel-like authorization framework for Next.js applications. It includes role-based access control (RBAC), permission management, resource ownership validation, and fine-grained access control across all application resources.

## Architecture

### Core Components

1. **BaseAuthGuard** - Foundation class providing common authorization functionality
2. **Resource Guards** - Specialized guards for each resource type (User, Workspace, Project, etc.)
3. **PermissionChecker** - Centralized permission validation system
4. **AuthorizationUtils** - Utilities and decorators for streamlined authorization
5. **RBAC Integration** - Role and permission management system

### Authorization Layers

```
┌─────────────────────────────────────────┐
│           Middleware Layer              │
│     (Route-level protection)            │
├─────────────────────────────────────────┤
│         Component Layer                 │
│    (Server component guards)            │
├─────────────────────────────────────────┤
│         Service Layer                   │
│   (Business logic authorization)        │
├─────────────────────────────────────────┤
│          Data Layer                     │
│    (Database-level filtering)           │
└─────────────────────────────────────────┘
```

## Quick Start

### Basic Usage

```javascript
import { Auth } from "@/authorization";

// In server components
export default async function ProjectPage({ params }) {
  const { project } = await Auth.Project.protectBySlug(params.slug);
  return <div>Project: {project.name}</div>;
}

// In server actions
export async function updateProject(projectId, data) {
  await Auth.Project.protectUpdate(projectId);
  // Update logic here
}

// Using decorators
const updateProjectAction = Auth.withAuth.permission(
  "edit:project", 
  "project", 
  (projectId) => projectId
)(async (projectId, data) => {
  // Action logic here
});
```

### Permission Checking

```javascript
import { PermissionChecker } from "@/authorization";

// Check specific permission
const canEdit = await PermissionChecker.hasPermission(
  userId, 
  "edit:project", 
  "project", 
  projectId
);

// Check multiple permissions
const canManage = await PermissionChecker.checkMultiplePermissions(
  userId,
  [
    { name: "edit:project", scope: "project", resourceId: projectId },
    { name: "manage:members", scope: "project", resourceId: projectId }
  ],
  "OR" // AND or OR logic
);
```

## Resource Guards

### Available Guards

- **UserAuthGuard** - User management and profile access
- **AdminAuthGuard** - Administrative operations
- **WorkspaceAuthGuard** - Workspace-level operations
- **ProjectAuthGuard** - Project-level operations
- **SectionAuthGuard** - Section-level operations
- **PageAuthGuard** - Page-level operations
- **RoleAuthGuard** - Role management
- **PermissionAuthGuard** - Permission management
- **AnnotationAuthGuard** - Annotation operations
- **NotificationAuthGuard** - Notification management
- **InvitationAuthGuard** - Invitation operations

### Guard Methods

Each guard provides standard methods:

```javascript
// Protection methods
static async protect(resourceId)           // Basic access protection
static async protectCreation(parentId)     // Creation permission
static async protectUpdate(resourceId)     // Update permission
static async protectDeletion(resourceId)   // Deletion permission
static async protectOwnership(resourceId)  // Ownership validation

// Utility methods
static async canEdit(userId, resourceId)   // Check edit permission
static async getUserRole(userId, resourceId) // Get user's role
```

## Permission System

### Permission Structure

Permissions follow the format: `action:resource`

```javascript
// Examples
"create:project"    // Can create projects
"edit:page"         // Can edit pages
"manage:workspace"  // Can manage workspace
"delete:section"    // Can delete sections
```

### Permission Scopes

- **system** - System-wide permissions
- **workspace** - Workspace-scoped permissions
- **project** - Project-scoped permissions
- **section** - Section-scoped permissions
- **page** - Page-scoped permissions

### Permission Hierarchy

```
Super Admin
    ├── System Permissions (all)
    └── Workspace Owner
        ├── Workspace Permissions
        └── Project Owner
            ├── Project Permissions
            └── Section Owner
                ├── Section Permissions
                └── Page Owner
                    └── Page Permissions
```

## Usage Patterns

### Server Components

```javascript
import { Auth } from "@/authorization";

export default async function WorkspacePage({ params }) {
  // Protect workspace access
  const { workspace, membership } = await Auth.Workspace.protectBySlug(params.slug);
  
  // Get user's effective permissions
  const permissions = await Auth.Utils.getUserEffectivePermissions(
    membership.userId, 
    "workspace", 
    workspace.id
  );
  
  return (
    <div>
      <h1>{workspace.name}</h1>
      {permissions.all.includes("manage:workspace") && (
        <WorkspaceSettings workspace={workspace} />
      )}
    </div>
  );
}
```

### Server Actions

```javascript
"use server";

import { Auth } from "@/authorization";

export async function createProject(workspaceId, projectData) {
  // Protect project creation
  const { session } = await Auth.Project.protectCreation(workspaceId);
  
  // Create project logic
  const project = await prisma.project.create({
    data: {
      ...projectData,
      workspaceId,
      ownerId: session.id
    }
  });
  
  return project;
}

// Using decorators
export const updateProject = Auth.withAuth.permission(
  "edit:project",
  "project",
  (projectId) => projectId
)(async (projectId, data) => {
  return await prisma.project.update({
    where: { id: projectId },
    data
  });
});
```

### Authorization Decorators

```javascript
import { withAuth } from "@/authorization";

// Require authentication
const protectedAction = withAuth.user(async () => {
  // Action logic
});

// Require admin privileges
const adminAction = withAuth.admin(async () => {
  // Admin logic
});

// Require workspace membership
const workspaceAction = withAuth.workspace(
  (workspaceId) => workspaceId
)(async (workspaceId) => {
  // Workspace logic
});

// Require specific permission
const permissionAction = withAuth.permission(
  "manage:project",
  "project",
  (projectId) => projectId
)(async (projectId) => {
  // Project management logic
});
```

## Best Practices

### 1. Use Appropriate Guards

```javascript
// ✅ Good - Use specific guard methods
await Auth.Project.protectEditor(projectSlug);

// ❌ Avoid - Generic permission checks
const session = await Auth.requireAuth();
const canEdit = await checkProjectEditPermission(session.id, projectId);
```

### 2. Leverage Authorization Context

```javascript
// ✅ Good - Create authorization context
const authContext = await Auth.Utils.createAuthContext(userId, "project", projectId);
const canManage = Auth.Utils.validateOperation(authContext, "manage");

// ❌ Avoid - Multiple separate permission checks
const canRead = await Auth.hasPermission(userId, "read:project", "project", projectId);
const canWrite = await Auth.hasPermission(userId, "write:project", "project", projectId);
```

### 3. Use Resource-Specific Helpers

```javascript
// ✅ Good - Use resource helpers
const projectAuth = Auth.project;
const canEdit = await projectAuth.canWrite(userId, projectId);

// ❌ Avoid - Manual permission construction
const canEdit = await Auth.hasPermission(userId, "write:project", "project", projectId);
```

### 4. Implement Proper Error Handling

```javascript
// ✅ Good - Let guards handle authorization errors
try {
  const { project } = await Auth.Project.protectBySlug(slug);
  // Continue with logic
} catch (error) {
  // Handle other errors, authorization is handled by guard
}

// ❌ Avoid - Manual authorization error handling
const session = await Auth.getSession();
if (!session) {
  throw new Error("Unauthorized");
}
```

### 5. Use Batch Operations for Performance

```javascript
// ✅ Good - Batch permission checks
const permissions = await Auth.Utils.batchCheckPermissions(userId, [
  { permission: "read:project", scope: "project", resourceId: project1Id },
  { permission: "read:project", scope: "project", resourceId: project2Id }
]);

// ❌ Avoid - Individual permission checks in loops
for (const project of projects) {
  const canRead = await Auth.hasPermission(userId, "read:project", "project", project.id);
}
```

## Common Patterns

### Workspace-Scoped Operations

```javascript
export async function createProject(workspaceId, data) {
  // Ensure user can create projects in workspace
  await Auth.Project.protectCreation(workspaceId);
  
  // Create project
  return await prisma.project.create({
    data: { ...data, workspaceId }
  });
}
```

### Ownership-Based Operations

```javascript
export async function deleteProject(projectId) {
  // Ensure user owns project or has delete permission
  await Auth.Project.protectDeletion(projectId);
  
  // Delete project
  return await prisma.project.delete({
    where: { id: projectId }
  });
}
```

### Multi-Level Authorization

```javascript
export async function createPage(sectionId, data) {
  // Check section access (which validates project and workspace access)
  const { section } = await Auth.Section.protectCreation(sectionId);
  
  // Create page
  return await prisma.page.create({
    data: { ...data, sectionId }
  });
}
```

## Error Handling

The authorization system uses Next.js built-in error handling:

- **forbidden()** - Returns 403 Forbidden response
- **notFound()** - Returns 404 Not Found response
- **Custom errors** - Thrown for specific validation failures

```javascript
try {
  await Auth.Project.protectBySlug(slug);
} catch (error) {
  // Authorization errors are automatically handled
  // Only handle business logic errors here
}
```

## Testing Authorization

```javascript
import { Auth } from "@/authorization";

describe("Project Authorization", () => {
  it("should allow project owner to edit", async () => {
    const { project } = await Auth.Project.protectEditor(projectSlug);
    expect(project).toBeDefined();
  });
  
  it("should deny non-member access", async () => {
    await expect(
      Auth.Project.protectBySlug(projectSlug)
    ).rejects.toThrow();
  });
});
```

## Migration Guide

### From Old System

```javascript
// Old way
const session = await Session.getCurrentUser();
const project = await prisma.project.findUnique({
  where: { slug },
  include: { workspace: { include: { members: true } } }
});
if (!project.workspace.members.some(m => m.userId === session.id)) {
  throw new Error("Unauthorized");
}

// New way
const { project } = await Auth.Project.protectBySlug(slug);
```

This authorization system provides comprehensive, maintainable, and scalable access control for your Next.js application while following Laravel's proven authorization patterns.
