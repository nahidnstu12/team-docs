# ==================== TEAM-DOCS DOCKERFILE ====================

# Base stage with Bun - defines the foundation image for all stages
# Using alpine for smaller image size
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

# Copy package files for dependency definition
COPY package.json bun.lock ./

# ==================== PRISMA GENERATION STAGE ====================
# This stage handles the slow Prisma client generation process separately
# Key optimization: generate Prisma client once and reuse in production
FROM oven/bun:1.2-alpine AS prisma-generate
WORKDIR /app
# Only copy the files needed to generate Prisma Client
COPY package.json bun.lock ./
COPY prisma ./prisma
# Create a dummy .env file for Prisma generation
RUN touch .env
# Install production dependencies and generate Prisma client
# This step is expensive but isolated to this container layer
RUN bun install --production
RUN bunx prisma generate


# ==================== DEVELOPMENT STAGE ====================
# This stage is used for local development with your existing node_modules
FROM oven/bun:1.2-alpine AS development
WORKDIR /app

# Copy all project files INCLUDING node_modules from local machine
# This avoids slow installation within container for better developer experience
COPY . .

# Set environment variables (will be overridden by docker-compose)
ENV NODE_ENV=development
ENV DATABASE_URL=postgresql://mazumder:1234@team-docs-postgres:5432/team-docs?schema=public

# Start dev server
CMD ["bun", "--bun", "run", "dev"]

# ==================== PRODUCTION STAGE ====================
# This stage builds the final production application
FROM oven/bun:1.2-alpine AS production
WORKDIR /app

# Copy all necessary project files INCLUDING node_modules
# Using local node_modules speeds up container build with slow connections
COPY . .

# Set environment variables (will be overridden by docker-compose)
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://mazumder:1234@team-docs-postgres:5432/team-docs?schema=public

# Copy the pre-generated Prisma client from previous stage
# This prevents having to regenerate in the production build
COPY --from=prisma-generate /app /app

# Build the application
RUN bun run build

# Start production server on port 3001
# The -- separator passes the -p flag to Next.js rather than to bun
CMD ["bun", "--bun", "run", "start", "--", "-p", "3001"]

