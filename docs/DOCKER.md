# Docker Documentation

UniChat can run as a Docker Compose stack with PostgreSQL, backend, frontend/nginx, and persisted uploads.

## Root files

Docker-related root files:

```txt
docker-compose.yml
.env.docker.example
```

The real `.env.docker` file should not be committed.

## Services

The Docker stack has these conceptual services:

```txt
db
backend
frontend
```

And these volumes:

```txt
db_data
uploads_data
```

## db service

The `db` service runs PostgreSQL.

Responsibilities:

```txt
store application data
initialize schema when volume is new
persist database data in db_data
```

The schema should be mounted from:

```txt
backend/src/database/schema/
```

Recommended mount:

```yaml
./backend/src/database/schema:/docker-entrypoint-initdb.d:ro
```

PostgreSQL only runs init files when the database volume is new.

## backend service

The backend service runs the Express API and Socket.IO server.

Responsibilities:

```txt
REST API
auth
admin
courses
resources
calendar
chat
preferences
AI
uploads
Socket.IO
```

It receives environment variables from `.env.docker`.

## frontend service

The frontend service builds the Vite app and serves it through nginx.

Responsibilities:

```txt
serve React build
proxy /api to backend if configured in nginx
proxy Socket.IO if configured
serve app at local port
```

Usually the frontend is exposed at:

```txt
http://localhost:8080
```

## uploads_data volume

Uploaded files need persistence.

Examples:

```txt
chat photos
chat wallpapers
course resource files
```

For local Docker, a Docker volume can be enough.

For scaled production, use:

```txt
S3
EFS
or another shared/persistent storage service
```

## db_data volume

PostgreSQL data persists in:

```txt
db_data
```

If you remove this volume, local database data is deleted.

## Environment file

Create a real local Docker env file:

```powershell
Copy-Item ".\.env.docker.example" ".\.env.docker"
```

Then edit `.env.docker`.

Never commit `.env.docker`.

## Start stack

From root:

```powershell
docker compose --env-file .env.docker up --build
```

Open:

```txt
http://localhost:8080
```

## Stop stack

```powershell
docker compose down
```

## Reset local Docker data

Use only when you want a clean local database and clean uploads.

```powershell
docker compose down -v
docker compose --env-file .env.docker up --build
```

This deletes:

```txt
db_data
uploads_data
```

## Validate compose

```powershell
docker compose config
```

This checks whether the compose file is valid.

## Docker environment variables

Docker uses root-level `.env.docker`.

Important groups:

```txt
PostgreSQL variables
backend server variables
frontend public variables
Google OAuth
OpenAI
AWS Polly
CORS
JWT
rate limits
upload limits
```

## Docker and schema

If you change schema files and want Docker PostgreSQL to rerun them locally, you must reset the database volume:

```powershell
docker compose down -v
docker compose --env-file .env.docker up --build
```

For production, do not rely on deleting volumes. Use controlled migrations or schema deployment.

## Docker and seed

Seed should not automatically run in production Docker.

Local development seed can be run manually:

```powershell
npm --prefix backend run db:seed
```

or through a temporary/dev-only command.

## Production notes

Docker Compose can be used for simple deployments, but for scalable production prefer:

```txt
ECS/Fargate for containers
RDS for PostgreSQL
S3/EFS for uploads
Secrets Manager or platform env vars for secrets
CloudWatch or similar logging
```

## Common Docker problems

### Database does not reflect new schema

Reason:

```txt
db_data volume already exists
```

Fix for local development:

```powershell
docker compose down -v
docker compose --env-file .env.docker up --build
```

### Backend cannot connect to DB

Check:

```txt
DB_HOST should match the compose service name, usually db
DB_PORT should be 5432
DB_USER, DB_PASSWORD, DB_NAME should match postgres env
```

### Frontend cannot reach API

Check:

```txt
VITE_API_URL
nginx proxy config
backend container health
CORS CLIENT_ORIGINS
```

### Socket.IO not working

Check:

```txt
VITE_SOCKET_URL
nginx websocket proxy
backend Socket.IO CORS
frontend realtime socket config
```

## Docker rules

```txt
Do not commit .env.docker.
Do not put production secrets in Docker files.
Do not run seed automatically in production.
Do not use local Docker volumes as serious production storage.
Keep Docker config boring and explicit.
```
