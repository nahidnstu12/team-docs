import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding 500 Workspaces...");

	const workspaceData = Array.from({ length: 500 }).map((_, idx) => {
		const name = `workspace - ${idx}`;
		const slug = faker.helpers.slugify(name.toLowerCase());

		return {
			name,
			slug: `${slug}-${faker.string.alphanumeric(6).toLowerCase()}`,
			description: faker.company.catchPhrase(),
			isActive: faker.datatype.boolean(),
		};
	});

	await prisma.workspace.createMany({
		data: workspaceData,
		skipDuplicates: true,
	});

	console.log("✅ Seed completed.");
}

main()
	.catch((err) => {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
