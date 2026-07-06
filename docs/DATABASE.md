# Database Documentation

UniChat uses PostgreSQL as the main database.

The database stores users, courses, enrollments, resources, calendar events, announcements, preferences, chat channels, messages, reactions, read states, delegate flows, and related application data.

## Database location

Database schema files should live in:

```txt
backend/src/database/schema/
```

Database scripts should live in:

```txt
backend/src/database/scripts/
```

Expected scripts:

```txt
runSchema.js
runSeed.js
```

## Schema vs seed

There are two different responsibilities:

```txt
schema = database structure
seed   = development/demo data
```

Schema creates tables, indexes, constraints, and required database structure.

Seed inserts demo users, courses, resources, messages, announcements, preferences, and test data.

## Important rule

```txt
Run schema in production.
Do not run seed in production.
```

Seed is only for local development, demos, or testing.

## Local database setup

From the project root:

```powershell
npm run db:schema
```

For development demo data:

```powershell
npm run db:seed
```

## Docker database setup

The Docker PostgreSQL service initializes from schema files when the database volume is new.

Expected compose mount:

```yaml
./backend/src/database/schema:/docker-entrypoint-initdb.d:ro
```

This means PostgreSQL runs the schema only when the volume is first created.

If the database volume already exists, PostgreSQL will not rerun init scripts automatically.

## Reset local Docker database

Use this only for local reset:

```powershell
npm run docker:reset
```

This removes local Docker volumes, including:

```txt
db_data
uploads_data
```

That means local database data and local uploaded files are deleted.

## Main conceptual tables

Exact table names can evolve, but the app needs these conceptual areas:

```txt
users
courses
course_members
resources
calendar_events
announcements
preferences
chat_channels
chat_messages
chat_reactions
chat_reads
delegate_requests
uploaded_files or upload references
```

## Users

Users represent students, teachers, and admins.

Important user concepts:

```txt
id
name
code/email
role
blocked status
auth provider
preferences
```

## Courses

Courses represent academic classes.

Important course concepts:

```txt
id
title
short name
teacher
classroom
weekly sessions
members
delegates
resources
chat channels
calendar events
```

## Course members

Course members connect users with courses.

This relationship allows:

```txt
student enrollment
teacher assignment
delegate roles
membership validation
```

## Resources

Resources are course files grouped by week.

Important concepts:

```txt
course id
week number
title
kind
file url
size
status available/unavailable
uploaded by
created date
```

Teachers can create, edit, hide/show, and delete resources.

Students can view available resources.

## Calendar events

Calendar events represent course-related dates.

Possible event types:

```txt
class
assignment
exam
reminder
announcement
other
```

Teachers can manage course calendar events. Students can view them.

## Announcements

Announcements are used by news/admin areas.

Important concepts:

```txt
title
body
status
author
date
target audience
```

Admins can manage announcements.

## Preferences

Preferences store user customization.

Examples:

```txt
language
color palette
chat wallpaper
chat font size
read check visibility
```

Preferences are applied by the frontend and included in bootstrap data.

## Chat

Chat data includes:

```txt
channels
messages
attachments
reactions
read tracking
pinned message
locked channel state
```

Chat should support realtime updates through Socket.IO.

## Delegate flow

Teachers can request delegate candidates. Admins can approve or reject them.

Conceptually:

```txt
teacher requests delegate candidate
admin reviews pending delegate request
admin approves or rejects
course membership updates
```

## Database access pattern

Backend modules should not spread SQL everywhere.

Preferred pattern:

```txt
controller
  -> service
    -> repository
      -> database
```

Repositories should isolate SQL.

Services should make business decisions.

Controllers should only adapt HTTP.

## Runtime schema warning

The old approach had runtime compatibility schema logic. The preferred architecture is schema scripts under:

```txt
backend/src/database/schema/
backend/src/database/scripts/
```

Avoid adding automatic runtime schema mutation unless there is a clear migration strategy.

## Production database

For production, use a managed database when possible.

Recommended:

```txt
AWS RDS PostgreSQL
SSL enabled
backups enabled
restricted network access
strong credentials
```

Do not use local Docker PostgreSQL volumes for serious production.

## Production checklist

Before production:

```txt
Set DB_SSL=true if required.
Use strong database password.
Use managed PostgreSQL if possible.
Do not run seed.
Run schema/migrations intentionally.
Back up database.
Restrict database access.
```

## Future migration strategy

The current project can use schema scripts, but as the app grows it should eventually use a migration system.

Possible future tools:

```txt
node-pg-migrate
knex migrations
prisma migrations
drizzle migrations
custom SQL migration runner
```

The important rule is not the tool. The important rule is:

```txt
Database changes must be intentional, versioned, and repeatable.
```
