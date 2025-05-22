# ==================== TEAM-DOCS DOCKERFILE ====================
FROM oven/bun:1.2.14-alpine AS base
WORKDIR /app
COPY package.json bun.lock ./

# ==================== PRISMA GENERATION STAGE ====================
FROM base AS prisma-generated
WORKDIR /app
COPY prisma ./prisma
RUN touch .env

RUN bun install --production
RUN bunx prisma generate

# ==================== DEVELOPMENT STAGE ====================
FROM base AS development
WORKDIR /app

COPY . .

RUN bun install
CMD ["bun", "--bun", "run", "dev"]

# ==================== PRODUCTION STAGE ====================
FROM prisma-generated AS production
WORKDIR /app

COPY --from=prisma-generated /app/node_modules ./node_modules
COPY --from=prisma-generated /app/prisma ./prisma
COPY --from=prisma-generated /app/src/generated ./src/generated

COPY . .

RUN bun install --production
RUN bun run build
CMD ["bun", "--bun", "run", "start", "--", "-p", "3001"]

