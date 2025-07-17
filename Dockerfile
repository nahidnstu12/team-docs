# ==================== TEAM-DOCS DOCKERFILE ====================
FROM oven/bun:1.2.14 AS base
WORKDIR /app
COPY package.json bun.lock ./

# ==================== DEPENDENCIES STAGE ====================
FROM base AS dependencies
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install all dependencies (including dev dependencies)
RUN bun install

# ==================== PRISMA GENERATION STAGE ====================
FROM dependencies AS prisma-generated
WORKDIR /app

# Copy prisma schema
COPY prisma ./prisma

# Create a dummy .env file for Prisma generation
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env

# First, generate to custom location as specified in schema
RUN bunx prisma generate

# Then create a copy/symlink of the generated client to the default location
RUN mkdir -p node_modules/.prisma
RUN cp -r src/generated/client node_modules/.prisma/client

# Verify both locations exist
RUN ls -la node_modules/.prisma/client/ || echo "Default client not found"
RUN ls -la src/generated/client/ || echo "Custom client not found"

# ==================== DEVELOPMENT STAGE ====================
FROM base AS development
WORKDIR /app

COPY . .

RUN bun install
CMD ["bun", "--bun", "run", "dev"]

# ==================== BUILD STAGE ====================
FROM prisma-generated AS builder
WORKDIR /app

# Copy application source code
COPY . .

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy both Prisma client locations from prisma-generated stage
COPY --from=prisma-generated /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma-generated /app/src/generated ./src/generated

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy

# Build the application
RUN bun run build

# ==================== PRODUCTION STAGE ====================
FROM base AS production
WORKDIR /app

# Copy package files for production install
COPY package.json bun.lock ./

# Install only production dependencies
RUN bun install --production

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create dummy .env for Prisma generation
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env

# Generate Prisma client to custom location
RUN bunx prisma generate

# Copy the generated client to the default location for @auth/prisma-adapter
RUN mkdir -p node_modules/.prisma
RUN cp -r src/generated/client node_modules/.prisma/client

# Verify both clients exist
RUN ls -la node_modules/.prisma/client/ || echo "Default client not found in production"
RUN ls -la src/generated/client/ || echo "Custom client not found in production"

CMD ["bun", "--bun", "run", "start", "--", "-p", "3001"]

