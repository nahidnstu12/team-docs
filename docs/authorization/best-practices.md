# Authorization Best Practices

## Core Principles

### 1. Server-Side Only Authorization

**Always perform authorization on the server side.** Client-side authorization can be bypassed and should never be trusted for security.

```javascript
// ✅ Good - Server-side authorization
export default async function ProjectPage({ params }) {
  const { project } = await protectProjectBySlug(params.slug);
  return <ProjectComponent project={project} />;
}

// ❌ Bad - Client-side authorization
"use client";
export default function ProjectPage() {
  const [canAccess, setCanAccess] = useState(false);
  // This can be bypassed by users
}
```

### 2. Fail Secure by Default

The authorization system fails securely - if there's any doubt about permissions, access is denied.

```javascript
// The system automatically denies access if:
// - User is not authenticated
// - User lacks required permissions
// - Resource doesn't exist
// - Database query fails
```

### 3. Principle of Least Privilege

Grant users the minimum permissions necessary to perform their tasks.

```javascript
// ✅ Good - Specific permissions
"edit:page"           // Can edit pages
"create:section"      // Can create sections

// ❌ Avoid - Overly broad permissions
"manage:everything"   // Too broad
"admin:all"          // Too powerful
```

## Guard Usage Patterns

### 1. Use Specific Guard Methods

Choose the most specific guard method for your use case:

```javascript
// ✅ Good - Specific protection levels
await protectProjectEditor(slug);        // For editing operations
await protectProjectManagement(id);      // For management operations
await protectProjectDeletion(id);        // For deletion operations
await protectProjectBySlug(slug);        // For general access

// ❌ Avoid - Using overly permissive guards
await protectProjectManagement(id);      // For simple viewing
```

### 2. Early Authorization Checks

Perform authorization checks as early as possible in your functions:

```javascript
// ✅ Good - Check authorization first
export async function updateProject(projectId, data) {
  await protectProjectUpdate(projectId);
  
  // Expensive operations after authorization
  const processedData = await processComplexData(data);
  return await updateDatabase(projectId, processedData);
}

// ❌ Avoid - Late authorization checks
export async function updateProject(projectId, data) {
  const processedData = await processComplexData(data);
  await protectProjectUpdate(projectId); // Too late, resources wasted
  return await updateDatabase(projectId, processedData);
}
```

### 3. Consistent Error Handling

Let the authorization guards handle errors automatically:

```javascript
// ✅ Good - Let guards handle authorization errors
export default async function ProjectPage({ params }) {
  const { project } = await protectProjectBySlug(params.slug);
  return <ProjectComponent project={project} />;
}

// ❌ Avoid - Manual error handling for authorization
export default async function ProjectPage({ params }) {
  try {
    const { project } = await protectProjectBySlug(params.slug);
    return <ProjectComponent project={project} />;
  } catch (error) {
    if (error.message === 'Forbidden') {
      return <div>Access denied</div>; // Guards handle this automatically
    }
  }
}
```

## Permission Design

### 1. Granular Permissions

Design permissions to be specific and granular:

```javascript
// ✅ Good - Granular permissions
"create:project"      // Can create projects
"edit:project"        // Can edit project content
"manage:project"      // Can manage project settings
"delete:project"      // Can delete projects
"invite:user"         // Can invite users

// ❌ Avoid - Overly broad permissions
"project:all"         // Too broad
"full:access"         // Not specific enough
```

### 2. Logical Permission Hierarchy

Organize permissions in a logical hierarchy:

```javascript
// System level (highest)
"manage:system"
"view:analytics"

// Workspace level
"manage:workspace"
"create:project"
"invite:user"

// Project level
"manage:project"
"edit:project"
"create:section"

// Resource level (most specific)
"edit:page"
"delete:section"
```

### 3. Ownership-Based Permissions

Leverage automatic ownership permissions:

```javascript
// Owners automatically get these permissions:
// Workspace owners: manage:workspace, delete:workspace, invite:user
// Project owners: manage:project, delete:project, edit:project
// Page owners: edit:page, delete:page

// Design your permissions to work with ownership
const canEdit = await hasPermission(userId, "edit:project", "project", projectId);
// This checks both explicit permissions AND ownership
```

## Performance Optimization

### 1. Batch Permission Checks

When checking multiple permissions, use batch operations:

```javascript
// ✅ Good - Batch permission checks
const permissions = await Promise.all([
  hasPermission(userId, "edit:project", "project", projectId),
  hasPermission(userId, "create:section", "project", projectId),
  hasPermission(userId, "invite:user", "workspace", workspaceId)
]);

const [canEdit, canCreateSection, canInvite] = permissions;

// ❌ Avoid - Sequential permission checks
const canEdit = await hasPermission(userId, "edit:project", "project", projectId);
const canCreateSection = await hasPermission(userId, "create:section", "project", projectId);
const canInvite = await hasPermission(userId, "invite:user", "workspace", workspaceId);
```

### 2. Cache Permission Results

For frequently checked permissions, consider caching:

```javascript
// Cache permissions for the duration of a request
const userPermissions = new Map();

async function getCachedPermission(userId, permission, scope, resourceId) {
  const key = `${userId}:${permission}:${scope}:${resourceId}`;
  
  if (userPermissions.has(key)) {
    return userPermissions.get(key);
  }
  
  const result = await hasPermission(userId, permission, scope, resourceId);
  userPermissions.set(key, result);
  return result;
}
```

### 3. Efficient Database Queries

The guards are designed for efficiency, but you can optimize further:

```javascript
// ✅ Good - Use guard methods that include necessary data
const { project, membership } = await protectProjectBySlug(slug);
// This includes membership data you might need

// ❌ Avoid - Multiple separate queries
const { project } = await protectProjectBySlug(slug);
const membership = await getProjectMembership(userId, project.id); // Extra query
```

## Security Best Practices

### 1. Input Validation

Always validate inputs before authorization checks:

```javascript
// ✅ Good - Validate inputs
export async function updateProject(projectId, data) {
  if (!projectId || typeof projectId !== 'string') {
    throw new Error('Invalid project ID');
  }
  
  await protectProjectUpdate(projectId);
  // Continue with validated data
}

// ❌ Avoid - No input validation
export async function updateProject(projectId, data) {
  await protectProjectUpdate(projectId); // Could fail with invalid input
}
```

### 2. Audit Logging

Log important authorization events:

```javascript
// The system automatically logs authorization failures
// You can add additional logging for successful operations
export async function deleteProject(projectId) {
  const { project } = await protectProjectDeletion(projectId);
  
  Logger.info(`Project ${project.name} deleted by user ${session.id}`);
  
  return await prisma.project.delete({
    where: { id: projectId }
  });
}
```

### 3. Regular Permission Reviews

Regularly review and audit permissions:

```javascript
// Create scripts to audit permissions
async function auditUserPermissions(userId) {
  const workspaces = await getUserWorkspaces(userId);
  const projects = await getUserProjects(userId);
  
  for (const workspace of workspaces) {
    const permissions = await getUserPermissions(userId, "workspace", workspace.id);
    console.log(`User ${userId} in workspace ${workspace.name}:`, permissions);
  }
}
```

## Common Patterns

### 1. Conditional UI Rendering

Show/hide UI elements based on permissions:

```javascript
// ✅ Good - Server-side conditional rendering
export default async function ProjectActions({ projectId }) {
  const session = await getSession();
  if (!session) return null;
  
  const [canEdit, canDelete, canManage] = await Promise.all([
    hasPermission(session.id, "edit:project", "project", projectId),
    hasPermission(session.id, "delete:project", "project", projectId),
    hasPermission(session.id, "manage:project", "project", projectId)
  ]);
  
  return (
    <div>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
      {canManage && <ManageButton />}
    </div>
  );
}
```

### 2. Progressive Enhancement

Start with basic protection and add more specific checks:

```javascript
// Level 1: Basic authentication
const session = await requireAuth();

// Level 2: Resource access
const { project } = await protectProjectBySlug(slug);

// Level 3: Specific operation
const canEdit = await hasPermission(session.id, "edit:project", "project", project.id);
```

### 3. Graceful Degradation

Provide appropriate fallbacks when permissions are insufficient:

```javascript
export default async function ProjectPage({ params }) {
  const session = await getSession();
  
  if (!session) {
    return <LoginPrompt />;
  }
  
  try {
    const { project } = await protectProjectBySlug(params.slug);
    return <ProjectComponent project={project} />;
  } catch (error) {
    // Authorization guards handle forbidden/not-found automatically
    // This is for other types of errors
    return <ErrorComponent error={error} />;
  }
}
```

## Testing Authorization

### 1. Test Authorization Logic

Write tests for your authorization logic:

```javascript
describe('Project Authorization', () => {
  it('should allow project owner to edit', async () => {
    const { project } = await protectProjectUpdate(projectId);
    expect(project).toBeDefined();
  });
  
  it('should deny non-member access', async () => {
    await expect(protectProjectBySlug(slug)).rejects.toThrow();
  });
});
```

### 2. Test Permission Combinations

Test various permission combinations:

```javascript
describe('Permission Combinations', () => {
  it('should allow workspace owner to manage projects', async () => {
    const canManage = await hasPermission(workspaceOwnerId, "manage:project", "project", projectId);
    expect(canManage).toBe(true);
  });
  
  it('should deny regular member from deleting workspace', async () => {
    const canDelete = await hasPermission(memberId, "delete:workspace", "workspace", workspaceId);
    expect(canDelete).toBe(false);
  });
});
```

## Migration Strategies

### 1. Gradual Migration

Migrate from existing authorization systems gradually:

```javascript
// Phase 1: Add new authorization alongside existing
export default async function ProjectPage({ params }) {
  // Old authorization (keep temporarily)
  await checkOldProjectAccess(params.slug);
  
  // New authorization (add)
  const { project } = await protectProjectBySlug(params.slug);
  
  return <ProjectComponent project={project} />;
}

// Phase 2: Remove old authorization
export default async function ProjectPage({ params }) {
  const { project } = await protectProjectBySlug(params.slug);
  return <ProjectComponent project={project} />;
}
```

### 2. Feature Flags

Use feature flags to control authorization rollout:

```javascript
export default async function ProjectPage({ params }) {
  if (process.env.USE_NEW_AUTH === 'true') {
    const { project } = await protectProjectBySlug(params.slug);
    return <ProjectComponent project={project} />;
  } else {
    // Fallback to old authorization
    return <OldProjectComponent slug={params.slug} />;
  }
}
```

## Monitoring and Debugging

### 1. Authorization Metrics

Monitor authorization patterns:

```javascript
// Track authorization failures
Logger.warn('Authorization failed', {
  userId,
  resource: 'project',
  resourceId,
  permission: 'edit:project',
  timestamp: new Date()
});

// Track permission usage
Logger.info('Permission granted', {
  userId,
  permission: 'create:project',
  scope: 'workspace',
  resourceId: workspaceId
});
```

### 2. Debug Authorization Issues

When debugging authorization issues:

1. Check if the user is authenticated
2. Verify workspace/project membership
3. Check specific permissions
4. Verify resource ownership
5. Check database relationships

```javascript
// Debug helper function
async function debugUserAccess(userId, resourceType, resourceId) {
  const session = await getSession();
  console.log('Session:', session);
  
  if (resourceType === 'project') {
    const membership = await getProjectMembership(userId, resourceId);
    console.log('Project membership:', membership);
    
    const permissions = await getUserPermissions(userId, 'project', resourceId);
    console.log('Project permissions:', permissions);
  }
}
```

Following these best practices will help you build a secure, performant, and maintainable authorization system.
