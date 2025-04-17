# Run dev migration with timestamp
migrate:
	docker compose exec team-docs bunx prisma migrate dev

# Push schema directly to DB
push:
	docker compose exec team-docs bunx prisma db push

# Generate Prisma client
local_generate:
	docker compose exec team-docs bunx prisma generate

# Reset DB (DANGEROUS)
reset:
	docker compose exec team-docs bunx prisma migrate reset --force

# Seed DB
seed:
	docker compose exec team-docs bunx prisma db seed

# Apply migration in production (safe)
deploy:
	docker compose exec team-docs bunx prisma migrate deploy

# -----------------------
# Docker commands (for postgres)
# -----------------------

# View Postgres logs
logs:
	docker logs -f team-docs-postgres

# Enter Postgres container shell
exec:
	docker exec -it team-docs-postgres sh

# Restart Postgres
restart:
	docker restart team-docs-postgres

# Fully reset Docker volumes (DANGEROUS!)
flush:
	docker compose down --volumes --remove-orphans
	docker system prune -f --volumes

# Show container status
status:
	docker ps | grep postgres || echo "Postgres is not running"
