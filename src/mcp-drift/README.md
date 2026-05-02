# Postgres in Docker (`mcp-postgres`)

## What is included

- `docker-compose.yml` with:
  - `postgres:16-alpine`
  - persistent named volume
  - healthcheck via `pg_isready`
  - auto-run init scripts from `./init`
- `.env.example` for local credentials
- `init/01-init.sql` example bootstrap script

## Quick start

1. Create your local env file:

   ```bash
   cp .env.example .env
   ```

2. Start Postgres:

   ```bash
   docker compose up -d
   ```

3. Check status:

   ```bash
   docker compose ps
   ```

4. View logs:

   ```bash
   docker compose logs -f postgres
   ```

## Connection settings

- Host: `localhost`
- Port: value of `POSTGRES_PORT` (default `5432`)
- User: `POSTGRES_USER`
- Password: `POSTGRES_PASSWORD`
- Database: `POSTGRES_DB`

## Useful commands

Stop:

```bash
docker compose down
```

Stop and remove data volume:

```bash
docker compose down -v
```

Open `psql` inside container:

```bash
docker compose exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

## Notes

- SQL scripts in `./init` execute only once on first initialization.
- If you update init scripts later, recreate the volume (`docker compose down -v`) to re-run them.
