# UniChat Architecture

UniChat is a web platform for students, teachers, and administrators. The application is organized around courses. Each course can have chat, calendar events, resources, class sessions, delegate flows, announcements, preferences, and AI assistance.

The main architectural goal is clarity. The project should be understandable for a junior developer while still being scalable enough to grow. The codebase favors responsibility separation over large files that do many things.

## High-level system

```txt
Browser
  |
  v
Frontend - Vite React
  |
  | HTTP REST
  | Socket.IO
  v
Backend - Express + Socket.IO
  |
  v
PostgreSQL

External services:
  - Google OAuth
  - OpenAI
  - Amazon Polly
```

In Docker, the frontend is served through nginx. The backend exposes the API and Socket.IO. PostgreSQL stores the application data. Uploaded files are persisted in a Docker volume or external storage in production.

## Main roles

UniChat has three main roles:

```txt
student
teacher
admin
```

### Student

A student can:

```txt
view enrolled courses
open course pages
use course chat
view calendar events
view resources
customize preferences
use the AI assistant
```

### Teacher

A teacher can do what students do, plus:

```txt
manage course resources
create or edit calendar events
lock or unlock chat channels
pin messages
request delegate candidates
```

### Admin

An admin has access to the admin panel and can manage:

```txt
courses
users
announcements
delegate approvals
security/admin workflows
```

Admins are redirected away from the normal home page into the admin area.

## Repository structure

At root level, the project is organized like this:

```txt
unichat/
  backend/
  frontend/
  docs/

  docker-compose.yml
  .env.docker.example
  .gitignore
  README.md
```

The root README is only the project entry point. Long documentation belongs in `docs/`.

## Backend architecture

The backend is organized by responsibilities:

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

The backend should follow this mental model:

```txt
route/controller
  -> service/use case
    -> repository/database
      -> PostgreSQL
```

Controllers should be thin. They should read request data, call application logic, and return responses.

Services should contain business rules.

Repositories should isolate SQL/database access.

Shared backend code should only contain utilities, helpers, or types that are genuinely reused.

## Backend module philosophy

A backend module owns its own business area.

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

A module can have its own:

```txt
routes
controller
service
repository
mapper
domain helpers
types
```

The important rule:

```txt
If logic belongs only to one module, keep it inside that module.
If logic is reused by multiple modules, move it to shared.
```

Do not create a global shared folder just to avoid imports. Shared should mean reusable, not convenient.

## Frontend architecture

The frontend is organized around features.

```txt
frontend/src/
  feature/
  shared/
  App.jsx
  main.jsx
  index.css
```

The key rule is:

```txt
Feature-specific UI lives in feature/.
Reusable UI lives in shared/ui/.
```

This means a component should not go into `shared/ui` just because it is visual. It only goes into `shared/ui` if more than one feature genuinely uses it.

## Frontend feature structure

A feature can contain:

```txt
components/
helpers/
hooks/
api/
mappers/
types/
pages/
context/
```

Not every feature needs all folders. The goal is to separate responsibilities without making the project more complex than needed.

Example:

```txt
feature/course-chat/
  components/
  helpers/
  hooks/
  mappers/
  pages/
```

## Frontend shared structure

After the refactor, `shared/ui` should contain only truly reusable UI:

```txt
shared/ui/
  heroes/
  layouts/
  primitives/
```

Examples of reusable primitives:

```txt
AppButton
IconButton
StatusPill
EmptyText
FloatingMenu
ConfirmDialog
```

These are generic building blocks that can be used by admin, home, course, calendar, chat, preferences, and AI.

## What should not be in shared

These should not live in `shared/ui`:

```txt
AdminContent
HomeContent
NewsContent
CourseContent
CalendarContent
ChatContent
PreferencesForm
PublicAiWidget
NotFoundState
```

Those belong to their features.

Correct locations:

```txt
feature/admin/components
feature/home/components
feature/news/components
feature/course/components
feature/course-calendar/components
feature/course-chat/components
feature/preferences/components
feature/ai/components
feature/not-found/components
```

## Data flow examples

### Login flow

```txt
LoginPage
  -> LoginForm
    -> auth.api
      -> backend auth module
        -> JWT + user data
          -> session storage helpers
```

The frontend should not access `localStorage` directly from random components. Session access goes through shared auth/storage helpers.

### Bootstrap flow

```txt
App starts
  -> useBootstrap
    -> bootstrap API
      -> backend bootstrap module
        -> user, courses, calendar, news, preferences, chat data
```

Bootstrap data is the main initial app payload. Features map this data through their own mappers.

### Course flow

```txt
CoursePage
  -> mapCourseData
    -> CourseHero
    -> CourseContent
      -> CourseActions
      -> CourseResourcesPanel
      -> CourseInformationPanel
```

The page coordinates data. Components render UI. Helpers contain non-UI logic.

### Chat flow

```txt
CourseChatPage
  -> mapCourseChatData
  -> useCourseChatActions
  -> ChatContent
    -> ChatChannelPanel
    -> ChatMain
      -> ChatHeader
      -> ChatMessagesList
      -> ChatComposer
```

Socket.IO keeps chat data updated in real time.

### Calendar flow

```txt
CourseCalendarPage
  -> mapCourseCalendarData
  -> useCourseCalendarActions
  -> CalendarContent
    -> CourseCalendarView
    -> CalendarPendingPanel
```

FullCalendar is isolated inside the calendar feature.

### AI flow

```txt
PublicAiWidget
  -> AiWidgetPanel
    -> AiMessageList
    -> AiQuestionForm
  -> ai.api
    -> backend AI module
      -> OpenAI
      -> Amazon Polly
```

The AI widget has its own API, helpers, hook for speech, and UI components.

## Configuration rules

Environment variables should be centralized.

Frontend:

```txt
shared/config/env.js
```

Backend:

```txt
config/env.js
```

Random files should not read `import.meta.env` or `process.env` directly unless they are config files.

## Storage rules

Frontend storage should be centralized.

```txt
shared/storage/localStorage.js
shared/auth/sessionStorage.js
```

Feature code should not call `localStorage.getItem` directly. It should use storage helpers.

## Why this architecture exists

The project originally had many files that were technically working but hard to understand. Some parts, especially AI and Amazon Polly, were complex and felt generated by AI.

The refactor goal was not to make the app more advanced. The goal was to make it easier to reason about.

The main rules are:

```txt
one file = one responsibility
features own their UI
shared is truly shared
helpers hold non-UI logic
hooks hold state/effects
api files hold HTTP calls
mappers transform backend data for UI
```

## TypeScript migration philosophy

TypeScript should fit this architecture. It should not create a new complicated layer.

Recommended rules:

```txt
feature-specific types live in the feature
shared types live in shared/types only if truly reused
component props can be typed near the component
avoid unnecessary generics
avoid global type dumping
avoid any unless justified
```

TypeScript should make the project safer and clearer, not harder to read.

## Architecture checklist

Before adding a new file, ask:

```txt
Is this feature-specific?
Does more than one feature use this?
Is this UI, helper, hook, API, mapper, or config?
Can this file be understood by its name?
Am I putting this in shared only because it is convenient?
```

If a component belongs to one feature, keep it in that feature.
