# Run dev migration with timestamp
migrate:
	bunx prisma migrate dev 

# Push schema directly to DB
push:
	bunx prisma db push 

# Generate Prisma client
local_generate:
	bunx prisma generate

# Reset DB (DANGEROUS)
reset:
	DATABASE_URL=$(DB_URL) bunx prisma migrate reset --force

# Seed DB
seed:
	bunx prisma db seed

# Apply migration in production (safe)
deploy:
	bunx prisma migrate deploy 

# -----------------------
# Docker commands (for postgres)
# -----------------------

# View Postgres logs
logs:
	docker logs -f postgres

# Enter Postgres container shell
exec:
	docker exec -it postgres sh

# Restart Postgres
restart:
	docker restart postgres

# Fully reset Docker volumes (DANGEROUS!)
flush:
	docker compose down --volumes --remove-orphans
	docker system prune -f --volumes

# Show container status
status:
	docker ps | grep postgres || echo "Postgres is not running"
