import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding Roles...");

	// 1. System predefined roles
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
		skipDuplicates: true, // In case the role already exists
	});

	console.log(`✅ Seeded ${systemRoles.length} system roles`);

	// 2. Generate 50 random roles
	const randomRoles = Array.from({ length: 50 }).map(() => ({
		name: faker.person.jobTitle() + " " + faker.string.alpha(3), // to ensure uniqueness
		description: faker.lorem.sentence(),
		isSystem: false,
	}));

	await prisma.role.createMany({
		data: randomRoles,
		skipDuplicates: true, // avoid duplicate names
	});

	console.log(`✅ Seeded ${randomRoles.length} random roles`);
}

main()
	.catch((err) => {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
