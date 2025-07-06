# 🔌 Team-Docs API Documentation

## Overview

Team-Docs uses Next.js Server Actions as the primary API layer, providing type-safe, server-side functions that can be called directly from React components. This approach eliminates the need for traditional REST API endpoints while maintaining security and performance.

## API Architecture

### Server Actions Pattern

Instead of traditional REST APIs, Team-Docs uses Next.js Server Actions:

```javascript
// Traditional API approach (not used)
fetch('/api/projects', { method: 'POST', body: JSON.stringify(data) })

// Server Actions approach (used in Team-Docs)
import { createProject } from './actions/projectActions';
const result = await createProject(formData);
```

### Benefits of Server Actions

1. **Type Safety**: Full TypeScript support
2. **Security**: Server-side execution with automatic CSRF protection
3. **Performance**: Reduced client-side JavaScript
4. **Developer Experience**: Direct function calls from components
5. **Form Integration**: Native form handling with progressive enhancement

## Authentication API

### Session Management

#### getCurrentUser()
```javascript
// Location: src/system/Services/Session.js
export class Session {
  static async getCurrentUser() {
    const session = await auth();
    return session?.user || null;
  }
}
```

#### isAuthenticated()
```javascript
static async isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}
```

#### getWorkspaceIdForUser()
```javascript
static async getWorkspaceIdForUser() {
  const session = await auth();
  return session?.user?.workspaceId || null;
}
```

### Authentication Actions

#### Sign In Action
```javascript
// Location: src/app/(auth)/auth/signin/signinAction.js
export async function signin(prevState, formData) {
  // Validate credentials
  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      type: "error",
      message: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Authenticate user
  await signIn("credentials", {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    redirectTo: "/home",
  });
}
```

## Search API

### Search Actions

#### searchAction()
```javascript
// Location: src/app/(home)/search/actions/searchAction.js
export async function searchAction(query, options = {}) {
  try {
    // Input validation
    if (!query || typeof query !== "string") {
      return { success: true, data: [], message: "Empty query" };
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return { success: true, data: [], message: "Query too short" };
    }

    // Get workspace context
    const workspaceId = await Session.getWorkspaceIdForUser();
    if (!workspaceId) {
      return { success: false, data: [], error: "No workspace found" };
    }

    // Perform search
    const { limit = 20 } = options;
    const searchResults = await SearchService.searchAll(trimmedQuery, workspaceId, limit);

    // Format results
    const formattedResults = searchResults.map((result) => ({
      id: result.id,
      type: result.type,
      title: result.title,
      description: result.description,
      matchedText: result.matchedText,
      route: result.route,
      metadata: result.metadata,
      displayType: getDisplayType(result.type),
      displayTitle: getDisplayTitle(result),
      displaySubtitle: getDisplaySubtitle(result),
    }));

    return {
      success: true,
      data: formattedResults,
      total: formattedResults.length,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: "Search failed. Please try again.",
    };
  }
}
```

### Search Service Methods

#### SearchService.searchAll()
```javascript
// Location: src/system/Services/SearchService.js
static async searchAll(query, workspaceId, limit = 20) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const searchTerm = query.trim();
    const results = [];

    // Parallel search execution
    const [projectResults, sectionResults, pageResults] = await Promise.all([
      this.searchProjects(searchTerm, workspaceId),
      this.searchSections(searchTerm, workspaceId),
      this.searchPages(searchTerm, workspaceId)
    ]);

    results.push(...projectResults, ...sectionResults, ...pageResults);

    // Apply ranking and sorting
    return results
      .sort((a, b) => {
        // Exact matches first
        const aExactMatch = a.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const bExactMatch = b.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Type priority
        const typePriority = { project: 1, section: 2, page: 3 };
        return typePriority[a.type] - typePriority[b.type];
      })
      .slice(0, limit);
  } catch (error) {
    return [];
  }
}
```

## Project API

### Project Service Methods

#### getResource()
```javascript
// Location: src/system/Services/ProjectServices.js
export class ProjectService extends BaseService {
  static modelName = "project";
  static dto = ProjectDTO;

  static async getResource({ id, slug }) {
    if (!id && !slug) return false;

    try {
      const whereConditions = [];
      if (id) whereConditions.push({ id });
      if (slug) whereConditions.push({ slug });

      const project = await ProjectModel.findFirst({
        where: { OR: whereConditions },
      });

      return ProjectDTO.toResponse(project);
    } catch (error) {
      Logger.error(error.message, "project fetch fail");
      return null;
    }
  }
}
```

### Project Actions

#### createProject()
```javascript
// Example project creation action
export async function createProject(formData) {
  try {
    // Validate user permissions
    const session = await Session.getCurrentUser();
    if (!session) {
      return { success: false, error: "Authentication required" };
    }

    // Validate input data
    const validatedData = projectSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      slug: formData.get("slug"),
    });

    // Create project
    const project = await ProjectService.create({
      ...validatedData,
      workspaceId: session.workspaceId,
      ownerId: session.id,
    });

    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## User Management API

### User Service Methods

#### getUsersNotInProject()
```javascript
// Location: src/system/Services/UserServices.js
export class UserServices extends BaseService {
  static async getUsersNotInProject(projectId) {
    if (!projectId) throw new Error("projectId is missing");

    try {
      const users = await UserModel.findMany({
        where: {
          NOT: {
            projectPermissions: {
              some: { projectId: projectId },
            },
          },
          isSuperAdmin: false,
        },
        select: {
          id: true,
          username: true,
          email: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return users;
    } catch (error) {
      Logger.error(error.message, "Get user list for project failed");
      return [];
    }
  }
}
```

## Permission API

### Permission Service Methods

#### getPermissionForProjectScope()
```javascript
// Location: src/system/Services/PermissionServices.js
export class PermissionServices extends BaseService {
  static async getPermissionForProjectScope(projectScope) {
    try {
      const permissions = await PermissionModel.findMany({
        where: { scope: projectScope },
      });
      return permissions;
    } catch (error) {
      Logger.error(error.message, "Get permission for project scope failed");
      return [];
    }
  }
}
```

## Base Service API

### BaseService Methods

All services extend BaseService, providing common functionality:

```javascript
// Location: src/system/Services/BaseService.js
export class BaseService {
  static get model() {
    if (!this.modelName) throw new Error("modelName not defined in child class");
    return prisma[this.modelName];
  }

  static async hasResource({ where }) {
    try {
      const hasResource = await this.model.findFirst({ where });
      return !!hasResource;
    } catch (error) {
      Logger.error(error.message, "failed hasResource on BaseService");
      return false;
    }
  }

  static async getResource({ where, include = {} }) {
    try {
      const resource = await this.model.findUnique({ where, include });
      
      if (this.dto && typeof this.dto.toResponse === "function") {
        return this.dto.toResponse(resource);
      }
      return resource;
    } catch (error) {
      Logger.error(error.message, "failed getResource on BaseService");
      return null;
    }
  }
}
```

## Error Handling

### Standard Error Response Format

```javascript
// Success response
{
  success: true,
  data: [...], // Response data
  message?: string // Optional success message
}

// Error response
{
  success: false,
  error: string, // Error message
  errors?: object // Validation errors (for forms)
}
```

### Error Handling Patterns

```javascript
// Service-level error handling
try {
  const result = await SomeService.performOperation();
  return { success: true, data: result };
} catch (error) {
  Logger.error(error.message, "Operation failed");
  return { success: false, error: "Operation failed. Please try again." };
}
```

## Data Transfer Objects (DTOs)

### DTO Pattern

DTOs provide consistent data formatting across the API:

```javascript
export class ProjectDTO {
  static toResponse(project) {
    if (!project) return null;
    
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      icon: project.icon,
      color: project.color,
      isArchived: project.isArchived,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      // Computed fields
      memberCount: project.members?.length || 0,
      sectionCount: project.sections?.length || 0,
    };
  }

  static fromRequest(data) {
    // Validate and transform request data
    return {
      name: data.name?.trim(),
      slug: data.slug?.toLowerCase().replace(/\s+/g, '-'),
      description: data.description?.trim() || null,
      icon: data.icon || null,
      color: data.color || null,
    };
  }
}
```

## Security Considerations

### Input Validation

All API functions use Zod schemas for input validation:

```javascript
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
});
```

### Authorization Checks

```javascript
// Check user permissions before operations
const hasPermission = await PermissionService.checkUserPermission({
  userId: session.user.id,
  resource: 'project',
  action: 'create',
  workspaceId: session.user.workspaceId
});

if (!hasPermission) {
  return { success: false, error: "Insufficient permissions" };
}
```

### Workspace Scoping

All operations are automatically scoped to the user's workspace:

```javascript
// Automatic workspace scoping in queries
const projects = await prisma.project.findMany({
  where: {
    workspaceId: session.user.workspaceId, // Always include workspace filter
    // ... other conditions
  }
});
```

---

*This API documentation covers the current server action implementation. For specific usage examples and integration patterns, refer to the component implementations throughout the codebase.*
