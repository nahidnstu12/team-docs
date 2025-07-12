# Basic Authorization Usage Examples

## Server Component Protection

### Basic Authentication

```javascript
// app/dashboard/page.js
import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";

export default async function DashboardPage() {
  const session = await BaseAuthGuard.requireAuth();

  return (
    <div>
      <h1>Welcome, {session.username}!</h1>
      <p>Email: {session.email}</p>
    </div>
  );
}
```

### Admin Protection

```javascript
// app/(admin)/users/page.js
import { protectAdmin } from "@/authorization/AdminAuthGuard";

export default async function AdminUsersPage() {
  await protectAdmin();

  return (
    <div>
      <h1>User Management</h1>
      <UserManagementComponent />
    </div>
  );
}
```

### Workspace Protection

```javascript
// app/workspace/[slug]/page.js
import { protectWorkspaceBySlug } from "@/authorization/WorkspaceAuthGuard";

export default async function WorkspacePage({ params }) {
  const { workspace, membership } = await protectWorkspaceBySlug(params.slug);

  return (
    <div>
      <h1>{workspace.name}</h1>
      <p>Your role: {membership.role.name}</p>
      <WorkspaceContent workspace={workspace} />
    </div>
  );
}
```

### Project Protection

```javascript
// app/project/[slug]/page.js
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

export default async function ProjectPage({ params }) {
  const { project, membership } = await protectProjectBySlug(params.slug);

  return (
    <div>
      <h1>{project.name}</h1>
      <p>Description: {project.description}</p>
      <ProjectContent project={project} membership={membership} />
    </div>
  );
}
```

### Project Editor Protection

```javascript
// app/project/[slug]/edit/page.js
import { protectProjectEditor } from "@/authorization/ProjectAuthGuard";

export default async function ProjectEditorPage({ params }) {
  const { project, membership } = await protectProjectEditor(params.slug);

  return (
    <div>
      <h1>Editing: {project.name}</h1>
      <ProjectEditor project={project} />
    </div>
  );
}
```

## Server Action Protection

### Basic Server Action

```javascript
// app/workspace/[slug]/actions.js
"use server";

import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";
import { protectWorkspaceManagement } from "@/authorization/WorkspaceAuthGuard";

export async function updateWorkspace(workspaceId, data) {
  const { workspace } = await protectWorkspaceManagement(workspaceId);

  return await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function createProject(workspaceId, projectData) {
  const session = await BaseAuthGuard.requireAuth();
  const { workspace } = await protectWorkspaceBySlug(workspaceId);

  return await prisma.project.create({
    data: {
      ...projectData,
      workspaceId,
      ownerId: session.id,
    },
  });
}
```

### Permission-Based Actions

```javascript
// app/project/[slug]/actions.js
"use server";

import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";
import { protectProjectUpdate, protectProjectDeletion } from "@/authorization/ProjectAuthGuard";

export async function updateProject(projectId, data) {
  await protectProjectUpdate(projectId);

  return await prisma.project.update({
    where: { id: projectId },
    data,
  });
}

export async function deleteProject(projectId) {
  const project = await protectProjectDeletion(projectId);

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { success: true, message: `Project ${project.name} deleted` };
}

export async function inviteUserToProject(projectId, email) {
  const session = await BaseAuthGuard.requireAuth();
  const canInvite = await BaseAuthGuard.hasPermission(
    session.id,
    "invite:user",
    "project",
    projectId
  );

  if (!canInvite) {
    throw new Error("You don't have permission to invite users to this project");
  }

  // Create invitation logic here
  return await createInvitation(projectId, email, session.id);
}
```

## Conditional UI Rendering

### Permission-Based Components

```javascript
// components/ProjectActions.js
import { BaseAuthGuard } from "@/authorization/BaseAuthGuard";

export default async function ProjectActions({ projectId }) {
  const session = await BaseAuthGuard.getSession();

  if (!session) {
    return null;
  }

  const [canEdit, canDelete, canManage, canInvite] = await Promise.all([
    BaseAuthGuard.hasPermission(session.id, "edit:project", "project", projectId),
    BaseAuthGuard.hasPermission(session.id, "delete:project", "project", projectId),
    BaseAuthGuard.hasPermission(session.id, "manage:project", "project", projectId),
    BaseAuthGuard.hasPermission(session.id, "invite:user", "project", projectId),
  ]);

  return (
    <div className="project-actions">
      {canEdit && <button className="btn-primary">Edit Project</button>}

      {canDelete && <button className="btn-danger">Delete Project</button>}

      {canManage && <button className="btn-secondary">Project Settings</button>}

      {canInvite && <button className="btn-secondary">Invite Users</button>}
    </div>
  );
}
```

### Navigation Based on Permissions

```javascript
// components/WorkspaceNavigation.js
import { getSession, hasPermission } from "@/authorization/BaseAuthGuard";

export default async function WorkspaceNavigation({ workspaceId }) {
  const session = await getSession();

  if (!session) {
    return <GuestNavigation />;
  }

  const [canCreateProject, canManageWorkspace, canInviteUsers] = await Promise.all([
    hasPermission(session.id, "create:project", "workspace", workspaceId),
    hasPermission(session.id, "manage:workspace", "workspace", workspaceId),
    hasPermission(session.id, "invite:user", "workspace", workspaceId),
  ]);

  return (
    <nav className="workspace-nav">
      <a href={`/workspace/${workspaceId}`}>Dashboard</a>
      <a href={`/workspace/${workspaceId}/projects`}>Projects</a>

      {canCreateProject && <a href={`/workspace/${workspaceId}/projects/new`}>New Project</a>}

      {canInviteUsers && <a href={`/workspace/${workspaceId}/invite`}>Invite Users</a>}

      {canManageWorkspace && <a href={`/workspace/${workspaceId}/settings`}>Settings</a>}
    </nav>
  );
}
```

## Layout Protection

### Admin Layout

```javascript
// app/(admin)/layout.js
import { protectAdmin } from "@/authorization/AdminAuthGuard";

export default async function AdminLayout({ children }) {
  await protectAdmin();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
```

### Workspace Layout

```javascript
// app/workspace/[slug]/layout.js
import { protectWorkspaceBySlug } from "@/authorization/WorkspaceAuthGuard";

export default async function WorkspaceLayout({ children, params }) {
  const { workspace, membership } = await protectWorkspaceBySlug(params.slug);

  return (
    <div className="workspace-layout">
      <WorkspaceSidebar workspace={workspace} membership={membership} />
      <main className="workspace-content">{children}</main>
    </div>
  );
}
```

## Form Protection

### Protected Form Component

```javascript
// app/project/[id]/edit/page.js
import { protectProjectUpdate } from "@/authorization/ProjectAuthGuard";
import ProjectEditForm from "./ProjectEditForm";

export default async function EditProjectPage({ params }) {
  const { project } = await protectProjectUpdate(params.id);

  return (
    <div>
      <h1>Edit Project: {project.name}</h1>
      <ProjectEditForm project={project} />
    </div>
  );
}
```

### Form with Server Action

```javascript
// ProjectEditForm.js (Client Component)
"use client";

import { updateProjectAction } from "./actions";

export default function ProjectEditForm({ project }) {
  return (
    <form action={updateProjectAction}>
      <input type="hidden" name="projectId" value={project.id} />

      <div>
        <label htmlFor="name">Project Name</label>
        <input id="name" name="name" defaultValue={project.name} required />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" defaultValue={project.description} />
      </div>

      <button type="submit">Update Project</button>
    </form>
  );
}

// actions.js
("use server");

import { protectProjectUpdate } from "@/authorization/ProjectAuthGuard";

export async function updateProjectAction(formData) {
  const projectId = formData.get("projectId");

  // Verify authorization before processing
  await protectProjectUpdate(projectId);

  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  return await prisma.project.update({
    where: { id: projectId },
    data,
  });
}
```

## Error Handling

### Automatic Error Handling

```javascript
// The authorization guards automatically handle errors
export default async function ProjectPage({ params }) {
  // If user lacks access, this will automatically:
  // - Redirect to forbidden page (403)
  // - Redirect to not found page (404) if project doesn't exist
  // - Log the authorization attempt
  const { project } = await protectProjectBySlug(params.slug);

  // Only successful authorization reaches this point
  return <ProjectComponent project={project} />;
}
```

### Custom Error Handling

```javascript
// Only handle non-authorization errors
export default async function ProjectPage({ params }) {
  try {
    const { project } = await protectProjectBySlug(params.slug);
    return <ProjectComponent project={project} />;
  } catch (error) {
    // Authorization errors are already handled by guards
    // This catch is for other types of errors (database, etc.)
    console.error("Unexpected error:", error);
    return <ErrorComponent message="Something went wrong" />;
  }
}
```

These examples show the most common patterns for using the authorization system in your Next.js application.
