# Authorization System Documentation

## Overview

This directory contains comprehensive documentation for the Laravel-like authorization system implemented for the Next.js application. The system provides role-based access control (RBAC), permission management, resource ownership validation, and fine-grained access control.

## Documentation Structure

### Core Documentation
- **[Getting Started](getting-started.md)** - Quick start guide and basic usage
- **[Architecture](architecture.md)** - System architecture and design patterns
- **[Guards Reference](guards.md)** - Complete reference for all authorization guards
- **[Permissions](permissions.md)** - Permission system and RBAC documentation
- **[Integration Guide](integration.md)** - How to integrate authorization in your code

### Advanced Topics
- **[Best Practices](best-practices.md)** - Authorization best practices and patterns
- **[Performance](performance.md)** - Performance optimization and caching strategies
- **[Security](security.md)** - Security considerations and guidelines
- **[Migration](migration.md)** - Migrating from existing authorization systems

### Examples and Tutorials
- **[Examples](examples/)** - Code examples and usage patterns
- **[Tutorials](tutorials/)** - Step-by-step tutorials
- **[API Reference](api/)** - Complete API documentation

## Quick Start

```javascript
// Basic authentication
import { requireAuth } from "@/authorization/BaseAuthGuard";

export default async function ProtectedPage() {
  const session = await requireAuth();
  return <div>Welcome, {session.username}!</div>;
}

// Resource protection
import { protectProjectBySlug } from "@/authorization/ProjectAuthGuard";

export default async function ProjectPage({ params }) {
  const { project } = await protectProjectBySlug(params.slug);
  return <ProjectComponent project={project} />;
}

// Permission checking
import { hasPermission } from "@/authorization/BaseAuthGuard";

export async function updateProject(projectId, data) {
  const session = await requireAuth();
  const canEdit = await hasPermission(session.id, "edit:project", "project", projectId);
  
  if (!canEdit) {
    throw new Error("Insufficient permissions");
  }
  
  // Update logic here
}
```

## Key Features

### 🔐 Comprehensive Authorization
- **Resource Guards** - Specialized protection for each resource type
- **Permission System** - Fine-grained RBAC with scoped permissions
- **Ownership Validation** - Automatic ownership-based access control
- **Membership Checking** - Workspace and project membership validation

### 🚀 Next.js Optimized
- **Server-Side Only** - All authorization logic runs on the server
- **"use server" Compatible** - Exports only async functions as required
- **Performance Focused** - Efficient database queries and batch operations
- **Error Handling** - Automatic forbidden/not-found responses

### 🛠️ Developer Friendly
- **Laravel-Like API** - Familiar patterns for PHP developers
- **TypeScript Support** - Full type safety with JSDoc annotations
- **Comprehensive Docs** - Detailed documentation with examples
- **Testing Support** - Built-in testing utilities and patterns

### 🔧 Flexible Architecture
- **Class-Based Internal** - Clean internal organization with classes
- **Function Exports** - Server-compatible async function exports
- **Modular Design** - Easy to extend and customize
- **Integration Ready** - Works with existing authentication systems

## System Architecture

```
┌─────────────────────────────────────────┐
│           Server Components             │
│     (Import guard functions)            │
├─────────────────────────────────────────┤
│         Server Actions                  │
│    (Use exported async functions)       │
├─────────────────────────────────────────┤
│      Authorization Guards               │
│   (Internal class organization)         │
├─────────────────────────────────────────┤
│       Permission System                 │
│    (RBAC + Ownership + Direct)          │
├─────────────────────────────────────────┤
│          Database Layer                 │
│    (Users, Roles, Permissions)          │
└─────────────────────────────────────────┘
```

## Available Guards

- **BaseAuthGuard** - Core authentication and permission functions
- **UserAuthGuard** - User management and profile protection
- **AdminAuthGuard** - Administrative operations
- **WorkspaceAuthGuard** - Workspace-level authorization
- **ProjectAuthGuard** - Project-level authorization
- **SectionAuthGuard** - Section-level authorization
- **PageAuthGuard** - Page-level authorization
- **RoleAuthGuard** - Role management
- **PermissionAuthGuard** - Permission management
- **AnnotationAuthGuard** - Annotation operations
- **NotificationAuthGuard** - Notification management
- **InvitationAuthGuard** - Invitation operations

## Permission Hierarchy

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

## Getting Help

1. **Read the Documentation** - Start with the [Getting Started](getting-started.md) guide
2. **Check Examples** - Look at the [Examples](examples/) directory
3. **Review API Reference** - See the [API Reference](api/) for detailed function documentation
4. **Follow Best Practices** - Read the [Best Practices](best-practices.md) guide

## Contributing

When contributing to the authorization system:

1. Follow the established patterns and conventions
2. Add comprehensive JSDoc documentation
3. Include examples in your documentation
4. Test your changes thoroughly
5. Update relevant documentation

## Security Notice

⚠️ **Important**: Authorization is security-critical. Always:

- Run authorization checks on the server side only
- Never trust client-side authorization
- Use the provided guard functions consistently
- Follow the principle of least privilege
- Regularly audit permissions and access patterns

For security-related issues, please follow the security reporting guidelines in the main project documentation.
