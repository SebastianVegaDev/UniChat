# Backend Documentation

The backend is an Express API with Socket.IO and PostgreSQL. It handles authentication, courses, resources, calendar events, chat, preferences, admin workflows, AI answers, and Amazon Polly speech.

The goal of the backend architecture is to keep business logic separated from HTTP details and database access.

## Backend structure

```txt
backend/src/
  app.js
  server.js

  config/
  database/
  errors/
  middlewares/
  modules/
  shared/
  socket/
```

## Entry points

### `server.js`

Starts the HTTP server and Socket.IO.

Responsibilities:

```txt
load app
start server
attach socket server
listen on configured port
```

It should not contain business logic.

### `app.js`

Creates the Express app.

Responsibilities:

```txt
register middlewares
register routes
configure error handling
configure static uploads if needed
```

It should not contain module-specific logic.

## Config

```txt
src/config/
```

This folder owns environment configuration.

The main rule:

```txt
Only config files should read process.env directly.
```

Other files should import normalized config values.

Good:

```js
import { env } from "../config/env.js";
```

Avoid:

```js
process.env.JWT_SECRET
```

outside config.

## Database

```txt
src/database/
```

This folder owns database connection, schema scripts, seed scripts, and SQL setup.

Expected responsibilities:

```txt
database connection/pool
schema files
schema runner
seed runner
database helpers
```

The schema should live under:

```txt
backend/src/database/schema/
```

Scripts should live under:

```txt
backend/src/database/scripts/
```

Common scripts:

```bash
npm run db:schema
npm run db:seed
```

Seed is for development/demo data only. It should not run automatically in production.

## Errors

```txt
src/errors/
```

This folder owns custom error classes and error helpers.

Typical responsibilities:

```txt
AppError
NotFoundError
UnauthorizedError
ForbiddenError
ValidationError
error response formatting
```

Controllers and services should throw meaningful errors. The global error middleware should convert them into HTTP responses.

## Middlewares

```txt
src/middlewares/
```

Middlewares handle cross-cutting HTTP concerns.

Examples:

```txt
auth middleware
role middleware
validation middleware
rate limit middleware
upload middleware
error middleware
```

Middlewares should not contain module business logic.

## Modules

```txt
src/modules/
```

Each module owns a business area.

Examples:

```txt
auth
bootstrap
admin
courses
resources
calendar
chat
preferences
ai
```

A module can contain:

```txt
routes
controller
service
repository
mapper
domain helpers
types
```

The module should keep its own logic inside itself unless something is genuinely shared.

## Controller responsibility

Controllers are HTTP adapters.

They should:

```txt
read params/body/query/user
call a service/use case
return JSON response
forward errors
```

They should not:

```txt
write raw SQL
contain complex business rules
know too much about database tables
call external services directly unless the module is very small
```

## Service responsibility

Services contain application rules.

They should:

```txt
validate business conditions
coordinate repositories
coordinate external providers
prepare domain results
throw meaningful errors
```

Examples:

```txt
create course
add user to course
approve delegate
create calendar event
send chat message
ask AI
generate speech
```

## Repository responsibility

Repositories isolate database access.

They should:

```txt
run SQL queries
map rows when needed
return data to services
```

They should not contain high-level business decisions.

## Shared backend code

```txt
src/shared/
```

Shared backend code should only contain things used by more than one module.

Good shared candidates:

```txt
date helpers
string helpers
pagination helpers
common mappers
shared constants
shared types
```

Bad shared candidates:

```txt
course-specific helper used only by courses
AI-specific helper used only by AI
admin-specific mapper used only by admin
```

## Auth module

The auth module handles:

```txt
email/password login
Google login
registration
JWT creation
current user session
```

JWT is sent by the frontend in:

```txt
Authorization: Bearer <token>
```

Backend routes that require authentication should use auth middleware.

## Bootstrap module

The bootstrap module returns the initial application data needed by the frontend.

It can include:

```txt
current user
courses
course members
resources
calendar events
announcements
preferences
chat channels/messages
admin data when applicable
```

The frontend uses this to avoid many small initial requests.

## Admin module

The admin module handles admin-only workflows:

```txt
manage courses
manage users
block/unblock users
manage announcements
approve/reject delegates
security/admin overview
```

Admin routes should require:

```txt
authenticated user
role = admin
```

## Courses and resources

Course-related modules handle:

```txt
course pages
course members
teacher/delegate data
resources by week
resource upload
resource update
resource availability
resource deletion
```

Uploads should validate file type and should not trust client-provided file metadata.

## Calendar module

The calendar module handles:

```txt
course events
class sessions
assignments
exams
reminders
event creation
event editing
event cancellation
event deletion
```

Teachers can manage course calendar events. Students can view them.

## Chat module

The chat module handles:

```txt
course chat channels
messages
photo attachments
reactions
read tracking
pinned messages
locked channels
Socket.IO events
```

Socket.IO should keep clients updated after chat actions.

## Preferences module

The preferences module handles user customization:

```txt
language
color palette
chat wallpaper
chat font size
read check visibility
```

The frontend applies preferences visually.

## AI module

The AI module handles:

```txt
OpenAI answers
resource-aware answers
event/class answers
next class answers
Amazon Polly text-to-speech
```

The AI module should be isolated because it has external provider logic.

Provider-specific code should not leak into controllers.

## Socket.IO

```txt
src/socket/
```

Socket code handles realtime events.

Typical responsibilities:

```txt
authenticate socket connection
join course/chat rooms
emit message updates
emit reaction updates
emit read updates
emit channel updates
```

The socket layer should coordinate with services instead of duplicating business logic.

## Security notes

Backend security should include:

```txt
JWT authentication
role-based authorization
CORS controlled by CLIENT_ORIGINS
helmet
rate limiting
body size limit
file type validation
safe upload paths
database SSL in production
```

Secrets should never be committed.

## Backend validation commands

From the project root:

```powershell
npm --prefix backend install
npm --prefix backend run dev
```

Syntax check for JavaScript backend:

```powershell
Get-ChildItem ".\backend\src" -Recurse -Filter "*.js" | ForEach-Object { node --check $_.FullName }
```

Database setup:

```powershell
npm --prefix backend run db:schema
npm --prefix backend run db:seed
```

Docker validation:

```powershell
docker compose config
```

## Backend rules for future work

When adding backend code:

```txt
Do not put business logic in controllers.
Do not access process.env outside config.
Do not put feature-specific logic in shared.
Do not run seed in production.
Do not mix OpenAI/Polly details into unrelated modules.
Keep SQL isolated in repositories or database helpers.
Keep modules readable before making them clever.
```

## TypeScript notes

When migrating backend to TypeScript:

```txt
controllers should type Request/Response/NextFunction
services should expose typed inputs/outputs
repositories should type database rows/results
feature-specific types should live in that feature
shared types should only be for truly shared shapes
avoid a global types dumping folder
```
