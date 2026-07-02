# Deployment Guide

This document describes production deployment concepts for UniChat.

UniChat can be deployed in multiple ways. The simplest path is Docker Compose. A more scalable path uses managed services such as ECS/Fargate, RDS, and S3/EFS.

## Production goals

A production deployment should provide:

```txt
secure environment variables
persistent database
persistent uploads
HTTPS
proper CORS
stable backend API
frontend static hosting
Socket.IO websocket support
logs
backups
```

## Minimum production components

```txt
frontend static build
backend API server
PostgreSQL database
persistent upload storage
environment variables/secrets
domain + HTTPS
```

## Docker Compose deployment

A simple deployment can use:

```txt
docker-compose.yml
backend/Dockerfile
frontend/Dockerfile
frontend/nginx.conf
.env.docker or platform env variables
```

This works for small deployments or demos.

However, local Docker volumes are not ideal for serious production.

## Recommended scalable AWS setup

A more scalable AWS setup:

```txt
ECS/Fargate for backend/frontend containers
RDS PostgreSQL for database
S3 or EFS for uploads
Secrets Manager or task env vars for secrets
CloudWatch for logs
Application Load Balancer for HTTPS and routing
```

## Database production recommendation

Use managed PostgreSQL:

```txt
AWS RDS PostgreSQL
SSL enabled
automated backups enabled
restricted network access
strong password
```

Do not rely on local Docker `db_data` volume for serious production.

## Upload production recommendation

For one backend instance, a persistent volume can work.

For multiple backend instances, use shared storage:

```txt
S3
EFS
```

If uploads stay on container-local disk, they can be lost when containers restart or scale.

## Environment variables

Production variables should be configured in the hosting platform.

Do not upload real `.env` files if the platform supports environment variables or secret managers.

Important production variables:

```txt
NODE_ENV=production
PORT
CLIENT_ORIGINS
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
DB_SSL
JWT_SECRET
GOOGLE_CLIENT_ID
OPENAI_API_KEY
OPENAI_MODEL
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_POLLY_VOICE_ID
VITE_API_URL
VITE_SOCKET_URL
VITE_GOOGLE_CLIENT_ID
```

## CORS

Set `CLIENT_ORIGINS` to the real frontend domain.

Example:

```env
CLIENT_ORIGINS=https://unichat.example.com
```

Avoid using `*` for authenticated production APIs.

## Frontend build

The frontend build command:

```powershell
npm --prefix frontend run build
```

The built static files are served by nginx or another static server.

## Backend build

Before TypeScript migration, backend may run directly with Node.

After TypeScript migration, backend should have:

```txt
build
start
typecheck
```

Production should run compiled output if using TypeScript.

## Database schema in production

Production schema changes should be intentional.

Do not run seed in production.

Recommended:

```txt
run schema/migrations manually or in a controlled release step
verify backup before schema changes
never reset production database volumes
```

## Deployment checklist

Before deploying:

```txt
Frontend build passes.
Backend syntax/typecheck passes.
Docker compose config passes if using compose.
JWT_SECRET is strong.
CLIENT_ORIGINS is production domain.
Database credentials are production-safe.
Database SSL is configured if required.
OpenAI key is set if AI is enabled.
AWS Polly credentials/role are configured if speech is enabled.
Google OAuth domain is configured.
Uploads are persistent.
Seed is disabled.
Logs are available.
HTTPS is enabled.
```

## Simple Elastic Beanstalk path

A simple AWS path is Elastic Beanstalk with Docker Compose.

General idea:

```txt
1. Configure production environment variables in AWS.
2. Keep docker-compose.yml, backend Dockerfile, frontend Dockerfile, and nginx config.
3. Create a source bundle without node_modules, dist, .git, or env files.
4. Upload to Elastic Beanstalk Docker environment.
```

Example zip command from a Unix-like shell:

```bash
zip -r unichat-deploy.zip . \
  -x "node_modules/*" \
  -x "backend/node_modules/*" \
  -x "frontend/node_modules/*" \
  -x "frontend/dist/*" \
  -x ".git/*" \
  -x "*.env"
```

In PowerShell, prefer a controlled archive script or GitHub Actions.

## Better deployment path

For long-term production:

```txt
build Docker images
push images to ECR
run containers on ECS/Fargate
use RDS for PostgreSQL
use S3/EFS for uploads
use Secrets Manager
use CI/CD pipeline
```

## Socket.IO deployment notes

Socket.IO needs websocket support.

Check:

```txt
load balancer supports websockets
nginx proxies websocket upgrade headers
VITE_SOCKET_URL points to correct host
backend CORS allows frontend origin
```

For multi-instance backend, you may eventually need a Socket.IO adapter such as Redis.

## Security checklist

```txt
Use HTTPS.
Use strong JWT_SECRET.
Do not commit secrets.
Restrict database access.
Use production CORS.
Use helmet.
Use rate limiting.
Validate uploads.
Limit body size.
Use secure cookies if cookies are introduced later.
Rotate leaked secrets immediately.
```

## Production monitoring

At minimum, monitor:

```txt
backend logs
database errors
API error rate
container restarts
disk/storage usage
OpenAI failures
Polly failures
Socket.IO connection issues
```

## Rollback strategy

Before deploying major changes:

```txt
tag the previous commit
backup database
keep previous image/version available
deploy in small steps
verify core flows after deploy
```

Core flows:

```txt
login
home
course
chat
calendar
resources
admin
AI ask
AI speech
```

## What not to do

```txt
Do not run db:seed in production.
Do not store production secrets in files committed to Git.
Do not use local Docker volumes as long-term production storage.
Do not expose backend with open CORS.
Do not put OpenAI or AWS secret keys in frontend.
Do not deploy without testing login and Socket.IO.
```
