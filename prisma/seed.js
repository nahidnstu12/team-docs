const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

/**
 * Seed script to initialize database with default data
 * Run with: npx prisma db seed
 */
async function main() {
  console.log('🌱 Seeding database...');

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full system access',
      isSystem: true,
    },
  });

  const teamLeadRole = await prisma.role.upsert({
    where: { name: 'team_lead' },
    update: {},
    create: {
      name: 'team_lead',
      description: 'Team leader with project management capabilities',
      isSystem: true,
    },
  });

  const developerRole = await prisma.role.upsert({
    where: { name: 'developer' },
    update: {},
    create: {
      name: 'developer',
      description: 'Developer with restricted access to assigned projects',
      isSystem: true,
    },
  });

  console.log('✅ Created default roles');

  // Create default permissions
  const permissions = [
    // User management permissions
    { name: 'user.create', description: 'Create new users', category: 'user_management' },
    { name: 'user.read', description: 'View user details', category: 'user_management' },
    { name: 'user.update', description: 'Update user details', category: 'user_management' },
    { name: 'user.delete', description: 'Delete users', category: 'user_management' },
    
    // Role management permissions
    { name: 'role.create', description: 'Create new roles', category: 'role_management' },
    { name: 'role.read', description: 'View role details', category: 'role_management' },
    { name: 'role.update', description: 'Update role details', category: 'role_management' },
    { name: 'role.delete', description: 'Delete roles', category: 'role_management' },
    { name: 'role.assign', description: 'Assign roles to users', category: 'role_management' },
    
    // Workspace permissions
    { name: 'workspace.create', description: 'Create new workspaces', category: 'workspace' },
    { name: 'workspace.read', description: 'View workspace details', category: 'workspace' },
    { name: 'workspace.update', description: 'Update workspace details', category: 'workspace' },
    { name: 'workspace.delete', description: 'Delete workspaces', category: 'workspace' },
    { name: 'workspace.manage_admins', description: 'Manage workspace admins', category: 'workspace' },
    
    // Project permissions
    { name: 'project.create', description: 'Create new projects', category: 'project' },
    { name: 'project.read', description: 'View project details', category: 'project' },
    { name: 'project.update', description: 'Update project details', category: 'project' },
    { name: 'project.delete', description: 'Delete projects', category: 'project' },
    { name: 'project.manage_team', description: 'Manage project team members', category: 'project' },
    
    // Section permissions
    { name: 'section.create', description: 'Create new sections', category: 'section' },
    { name: 'section.read', description: 'View section details', category: 'section' },
    { name: 'section.update', description: 'Update section details', category: 'section' },
    { name: 'section.delete', description: 'Delete sections', category: 'section' },
    
    // Page permissions
    { name: 'page.create', description: 'Create new pages', category: 'page' },
    { name: 'page.read', description: 'View page details', category: 'page' },
    { name: 'page.update', description: 'Update page content', category: 'page' },
    { name: 'page.delete', description: 'Delete pages', category: 'page' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  console.log('✅ Created default permissions');

  // Assign all permissions to admin role
  const allPermissions = await prisma.permission.findMany();
  
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { 
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign team lead permissions
  const teamLeadPermissions = await prisma.permission.findMany({
    where: {
      OR: [
        { name: { startsWith: 'project.' } },
        { name: { startsWith: 'section.' } },
        { name: { startsWith: 'page.' } },
        { name: 'user.read' },
      ],
    },
  });

  for (const permission of teamLeadPermissions) {
    await prisma.rolePermission.upsert({
      where: { 
        roleId_permissionId: {
          roleId: teamLeadRole.id,
          permissionId: permission.id,
        }
      },
      update: {},
      create: {
        roleId: teamLeadRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Assign developer permissions
  const developerPermissions = await prisma.permission.findMany({
    where: {
      OR: [
        { name: 'section.read' },
        { name: 'page.read' },
        { name: 'page.create' },
        { name: 'page.update' },
      ],
    },
  });

  for (const permission of developerPermissions) {
    await prisma.rolePermission.upsert({
      where: { 
        roleId_permissionId: {
          roleId: developerRole.id,
          permissionId: permission.id,
        }
      },
      update: {},
      create: {
        roleId: developerRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Assigned permissions to roles');

  // Create default admin user
  const adminPassword = await hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      emailVerified: new Date(),
    },
  });

  // Assign admin role to admin user
  await prisma.userRole.upsert({
    where: { 
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Created admin user with admin role');
  console.log('🎉 Seeding completed successfully!');
  console.log('Admin credentials: admin@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });