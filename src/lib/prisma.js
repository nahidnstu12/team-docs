import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

// Initialize Prisma client with Accelerate extension
const prisma =
	globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

// Save client globally in development to prevent re-instantiating during hot reload
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
