# UniChat

UniChat is a web platform for students, teachers, and administrators. It includes course pages, realtime chat, calendar events, resources, preferences, an admin panel, Google login, and an AI assistant with OpenAI answers and Amazon Polly voice.

## Main Features

- Student and teacher course experience.
- Realtime course chat with reactions, read tracking, pinned messages, locked channels, and photo attachments.
- Course resources, calendar events, announcements, and weekly class sessions.
- User preferences for language, palette, wallpaper, chat font size, and read checks.
- Admin dashboard for courses, users, announcements, and delegate approvals.
- Teacher delegate request flow.
- UniChat AI assistant for resources, tasks, exams, events, and study help.
- Amazon Polly text-to-speech for AI answers.
- Docker setup for frontend, backend, PostgreSQL, nginx, Socket.IO, and persisted uploads.

## Project Structure

```text
backend/       Express API, Socket.IO, PostgreSQL schema, AI, auth, admin modules
frontend/      Vite React app served by nginx in Docker
demo-files/    Demo PDF resources used for testing and seeding workflows
docker-compose.yml
.env.docker.example
```

## Requirements

- Node.js 20+
- npm
- PostgreSQL 16+ for local non-Docker development
- Docker and Docker Compose for containerized development/deploy

## Run With Docker

Create a local Docker env file:

```bash
cp .env.docker.example .env.docker
```

Start the full stack:

```bash
docker compose --env-file .env.docker up --build
```

Open:

```text
http://localhost:8080
```

The Docker stack runs:

- `db`: PostgreSQL 16 with `backend/src/schema/schema.sql`.
- `backend`: Express API on port `3000` inside the Docker network.
- `frontend`: nginx on local port `8080`.
- `uploads_data`: persistent Docker volume for uploaded photos and wallpapers.
- `db_data`: persistent Docker volume for PostgreSQL data.

## Local Development Without Docker

Backend:

```bash
cp backend/.env.example backend/.env
npm --prefix backend install
npm --prefix backend run dev
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
npm --prefix frontend install
npm --prefix frontend run dev
```

## Environment Variables

Important backend variables:

```env
PORT=3000
NODE_ENV=production
CLIENT_ORIGINS=https://your-domain.com
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-nano
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_POLLY_VOICE_ID=Enrique
```

Important frontend variables:

```env
VITE_API_URL=/api
VITE_SOCKET_URL=/
VITE_GOOGLE_CLIENT_ID=
```

Never commit real `.env` files or production secrets.

## Database

The main schema is in:

```text
backend/src/schema/schema.sql
```

Runtime compatibility updates are in:

```text
backend/src/schema/runtimeSchema.js
```

For Docker, PostgreSQL initializes from `schema.sql` only when the `db_data` volume is new. If you need a fresh local DB:

```bash
docker compose down -v
docker compose --env-file .env.docker up --build
```

This removes local Docker database/upload volumes, so only use it for local reset.

## Security Notes

- JWT auth requires `Authorization: Bearer <token>`.
- Admin routes require `role = admin`.
- Teacher routes require `role = teacher`.
- `helmet` is enabled for common HTTP security headers.
- API rate limiting is enabled with `RATE_LIMIT_MAX_REQUESTS`.
- CORS is controlled by `CLIENT_ORIGINS`.
- JSON body size is limited by `JSON_BODY_LIMIT`.
- Uploads accept only `.jpg`, `.jpeg`, `.png`, and `.webp` photos.
- Production database SSL can be enabled with `DB_SSL=true`.

For AWS production, store secrets in the AWS service configuration or a secrets manager, not in files.

## AWS Deployment Guide

The fastest deployment path for this project is Elastic Beanstalk with Docker Compose:

1. Set production environment variables in AWS.
2. Keep `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, and `frontend/nginx.conf` at the project paths.
3. Create a source bundle without dependencies or local secrets:

```bash
zip -r unichat-deploy.zip . \
  -x "node_modules/*" \
  -x "backend/node_modules/*" \
  -x "frontend/node_modules/*" \
  -x "frontend/dist/*" \
  -x ".git/*" \
  -x "*.env"
```

4. Upload `unichat-deploy.zip` to an Elastic Beanstalk Docker environment.

For a more scalable production setup, build images and push them to Amazon ECR, then run them on ECS/Fargate. In that setup, use RDS for PostgreSQL and S3 or EFS for uploaded files.

## Validation Commands

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
find backend/src -name '*.js' -print0 | xargs -0 -n1 node --check
docker compose config
```

## Current Production Checklist

- Replace `JWT_SECRET`.
- Set `CLIENT_ORIGINS` to the final domain.
- Configure `GOOGLE_CLIENT_ID`.
- Configure `OPENAI_API_KEY`.
- Configure AWS Polly credentials.
- Use RDS or another managed PostgreSQL database for production.
- Use S3 or EFS for user uploads if running more than one backend instance.
