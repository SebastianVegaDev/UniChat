# UniChat Backend

Express API for UniChat. It handles authentication, courses, resources, calendar events, realtime chat, preferences, admin actions, AI answers, and Amazon Polly speech.

## Stack

- Node.js 20+
- Express 5
- PostgreSQL
- Socket.IO
- JWT
- Google OAuth token validation
- OpenAI-compatible chat completion endpoint
- Amazon Polly
- Multer uploads
- Helmet and API rate limiting

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The API runs on:

```text
http://localhost:3000/api
```

Uploaded files are served from:

```text
http://localhost:3000/uploads
```

## Scripts

```bash
npm run dev
npm start
```

There is no automated backend test suite yet. Use this syntax check before opening a PR:

```bash
find src -name '*.js' -print0 | xargs -0 -n1 node --check
```

## Environment

```env
PORT=3000
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:5173,http://localhost:8080
RATE_LIMIT_MAX_REQUESTS=600
JSON_BODY_LIMIT=1mb
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=unichat
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=
GOOGLE_CLIENT_ID=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-nano
OPENAI_MAX_OUTPUT_TOKENS=220
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=
AWS_POLLY_VOICE_ID=Enrique
AWS_POLLY_ENGINE=neural
AWS_POLLY_OUTPUT_FORMAT=mp3
AWS_POLLY_SAMPLE_RATE=24000
AWS_POLLY_MAX_CHARS=2500
```

## Database

Main schema:

```text
src/schema/schema.sql
```

Runtime compatibility helper:

```text
src/schema/runtimeSchema.js
```

The schema includes:

- Users and roles: `student`, `teacher`, `admin`.
- Courses, classrooms, course members, and delegate states.
- Class sessions and calendar events.
- Resources and AI-generated resource definitions.
- Announcements.
- Chat channels, messages, reads, reactions, and attachments.
- User preferences.
- Indexes for common access patterns.
- Basic checks for non-empty values, valid statuses, valid roles, and valid attachments.

## Security

- Use a long random `JWT_SECRET` in production.
- Keep `CLIENT_ORIGINS` limited to trusted frontend domains.
- Set `NODE_ENV=production` in production to avoid exposing internal server errors.
- Set `DB_SSL=true` for managed PostgreSQL providers that require TLS.
- Uploads are limited by type and size:
  - Chat photos: max 8 MB.
  - Preference wallpapers: max 6 MB.
  - Allowed types: JPEG, PNG, WEBP.
- API rate limiting defaults to 600 requests per 15 minutes per IP.
- `helmet` is enabled.
- Do not store real secrets in `.env.example`, README files, or Git.

## Docker

Build backend only:

```bash
docker build -t unichat-backend .
```

The root `docker-compose.yml` is preferred for local full-stack runs because it also starts PostgreSQL and the frontend.
