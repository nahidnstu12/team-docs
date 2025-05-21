import { PrismaClient } from "@/generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

/** @type {import('@prisma/client').PrismaClient} */
let prisma;

// Simplified approach: create base client first
const basePrisma = globalForPrisma.prisma || new PrismaClient();

// Apply extensions conditionally
if (process.env.DATABASE_URL?.startsWith("prisma+postgres://") && process.env.OPTIMIZE_API_KEY) {
  // Use both Accelerate and Optimize when both are configured
  prisma = basePrisma.$extends(withAccelerate()).$extends(
    withOptimize({
      apiKey: process.env.OPTIMIZE_API_KEY,
    })
  );
} else if (process.env.DATABASE_URL?.startsWith("prisma+postgres://")) {
  // Use only Accelerate
  prisma = basePrisma.$extends(withAccelerate());
} else if (process.env.OPTIMIZE_API_KEY) {
  // Use only Optimize
  prisma = basePrisma.$extends(
    withOptimize({
      apiKey: process.env.OPTIMIZE_API_KEY,
    })
  );
} else {
  // Use regular Prisma client without extensions
  prisma = basePrisma;
}

// Save client globally in development to prevent re-instantiating during hot reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
