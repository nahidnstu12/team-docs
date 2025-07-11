# Getting Started with Authorization

## Quick Start

The authorization system is ready to use immediately. Here's how to get started:

### 1. Basic Authentication

Protect any server component or action with authentication:

```javascript
import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";

export default async function ProtectedPage() {
  const session = await BaseAuthGuard.requireAuth();
  return <div>Welcome, {session.username}!</div>;
}
```

### 2. Resource Protection

Protect access to specific resources:

```javascript
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

export default async function ProjectPage({ params }) {
  const { project, membership } = await protectProjectBySlug(params.slug);

  return (
    <div>
      <h1>{project.name}</h1>
      <p>Your role: {membership.role.name}</p>
    </div>
  );
}
```

### 3. Permission Checking

Check specific permissions before allowing actions:

```javascript
import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";

export async function updateProject(projectId, data) {
  const session = await BaseAuthGuard.requireAuth();
  const canEdit = await BaseAuthGuard.hasPermission(
    session.id,
    "edit:project",
    "project",
    projectId
  );

  if (!canEdit) {
    throw new Error("Insufficient permissions");
  }

  // Update logic here
}
```

## Core Concepts

### 1. Guards

Guards are the main way to protect resources. Each resource type has its own guard:

```javascript
// User protection
import { protectUser } from "@/authorization/UserAuthGuard";

// Admin protection
import { protectAdmin } from "@/authorization/AdminAuthGuard";

// Workspace protection
import { protectWorkspaceBySlug } from "@/authorization/WorkspaceAuthGuard";

// Project protection
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

// Section protection
import { protectSectionById } from "@/authorization/SectionAuthGuard";

// Page protection
import { protectPageById } from "@/authorization/PageAuthGuard";
```

### 2. Permissions

Permissions follow the format `action:resource`:

```javascript
// Examples
"create:project"; // Can create projects
"edit:page"; // Can edit pages
"manage:workspace"; // Can manage workspace
"delete:section"; // Can delete sections
"invite:user"; // Can invite users
```

### 3. Scopes

Permissions are scoped to different levels:

- **system** - System-wide permissions
- **workspace** - Workspace-scoped permissions
- **project** - Project-scoped permissions
- **section** - Section-scoped permissions
- **page** - Page-scoped permissions

### 4. Permission Hierarchy

```
Super Admin
├── All system permissions
└── Workspace Owner
    ├── All workspace permissions
    └── Project Owner
        ├── All project permissions
        └── Resource Owner
            └── Resource permissions
```

## Common Usage Patterns

### 1. Server Component Protection

```javascript
// app/workspace/[slug]/page.js
import { protectWorkspaceBySlug } from "@/authorization/WorkspaceAuthGuard";

export default async function WorkspacePage({ params }) {
  const { workspace, membership } = await protectWorkspaceBySlug(params.slug);

  return (
    <div>
      <h1>{workspace.name}</h1>
      <WorkspaceContent workspace={workspace} membership={membership} />
    </div>
  );
}
```

### 2. Server Action Protection

```javascript
// app/workspace/[slug]/actions.js
"use server";

import { protectWorkspaceManagement } from "@/authorization/WorkspaceAuthGuard";

export async function updateWorkspace(workspaceId, data) {
  await protectWorkspaceManagement(workspaceId);

  return await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
}
```

### 3. Conditional UI Rendering

```javascript
// components/ProjectActions.js
import { getSession, hasPermission } from "@/authorization/BaseAuthGuard";

export default async function ProjectActions({ projectId }) {
  const session = await getSession();

  if (!session) return null;

  const canEdit = await hasPermission(session.id, "edit:project", "project", projectId);
  const canDelete = await hasPermission(session.id, "delete:project", "project", projectId);

  return (
    <div>
      {canEdit && <EditButton projectId={projectId} />}
      {canDelete && <DeleteButton projectId={projectId} />}
    </div>
  );
}
```

### 4. Layout Protection

```javascript
// app/(admin)/layout.js
import { protectAdmin } from "@/authorization/AdminAuthGuard";

export default async function AdminLayout({ children }) {
  await protectAdmin();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
```

## Available Functions

### Base Authentication

```javascript
import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";

// Available methods:
// BaseAuthGuard.getSession()           - Get current user session
// BaseAuthGuard.requireAuth()          - Require authentication
// BaseAuthGuard.requireSuperAdmin()    - Require admin privileges
// BaseAuthGuard.hasPermission()        - Check specific permission
// BaseAuthGuard.requirePermission()    - Require specific permission
```

### User Authorization

```javascript
import {
  protectUser, // Basic user protection
  protectUserProfile, // Profile access protection
  protectUserManagement, // User management (admin)
  protectUserUpdate, // User update protection
  protectUserDeletion, // User deletion protection
} from "@/authorization/UserAuthGuard";
```

### Admin Authorization

```javascript
import {
  protectAdmin, // Basic admin protection
  protectAdminUserManagement, // User management
  protectAdminWorkspaceManagement, // Workspace management
  protectAdminSystemSettings, // System settings
  protectAdminAnalytics, // Analytics access
} from "@/authorization/AdminAuthGuard";
```

### Workspace Authorization

```javascript
import {
  protectWorkspace, // Basic workspace protection
  protectWorkspaceBySlug, // Protection by slug
  protectWorkspaceManagement, // Management operations
  protectWorkspaceCreation, // Creation protection
  protectWorkspaceDeletion, // Deletion protection
  protectWorkspaceMemberManagement, // Member management
  protectWorkspaceSettings, // Settings access
} from "@/authorization/WorkspaceAuthGuard";
```

### Project Authorization

```javascript
import {
  protectProjectBySlug, // Protection by slug
  protectProjectById, // Protection by ID
  protectProjectEditor, // Editor access
  protectProjectManagement, // Management operations
  protectProjectCreation, // Creation protection
  protectProjectDeletion, // Deletion protection
  protectProjectMemberManagement, // Member management
} from "@/authorization/ProjectAuthGuard";
```

### Section Authorization

```javascript
import {
  protectSectionById, // Protection by ID
  protectSectionCreation, // Creation protection
  protectSectionUpdate, // Update protection
  protectSectionDeletion, // Deletion protection
  protectSectionList, // List access
} from "@/authorization/SectionAuthGuard";
```

### Page Authorization

```javascript
import {
  protectPageById, // Protection by ID
  protectPageCreation, // Creation protection
  protectPageUpdate, // Update protection
  protectPageDeletion, // Deletion protection
  protectPageSharing, // Sharing operations
  protectPagePublicAccess, // Public access
} from "@/authorization/PageAuthGuard";
```

## Error Handling

The authorization system automatically handles errors:

- **Authentication failures** → Redirects to forbidden page
- **Resource not found** → Redirects to not found page
- **Permission denied** → Redirects to forbidden page

```javascript
// You don't need to handle authorization errors manually
export default async function ProjectPage({ params }) {
  // This will automatically handle all authorization errors
  const { project } = await protectProjectBySlug(params.slug);

  // Only successful authorization reaches this point
  return <ProjectComponent project={project} />;
}
```

## Best Practices

### 1. Always Use Server-Side Authorization

```javascript
// ✅ Good - Server-side authorization
export default async function ProjectPage({ params }) {
  const { project } = await protectProjectBySlug(params.slug);
  return <ProjectComponent project={project} />;
}

// ❌ Bad - Client-side authorization
"use client";
export default function ProjectPage({ params }) {
  const [canAccess, setCanAccess] = useState(false);
  // Client-side checks can be bypassed
}
```

### 2. Use Specific Guards

```javascript
// ✅ Good - Use specific guard methods
const { project } = await protectProjectEditor(projectSlug);

// ❌ Avoid - Generic permission checks
const session = await requireAuth();
const canEdit = await hasPermission(session.id, "edit:project", "project", projectId);
```

### 3. Handle Permissions Early

```javascript
// ✅ Good - Check permissions early
export async function updateProject(projectId, data) {
  await protectProjectUpdate(projectId);
  // Continue with business logic
}

// ❌ Avoid - Check permissions after processing
export async function updateProject(projectId, data) {
  const processedData = await processData(data);
  await protectProjectUpdate(projectId); // Too late
}
```

### 4. Use Appropriate Protection Level

```javascript
// ✅ Good - Use appropriate protection
await protectProjectEditor(slug); // For editing
await protectProjectManagement(id); // For management
await protectProjectDeletion(id); // For deletion

// ❌ Avoid - Over-protection
await protectProjectManagement(id); // For simple viewing
```

## Next Steps

1. **Read the [Integration Guide](integration.md)** - Learn how to integrate authorization throughout your app
2. **Check the [Guards Reference](guards.md)** - Detailed documentation for all guards
3. **Review [Best Practices](best-practices.md)** - Advanced patterns and recommendations
4. **Explore [Examples](examples/)** - Real-world usage examples

## Common Issues

### "use server" Errors

The authorization files use "use server" and only export async functions. Make sure you're importing the exported functions, not classes:

```javascript
// ✅ Correct
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

// ❌ Incorrect
import { ProjectAuthGuard } from "@/authorization/ProjectAuthGuard";
```

### Permission Denied

If you're getting permission denied errors:

1. Check if the user has the required permission
2. Verify the user is a member of the workspace/project
3. Ensure the resource exists and belongs to the correct workspace/project
4. Check if the user is the owner of the resource

### Database Relationships

Make sure your database has the required relationships for the authorization system to work properly. See the [Integration Guide](integration.md) for database schema requirements.
