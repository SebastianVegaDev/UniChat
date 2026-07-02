# Development Guide

This guide explains how to work on UniChat locally.

## Requirements

Recommended:

```txt
Node.js 20+
npm
Docker
Docker Compose
PostgreSQL 16+ if running database without Docker
```

## Install dependencies

From root:

```powershell
npm --prefix backend install
npm --prefix frontend install
```

## Local development without Docker

### Backend

```powershell
Copy-Item ".\backend\.env.example" ".\backend\.env"
npm --prefix backend install
npm --prefix backend run dev
```

### Frontend

```powershell
Copy-Item ".\frontend\.env.example" ".\frontend\.env"
npm --prefix frontend install
npm --prefix frontend run dev
```

Frontend usually runs at:

```txt
http://localhost:5173
```

Backend usually runs at:

```txt
http://localhost:3000
```

## Local development with Docker

Create Docker env:

```powershell
Copy-Item ".\.env.docker.example" ".\.env.docker"
```

Start stack:

```powershell
docker compose --env-file .env.docker up --build
```

Open:

```txt
http://localhost:8080
```

Stop stack:

```powershell
docker compose down
```

Reset stack data:

```powershell
docker compose down -v
docker compose --env-file .env.docker up --build
```

Use reset only for local development.

## Database commands

Run schema:

```powershell
npm --prefix backend run db:schema
```

Run seed:

```powershell
npm --prefix backend run db:seed
```

Seed is only for development/demo data.

## Frontend validation

```powershell
npm --prefix frontend run lint
npm --prefix frontend run build
```

## Backend validation

Syntax check for JavaScript backend:

```powershell
Get-ChildItem ".\backend\src" -Recurse -Filter "*.js" | ForEach-Object { node --check $_.FullName }
```

If backend has a build/typecheck script after TypeScript migration:

```powershell
npm --prefix backend run typecheck
npm --prefix backend run build
```

## Docker validation

```powershell
docker compose config
```

## Useful search commands

Search old shared UI imports:

```powershell
Get-ChildItem ".\frontend\src" -Recurse -File | Select-String -Pattern "shared/ui/content","shared/ui/forms","shared/ui/states","shared/ui/ai"
```

Search direct localStorage usage:

```powershell
Get-ChildItem ".\frontend\src" -Recurse -File | Select-String -Pattern "localStorage"
```

Search direct frontend env usage:

```powershell
Get-ChildItem ".\frontend\src" -Recurse -File | Select-String -Pattern "import.meta.env"
```

Search direct backend env usage:

```powershell
Get-ChildItem ".\backend\src" -Recurse -File | Select-String -Pattern "process.env"
```

Expected rule:

```txt
frontend import.meta.env should be centralized in shared/config/env.js
backend process.env should be centralized in config/env.js
```

## Recommended development flow

For a normal feature change:

```txt
1. Understand the feature folder.
2. Identify page, mapper, hooks, API, components.
3. Make the smallest change.
4. Run lint/build.
5. Test manually.
6. Commit with a clear message.
```

## Recommended refactor flow

For a refactor:

```txt
1. Do not change behavior.
2. Move files first.
3. Fix imports.
4. Split large files by responsibility.
5. Reuse primitives if it improves consistency.
6. Run validation.
7. Commit separately from feature changes.
```

## Commit style

Recommended examples:

```txt
refactor(backend): reorganize modules and database setup
refactor(frontend): reorganize features and shared UI
docs: centralize project documentation
chore: migrate UniChat to TypeScript
fix(frontend): centralize auth route session checks
```

## What not to mix

Avoid mixing these in one commit:

```txt
large refactor + feature change
TypeScript migration + UI redesign
database schema changes + frontend cleanup
docs rewrite + backend logic change
```

Smaller commits make the project easier to debug.

## Adding a frontend feature

Use this structure when needed:

```txt
feature/new-feature/
  api/
  components/
  helpers/
  hooks/
  mappers/
  pages/
```

Rules:

```txt
components render UI
helpers contain non-UI logic
hooks contain state/effects
api contains HTTP calls
mappers transform backend data
pages coordinate the feature
```

## Adding a backend module

Use this structure when needed:

```txt
modules/new-module/
  newModule.routes.js
  newModule.controller.js
  newModule.service.js
  newModule.repository.js
  newModule.mapper.js
```

Rules:

```txt
controller handles HTTP
service handles business logic
repository handles database access
mapper shapes data
```

## Adding shared code

Before adding shared code, ask:

```txt
Is this used by more than one feature?
Will another feature realistically use this soon?
Is this generic enough?
```

If not, keep it in the feature.

## Working with AI-generated code

Some parts of the project were originally generated or heavily assisted by AI.

When touching complex code:

```txt
read it first
name responsibilities
split by responsibility
keep behavior stable
avoid clever abstractions
write docs if the concept is hard
```

## Working with TypeScript later

When migrating:

```txt
migrate after architecture is stable
do not change feature structure
do not add complex global types
type props, API responses, mappers, hooks
keep feature-specific types near feature
use shared/types only for truly shared types
```

## Manual testing checklist

After major frontend changes:

```txt
login
register
home page
news page
course page
resources
calendar
chat
preferences
admin page
AI widget
logout
protected routes
public routes
```

After backend changes:

```txt
auth
bootstrap
admin routes
course routes
resource upload
calendar events
chat actions
preferences
AI ask
AI speech
Socket.IO updates
```
