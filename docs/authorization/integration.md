# Authorization Integration Guide

## Overview

This guide shows you how to integrate the authorization system into your Next.js application. The system is designed to work seamlessly with server components, server actions, and existing authentication.

## Basic Integration

### 1. Server Components

Use authorization guards to protect server components:

```javascript
// app/workspace/[slug]/page.js
import { protectWorkspaceBySlug } from "@/authorization/WorkspaceAuthGuard";

export default async function WorkspacePage({ params }) {
  // This will automatically handle authentication and authorization
  const { workspace, membership } = await protectWorkspaceBySlug(params.slug);

  return (
    <div>
      <h1>{workspace.name}</h1>
      <p>Your role: {membership.role.name}</p>
    </div>
  );
}
```

### 2. Server Actions

Protect server actions with authorization checks:

```javascript
// app/workspace/[slug]/actions.js
"use server";

import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";
import { protectWorkspaceManagement } from "@/authorization/WorkspaceAuthGuard";

export async function updateWorkspace(workspaceId, data) {
  // Method 1: Use specific guard protection
  const { workspace } = await protectWorkspaceManagement(workspaceId);

  // Update logic here
  return await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
}

export async function createProject(workspaceId, projectData) {
  // Method 2: Manual permission checking
  const session = await BaseAuthGuard.requireAuth();
  const canCreate = await BaseAuthGuard.hasPermission(
    session.id,
    "create:project",
    "workspace",
    workspaceId
  );

  if (!canCreate) {
    throw new Error("Insufficient permissions");
  }

  // Create logic here
  return await prisma.project.create({
    data: { ...projectData, workspaceId, ownerId: session.id },
  });
}
```

### 3. Route Protection

Protect entire route segments using layout files:

```javascript
// app/(admin)/layout.js
import { protectAdmin } from "@/authorization/AdminAuthGuard";

export default async function AdminLayout({ children }) {
  // Protect all admin routes
  await protectAdmin();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 4. Conditional Rendering

Show/hide UI elements based on permissions:

```javascript
// components/ProjectActions.js
import { hasPermission } from "@/authorization/BaseAuthGuard";
import { getSession } from "@/authorization/BaseAuthGuard";

export default async function ProjectActions({ projectId }) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const canEdit = await hasPermission(session.id, "edit:project", "project", projectId);
  const canDelete = await hasPermission(session.id, "delete:project", "project", projectId);
  const canManage = await hasPermission(session.id, "manage:project", "project", projectId);

  return (
    <div className="project-actions">
      {canEdit && <EditProjectButton projectId={projectId} />}
      {canDelete && <DeleteProjectButton projectId={projectId} />}
      {canManage && <ManageProjectButton projectId={projectId} />}
    </div>
  );
}
```

## Advanced Integration Patterns

### 1. Middleware Integration

While authorization logic should be server-side, you can use middleware for basic route protection:

```javascript
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Basic route protection - detailed authorization happens in components
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  // Redirect unauthenticated users from protected routes
  if (isAdminRoute && !request.cookies.get("session")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/workspace/:path*", "/project/:path*"],
};
```

### 2. Error Handling

Handle authorization errors gracefully:

```javascript
// app/project/[slug]/page.js
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }) {
  try {
    const { project, membership } = await protectProjectBySlug(params.slug);

    return <ProjectComponent project={project} membership={membership} />;
  } catch (error) {
    // Authorization guards automatically handle forbidden/not-found
    // This catch is for other errors
    console.error("Project page error:", error);
    throw error;
  }
}
```

### 3. Permission-Based Navigation

Create navigation that adapts to user permissions:

```javascript
// components/Navigation.js
import { getSession, hasPermission } from "@/authorization/BaseAuthGuard";

export default async function Navigation({ workspaceId }) {
  const session = await getSession();

  if (!session) {
    return <GuestNavigation />;
  }

  const canManageWorkspace = await hasPermission(
    session.id,
    "manage:workspace",
    "workspace",
    workspaceId
  );
  const canCreateProject = await hasPermission(
    session.id,
    "create:project",
    "workspace",
    workspaceId
  );
  const canInviteUsers = await hasPermission(session.id, "invite:user", "workspace", workspaceId);

  return (
    <nav>
      <NavLink href={`/workspace/${workspaceId}`}>Dashboard</NavLink>
      <NavLink href={`/workspace/${workspaceId}/projects`}>Projects</NavLink>

      {canCreateProject && (
        <NavLink href={`/workspace/${workspaceId}/projects/new`}>New Project</NavLink>
      )}

      {canInviteUsers && <NavLink href={`/workspace/${workspaceId}/invite`}>Invite Users</NavLink>}

      {canManageWorkspace && (
        <NavLink href={`/workspace/${workspaceId}/settings`}>Settings</NavLink>
      )}
    </nav>
  );
}
```

### 4. Form Protection

Protect form submissions with authorization:

```javascript
// app/project/[id]/edit/page.js
import { protectProjectUpdate } from "@/authorization/ProjectAuthGuard";
import ProjectEditForm from "./ProjectEditForm";

export default async function EditProjectPage({ params }) {
  const { project } = await protectProjectUpdate(params.id);

  return <ProjectEditForm project={project} />;
}

// ProjectEditForm.js (Client Component)
"use client";

import { updateProjectAction } from "./actions";

export default function ProjectEditForm({ project }) {
  return (
    <form action={updateProjectAction}>
      <input type="hidden" name="projectId" value={project.id} />
      <input name="name" defaultValue={project.name} />
      <input name="description" defaultValue={project.description} />
      <button type="submit">Update Project</button>
    </form>
  );
}

// actions.js
"use server";

import { protectProjectUpdate } from "@/authorization/ProjectAuthGuard";

export async function updateProjectAction(formData) {
  const projectId = formData.get("projectId");

  // Verify authorization before processing
  await protectProjectUpdate(projectId);

  const data = {
    name: formData.get("name"),
    description: formData.get("description")
  };

  return await prisma.project.update({
    where: { id: projectId },
    data
  });
}
```

## Integration with Existing Systems

### 1. Session Management

The authorization system works with your existing session management:

```javascript
// lib/Session.js (Your existing session system)
export class Session {
  static async getCurrentUser() {
    // Your existing session logic
    const sessionToken = cookies().get("session")?.value;
    if (!sessionToken) return null;

    return await validateSessionAndGetUser(sessionToken);
  }
}
```

### 2. Database Integration

The system integrates with your existing Prisma schema:

```prisma
// prisma/schema.prisma
model User {
  id           String @id @default(cuid())
  email        String @unique
  username     String @unique
  isSuperAdmin Boolean @default(false)

  // Authorization relationships
  workspaceMembers     WorkspaceMember[]
  projectMembers       ProjectMember[]
  projectPermissions   ProjectUserPermission[]
  ownedWorkspaces      Workspace[]
  ownedProjects        Project[]

  // Your existing fields...
}

model Workspace {
  id      String @id @default(cuid())
  name    String
  slug    String @unique
  ownerId String

  owner   User @relation(fields: [ownerId], references: [id])
  members WorkspaceMember[]

  // Your existing fields...
}
```

### 3. API Route Protection

Protect API routes (though server actions are preferred):

```javascript
// app/api/projects/[id]/route.js
import { requireAuth, hasPermission } from "@/authorization/BaseAuthGuard";

export async function PUT(request, { params }) {
  try {
    const session = await requireAuth();
    const projectId = params.id;

    const canEdit = await hasPermission(session.id, "edit:project", "project", projectId);
    if (!canEdit) {
      return new Response("Forbidden", { status: 403 });
    }

    const data = await request.json();
    const project = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    return Response.json(project);
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

## Migration from Existing Authorization

### 1. Gradual Migration

Replace existing authorization checks gradually:

```javascript
// Before (old system)
export default async function ProjectPage({ params }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { workspace: { include: { members: true } } }
  });

  if (!project) notFound();

  const isMember = project.workspace.members.some(m => m.userId === session.id);
  if (!isMember) forbidden();

  return <ProjectComponent project={project} />;
}

// After (new system)
export default async function ProjectPage({ params }) {
  const { project, membership } = await protectProjectBySlug(params.slug);
  return <ProjectComponent project={project} membership={membership} />;
}
```

### 2. Permission Seeding

Seed your database with default permissions:

```javascript
// scripts/seed-permissions.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPermissions() {
  // Create default permissions
  const permissions = [
    { name: "create:project", scope: "workspace", description: "Can create projects" },
    { name: "edit:project", scope: "project", description: "Can edit project" },
    { name: "delete:project", scope: "project", description: "Can delete project" },
    // ... more permissions
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin", description: "Full access", isSystem: true },
  });

  // Assign permissions to roles
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermissionAssignment.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
}

seedPermissions().catch(console.error);
```

## Testing Integration

Test your authorization integration:

```javascript
// __tests__/authorization-integration.test.js
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

// Mock the session
jest.mock("@/lib/Session", () => ({
  Session: {
    getCurrentUser: jest.fn(),
  },
}));

describe("Authorization Integration", () => {
  it("should protect project access", async () => {
    // Mock authenticated user
    Session.getCurrentUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    // Mock database responses
    // ... setup mocks

    const result = await protectProjectBySlug("test-project");
    expect(result.project).toBeDefined();
    expect(result.membership).toBeDefined();
  });
});
```

This integration guide provides a comprehensive approach to implementing authorization throughout your Next.js application while maintaining security and performance.
