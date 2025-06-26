import { PrismaClient } from "@/generated/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding process...");

  // Drop all existing data
  console.log("🗑️  Cleaning up existing data...");
  await prisma.$transaction([
    prisma.projectUserPermission.deleteMany(),
    prisma.projectMember.deleteMany(),
    prisma.workspaceMember.deleteMany(),
    prisma.pageVersion.deleteMany(),
    prisma.pageShare.deleteMany(),
    prisma.annotation.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.page.deleteMany(),
    prisma.section.deleteMany(),
    prisma.project.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.rolePermissionAssignment.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("✅ Cleaned up existing data");

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: "$2b$10$hUcMcpVXVcctBXX9o18BOeWN7dylk6NtDWaXwE6Z4u6Ye8WzAb9jy",
      isActive: true,
      isSuperAdmin: false,
    },
  });

  // 1. Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      description: "A demo workspace for testing",
      ownerId: adminUser.id,
    },
  });
  console.log("✅ Created workspace");

  // assign workspace to admin user
  await prisma.user.update({
    where: {
      id: adminUser.id,
    },
    data: {
      workspaceId: workspace.id,
    },
  });

  // console.log("✅ Assigned workspace to admin user");

  // 2. Create two projects
  await Promise.all([
    prisma.project.create({
      data: {
        name: "School Demo",
        slug: "school-demo",
        description: "School demo project",
        workspaceId: workspace.id,
        ownerId: adminUser.id,
      },
    }),
    prisma.project.create({
      data: {
        name: "Radius Directory",
        slug: "radius-directory",
        description: "Radius directory project",
        workspaceId: workspace.id,
        ownerId: adminUser.id,
      },
    }),
  ]);

  console.log("✅ Created projects");

  // 3. Create specific user with workspace assignment
  await prisma.user.create({
    data: {
      username: "user1",
      email: "user1@example.com",
      password: "$2b$10$hUcMcpVXVcctBXX9o18BOeWN7dylk6NtDWaXwE6Z4u6Ye8WzAb9jy",
      isActive: true,
      isSuperAdmin: false,
      workspaceId: workspace.id,
    },
  });

  console.log("✅ Created specific user");

  // 4. Create 9 more users
  await Promise.all(
    Array.from({ length: 9 }).map(() =>
      prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: "$2b$10$hUcMcpVXVcctBXX9o18BOeWN7dylk6NtDWaXwE6Z4u6Ye8WzAb9jy",
          isActive: true,
          isSuperAdmin: false,
          workspaceId: workspace.id,
        },
      })
    )
  );

  console.log("✅ Created 9 additional users");

  // 5. Create project-scoped permissions
  const projectPermissions = [
    // School Demo Project Permissions
    {
      name: "create:page",
      description: "Create a page",
      scope: "school-demo",
    },
    {
      name: "read:page",
      description: "Read a page",
      scope: "school-demo",
    },
    {
      name: "update:page",
      description: "Update a page",
      scope: "school-demo",
    },
    {
      name: "delete:page",
      description: "Delete a page",
      scope: "school-demo",
    },
    // Radius Directory Project Permissions
    {
      name: "create:page",
      description: "Create a page",
      scope: "radius-directory",
    },
    {
      name: "read:page",
      description: "Read a page",
      scope: "radius-directory",
    },
    {
      name: "update:page",
      description: "Update a page",
      scope: "radius-directory",
    },
    {
      name: "delete:page",
      description: "Delete a page",
      scope: "radius-directory",
    },
  ];

  await prisma.permission.createMany({
    data: projectPermissions,
    skipDuplicates: true,
  });

  console.log("✅ Created project-scoped permissions");

  // 6. Create system roles
  const systemRoles = [
    {
      name: "Admin",
      description: "Full access to all settings and data",
      isSystem: true,
    },
    {
      name: "Developer",
      description: "Can access and modify development resources",
      isSystem: true,
    },
    {
      name: "Viewer",
      description: "Can view data but cannot make changes",
      isSystem: true,
    },
    {
      name: "Project Manager",
      description: "Manages project timelines and members",
      isSystem: true,
    },
    {
      name: "Support",
      description: "Handles user queries and support tickets",
      isSystem: true,
    },
  ];

  await prisma.role.createMany({
    data: systemRoles,
    skipDuplicates: true,
  });

  console.log("✅ Created system roles");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
