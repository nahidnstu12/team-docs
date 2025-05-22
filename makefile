.PHONY: size
.PHONY: flush

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
dev:
	docker compose up team-docs-local prisma-studio

build-dev:
	docker compose build team-docs-local

# Run production environment
build-prod:
	docker compose build --no-cache team-docs-prod prisma-studio
	docker compose up team-docs-prod prisma-studio

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
	@echo "🔻 Stopping and removing containers, volumes, and orphans..."
	docker compose down --volumes --remove-orphans

	@echo "🧹 Pruning unused networks, caches, and volumes..."
	docker system prune -f --volumes

	@echo "🔥 Removing all Docker images (used + unused)..."
	docker rmi -f $$(docker images -q) || echo "No images to remove"

	@echo "✅ Docker environment fully flushed."

# Show container status
status:
	docker ps | grep postgres || echo "Postgres is not running"

size:
	@echo "🔍 Project Folder Size:"
	@du -sh . | sort -h

	@echo "📦 Node Modules:"
	@du -sh node_modules 2>/dev/null || echo "node_modules not found"

	@echo "🐳 Docker Container Sizes:"
	@docker ps -s --format "table {{.Names}}\t{{.Size}}" || echo "Docker not running"

	@echo "🐳 Docker Images:"
	@docker images --format "table {{.Repository}}\t{{.Size}}" | sort -h

	@echo "🐳 Docker Volumes:"
	@docker system df -v | grep -A 100 "VOLUMES" || echo "No Docker volumes found"

	@echo "💥 Total Docker Disk Usage:"
	@docker system df
