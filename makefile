# Run dev migration with timestamp
migrate:
	docker compose exec team-docs-local bunx prisma migrate dev

# Push schema directly to DB
push:
	docker compose exec team-docs-local bunx prisma db push

# Generate Prisma client
local_generate:
	docker compose exec team-docs-local bunx prisma generate

# Reset DB (DANGEROUS)
reset:
	docker compose exec team-docs-local bunx prisma migrate reset --force --skip-seed

# Seed DB
seed:
	docker compose exec team-docs-local bunx prisma db seed

# Apply migration in production (safe)
deploy:
	docker compose exec team-docs-local bunx prisma migrate deploy

# -----------------------
# Docker commands (for postgres)
# -----------------------

# Run development environment
dev-docker:
	docker compose up --build team-docs-local prisma-studio

# Run production environment
prod-docker:
	docker compose up --build team-docs-prod prisma-studio

# View Postgres logs
up:
	docker compose up

down: 
	docker compose down

build: 
	docker compose build --no-cache

restart:
	docker compose down && docker compose up 

logs:
	docker logs -f team-docs-local-postgres

# Enter Postgres container shell
exec:
	docker exec -it team-docs-local-postgres sh

# Restart Postgres
restart-db:
	docker restart team-docs-local-postgres

# Fully reset Docker volumes (DANGEROUS!)
flush:
	docker compose down --volumes --remove-orphans
	docker system prune -f --volumes

# Show container status
status:
	docker ps | grep postgres || echo "Postgres is not running"
