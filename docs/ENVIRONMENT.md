# Environment Variables

UniChat uses environment variables for backend, frontend, Docker, database, authentication, AI, and external services.

Secrets must never be committed.

## Environment files

Root:

```txt
.env.docker.example
.env.docker
```

Backend:

```txt
backend/.env.example
backend/.env
```

Frontend:

```txt
frontend/.env.example
frontend/.env
```

Files ending in `.example` are safe to commit because they do not contain real secrets.

Real `.env` files should not be committed.

## Root Docker env

The root Docker env file is used by:

```txt
docker-compose.yml
```

Create it locally:

```powershell
Copy-Item ".\.env.docker.example" ".\.env.docker"
```

Then edit `.env.docker`.

## Backend env groups

Backend variables can be grouped like this:

```txt
server
cors
database
auth
google
openai
aws polly
uploads
rate limits
body limits
```

## Server variables

Common backend server variables:

```env
PORT=3000
NODE_ENV=development
```

For production:

```env
NODE_ENV=production
```

## CORS variables

```env
CLIENT_ORIGINS=http://localhost:5173,http://localhost:8080
```

Production should use the real frontend domain.

Example:

```env
CLIENT_ORIGINS=https://your-domain.com
```

Do not use a broad wildcard for authenticated production APIs.

## Database variables

```env
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
```

For Docker local development, `DB_HOST` is usually:

```env
DB_HOST=db
```

For local non-Docker development, it is often:

```env
DB_HOST=localhost
```

For managed production database, SSL may be required:

```env
DB_SSL=true
```

## JWT variables

```env
JWT_SECRET=replace-with-a-long-random-secret
```

Production must use a strong secret.

Do not reuse development secrets in production.

## Google OAuth

Backend:

```env
GOOGLE_CLIENT_ID=
```

Frontend:

```env
VITE_GOOGLE_CLIENT_ID=
```

The Google client ID must match your configured Google OAuth application.

## OpenAI

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-nano
```

The AI module uses OpenAI to answer questions about resources, events, classes, and study help.

Never expose the OpenAI API key to the frontend.

## Amazon Polly

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_POLLY_VOICE_ID=Enrique
```

Amazon Polly is used for AI text-to-speech.

In production, prefer platform secrets or AWS IAM roles instead of storing credentials in files.

## Frontend variables

Frontend variables must start with `VITE_`.

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=
```

For Docker/nginx production-like setup:

```env
VITE_API_URL=/api
VITE_SOCKET_URL=/
```

## Frontend config rule

Frontend code should not read `import.meta.env` randomly.

Use:

```txt
frontend/src/shared/config/env.js
```

This keeps environment handling centralized.

## Backend config rule

Backend code should not read `process.env` randomly.

Use:

```txt
backend/src/config/env.js
```

This keeps validation, defaults, and naming in one place.

## Secrets checklist

Never commit:

```txt
.env
.env.*
.env.docker
backend/.env
frontend/.env
production secrets
API keys
database passwords
JWT secrets
AWS credentials
OpenAI keys
```

Allowed to commit:

```txt
.env.example
.env.docker.example
backend/.env.example
frontend/.env.example
```

## Local development example

Backend local:

```powershell
Copy-Item ".\backend\.env.example" ".\backend\.env"
npm --prefix backend run dev
```

Frontend local:

```powershell
Copy-Item ".\frontend\.env.example" ".\frontend\.env"
npm --prefix frontend run dev
```

Docker local:

```powershell
Copy-Item ".\.env.docker.example" ".\.env.docker"
docker compose --env-file .env.docker up --build
```

## Production environment

In production, set environment variables through the hosting platform.

Examples:

```txt
AWS Elastic Beanstalk environment variables
ECS task definition secrets
AWS Secrets Manager
GitHub Actions secrets
Render/Fly/Railway env settings
```

Avoid uploading `.env` files to production servers.

## Environment validation checklist

Before running:

```txt
JWT_SECRET is set.
DB variables are set.
CLIENT_ORIGINS matches frontend URL.
GOOGLE_CLIENT_ID is set if Google login is enabled.
OPENAI_API_KEY is set if AI is enabled.
AWS variables are set if Polly speech is enabled.
Frontend VITE_API_URL points to API.
Frontend VITE_SOCKET_URL points to Socket.IO server.
```

## Common mistakes

### Frontend variable missing

Vite only exposes variables that start with:

```txt
VITE_
```

### Backend cannot use frontend env

Backend cannot read `VITE_` variables unless explicitly passed, and it should not depend on them.

### OpenAI key in frontend

Never put `OPENAI_API_KEY` in frontend env.

### AWS keys in frontend

Never put AWS secret keys in frontend env.

### Real env committed

If a real secret is committed, rotate it immediately.
