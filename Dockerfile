FROM oven/bun:1.2-alpine

WORKDIR /app

COPY package.json bun.lock ./


COPY . .
RUN bun install
RUN bunx prisma generate

CMD bun --bun run dev
