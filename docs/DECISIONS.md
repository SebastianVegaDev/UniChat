# Architecture Decisions

This document records important project decisions so the reasoning is not lost.

## 001 - Use feature-first frontend architecture

Status: accepted

The frontend is organized by features instead of by generic file type.

Good:

```txt
feature/course-chat/components
feature/course-chat/helpers
feature/course-chat/hooks
feature/course-chat/mappers
```

Avoid:

```txt
components/chat
helpers/chat
pages/chat
```

Reason:

```txt
A feature-first structure keeps related UI, logic, API, and mappers close together.
It is easier to understand and scale.
```

## 002 - Keep shared UI truly shared

Status: accepted

`shared/ui` should only contain reusable UI building blocks.

Accepted examples:

```txt
AppButton
IconButton
StatusPill
EmptyText
FloatingMenu
ConfirmDialog
SectionLayout
LoadingLayout
SectionHero
```

Rejected examples:

```txt
AdminContent
HomeContent
CourseContent
CalendarContent
ChatContent
PreferencesForm
PublicAiWidget
```

Reason:

```txt
Feature-specific components in shared make the project harder to understand.
Shared becomes a dumping ground if the rule is not strict.
```

## 003 - Components render UI, helpers hold non-UI logic

Status: accepted

Components should not contain large non-UI logic.

Examples of helper logic:

```txt
filtering channels
formatting file size
normalizing AI messages
building form data
calculating menu position
checking resource availability
```

Reason:

```txt
This keeps components readable and easier to test mentally.
```

## 004 - API calls live in feature api files

Status: accepted

Components should not hardcode backend endpoints.

Good:

```txt
feature/ai/api/ai.api.js
feature/admin/api/admin.api.js
```

Reason:

```txt
If an endpoint changes, the feature API file is the single place to update.
```

## 005 - Mappers transform backend data for UI

Status: accepted

Pages should not deeply manipulate raw backend data.

Mappers prepare UI-friendly data:

```txt
mapHomeData
mapCourseData
mapCourseChatData
mapCourseCalendarData
mapAdminData
```

Reason:

```txt
UI components stay simple and backend shape changes are easier to isolate.
```

## 006 - Centralize frontend storage access

Status: accepted

Direct `localStorage` access should be centralized in:

```txt
shared/storage/localStorage.js
shared/auth/sessionStorage.js
```

Reason:

```txt
Storage can fail, contain invalid JSON, or need user scoping.
Centralizing access prevents repeated unsafe code.
```

## 007 - Centralize environment access

Status: accepted

Frontend environment access should be centralized in:

```txt
shared/config/env.js
```

Backend environment access should be centralized in:

```txt
config/env.js
```

Reason:

```txt
This avoids random env reads and keeps defaults/validation understandable.
```

## 008 - Refactor before TypeScript

Status: accepted

The project should be structurally clear before migrating to TypeScript.

Reason:

```txt
TypeScript makes code safer, but it does not automatically make architecture clearer.
Migrating messy architecture to TypeScript would lock in confusion.
```

## 009 - TypeScript should not overcomplicate the project

Status: accepted

When migrating to TypeScript:

```txt
use simple types
keep feature-specific types in the feature
use shared/types only when truly shared
avoid unnecessary generics
avoid any unless justified
```

Reason:

```txt
The project should remain understandable for a junior developer.
```

## 010 - Keep docs centralized

Status: accepted

Long documentation belongs in:

```txt
docs/
```

The root `README.md` should be a short entry point.

Reason:

```txt
A short README helps new readers start quickly.
Detailed docs are easier to maintain when split by topic.
```

## 011 - Do not run seed in production

Status: accepted

Schema and seed are different.

```txt
schema = database structure
seed = demo/development data
```

Reason:

```txt
Production should not be polluted with demo users, demo courses, or fake files.
```

## 012 - Keep OpenAI and Polly isolated in the AI feature/module

Status: accepted

OpenAI and Amazon Polly logic should not leak into unrelated modules.

Frontend:

```txt
feature/ai/
```

Backend:

```txt
modules/ai/
```

Reason:

```txt
AI provider logic is complex and can change.
Keeping it isolated makes it safer to replace or refactor later.
```

## 013 - Use primitives for repeated UI patterns

Status: accepted

Reusable patterns should become primitives.

Examples:

```txt
AppButton for text buttons
IconButton for icon-only buttons
StatusPill for badges/status
FloatingMenu for dropdown menus
EmptyText for empty states
ConfirmDialog for confirmation modals
```

Reason:

```txt
The app should look consistent without every feature inventing its own mini design system.
```

## 014 - Do not create abstractions too early

Status: accepted

Not everything needs to be shared immediately.

Reason:

```txt
Premature abstraction can make the code harder to understand.
It is better to duplicate a little inside features than to create a confusing shared layer.
```

## 015 - Backend controllers should stay thin

Status: accepted

Backend controllers should not contain business logic.

Reason:

```txt
Controllers are HTTP adapters.
Services should own business decisions.
Repositories should own database access.
```

## 016 - Socket logic should not duplicate business rules

Status: accepted

Socket.IO should coordinate realtime updates, not become a second backend business layer.

Reason:

```txt
Duplicated logic between HTTP and socket flows causes bugs.
Socket handlers should use services or shared domain logic where possible.
```

## 017 - Keep commit history meaningful

Status: accepted

Major work should be separated into meaningful commits.

Examples:

```txt
refactor(backend): reorganize modules and database setup
refactor(frontend): reorganize features and shared UI
docs: centralize project documentation
chore: migrate UniChat to TypeScript
```

Reason:

```txt
Small meaningful commits make debugging and reviewing easier.
```

## 018 - Prefer readability over cleverness

Status: accepted

The project is meant to be understood and evolved.

Reason:

```txt
A junior developer should be able to enter the codebase and understand the mental map.
Advanced abstractions are not useful if they hide the flow.
```
