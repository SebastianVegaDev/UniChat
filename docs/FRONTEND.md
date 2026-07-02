# Frontend Documentation

The frontend is a Vite React application organized by features. The main goal is to keep UI, helpers, hooks, API calls, and mappers separated.

The frontend should be easy to understand by reading the folder names.

## Frontend structure

```txt
frontend/src/
  App.jsx
  main.jsx
  index.css

  feature/
  shared/
```

## Feature-first architecture

Most application code belongs inside `feature/`.

```txt
feature/
  admin/
  ai/
  auth/
  bootstrap/
  course/
  course-calendar/
  course-chat/
  home/
  news/
  not-found/
  preferences/
  realtime/
  sidebar/
```

Each feature owns its own UI and logic.

A feature can contain:

```txt
api/
components/
context/
helpers/
hooks/
mappers/
pages/
types/
```

Not every feature needs every folder.

## Shared architecture

`shared/` is only for reusable infrastructure and UI.

```txt
shared/
  api/
  app/
  auth/
  config/
  routes/
  storage/
  ui/
```

## Shared UI

After the refactor, `shared/ui` should only contain reusable visual building blocks.

```txt
shared/ui/
  heroes/
  layouts/
  primitives/
```

Recommended structure:

```txt
shared/ui/primitives/
  button/
    AppButton.jsx
    AppButton.css

  icon-button/
    IconButton.jsx
    IconButton.css

  status/
    StatusPill.jsx
    StatusPill.css

  empty/
    EmptyText.jsx
    EmptyText.css

  menu/
    FloatingMenu.jsx
    FloatingMenu.css

  modal/
    ConfirmDialog.jsx
    ConfirmDialog.css
```

## The most important frontend rule

```txt
If a component belongs to one feature, it goes inside that feature.
If a component is truly reused across features, it can go in shared.
```

Wrong:

```txt
shared/ui/content/admin/AdminContent.jsx
shared/ui/content/chat/ChatContent.jsx
shared/ui/forms/preferences/PreferencesForm.jsx
```

Correct:

```txt
feature/admin/components/AdminContent.jsx
feature/course-chat/components/ChatContent.jsx
feature/preferences/components/PreferencesForm.jsx
```

## Component philosophy

Components should mostly render UI.

They should not contain:

```txt
large data transformations
localStorage details
API endpoint strings
complex business rules
large helper functions
```

Those belong in:

```txt
helpers/
api/
hooks/
mappers/
shared/storage/
shared/config/
```

## JSX and CSS pairing

For readability, most components should have their own CSS next to them.

Example:

```txt
ChatMessageItem.jsx
ChatMessageItem.css
```

This makes it easy to find the visual behavior of each component.

## Pages

Pages coordinate feature data and render the main component tree.

Example:

```txt
CoursePage.jsx
  -> useBootstrap
  -> mapCourseData
  -> CourseHero
  -> CourseContent
```

Pages should not become huge UI files.

## Mappers

Mappers transform backend/bootstrap data into UI-friendly data.

Example:

```txt
feature/home/mappers/home.mapper.js
feature/course/mappers/course.mapper.js
feature/course-chat/mappers/courseChat.mapper.js
```

A mapper should answer:

```txt
What shape does this page need to render?
```

The UI should not know too much about raw backend structure.

## API files

API files contain HTTP calls.

Example:

```txt
feature/admin/api/admin.api.js
feature/ai/api/ai.api.js
```

Components should not hardcode API endpoints.

Good:

```js
askAiResources({ question, history })
```

Avoid inside components:

```js
apiPost("/ai/resources/ask", ...)
```

## Hooks

Hooks hold stateful behavior and effects.

Examples:

```txt
useBootstrap
useCourseChatActions
useCourseCalendarActions
useAiSpeech
useRealtime
```

A hook is a good place for:

```txt
state
effects
subscriptions
handlers that coordinate API + state updates
```

## Helpers

Helpers contain non-UI logic.

Examples:

```txt
chatAttachments.js
chatMessages.js
calendarEvents.js
calendarForms.js
courseResources.js
homeQuickAccess.js
preferencesFormValues.js
```

Good helper responsibilities:

```txt
format a value
filter a list
calculate a menu position
normalize messages
build FormData
generate storage keys
```

## Auth and session storage

Auth/session data should go through:

```txt
shared/auth/sessionStorage.js
shared/storage/localStorage.js
```

Random components should not call `localStorage` directly.

Correct:

```js
import { hasAuthSession } from "../auth/sessionStorage.js";
```

Avoid:

```js
localStorage.getItem("token")
```

## Environment variables

Frontend environment variables should be centralized in:

```txt
shared/config/env.js
```

Random files should not call `import.meta.env` directly.

Expected variables:

```txt
VITE_API_URL
VITE_SOCKET_URL
VITE_GOOGLE_CLIENT_ID
```

## Layouts

Reusable layouts live in:

```txt
shared/ui/layouts/
```

Examples:

```txt
SectionLayout
LoadingLayout
```

Feature-specific layouts should stay in their feature.

## Heroes

Generic page hero lives in:

```txt
shared/ui/heroes/section/SectionHero.jsx
```

Feature-specific hero, like course hero, should live in its feature:

```txt
feature/course/components/CourseHero.jsx
```

## Feature summaries

### Auth

```txt
feature/auth/
  api/
  components/
  pages/
```

Owns login/register UI and auth API calls.

### Admin

```txt
feature/admin/
  api/
  components/
  helpers/
  mappers/
  pages/
```

Owns admin dashboard, panels, tabs, forms, and admin actions.

### Home

```txt
feature/home/
  components/
  helpers/
  mappers/
  pages/
```

Owns dashboard cards, today classes, next class, latest news, and quick access.

### News

```txt
feature/news/
  components/
  mappers/
  pages/
```

Owns news list and news cards.

### Course

```txt
feature/course/
  components/
  helpers/
  hooks/
  mappers/
  pages/
```

Owns course hero, course actions, information panel, resource panels, resource forms, and resource helpers.

### Course Calendar

```txt
feature/course-calendar/
  components/
  helpers/
  hooks/
  mappers/
  pages/
```

Owns FullCalendar integration, event forms, event menus, and pending calendar panel.

### Course Chat

```txt
feature/course-chat/
  components/
  helpers/
  hooks/
  mappers/
  pages/
```

Owns channels, messages, reactions, pinned messages, composer, photo attachments, and chat behavior.

### Preferences

```txt
feature/preferences/
  components/
  context/
  helpers/
```

Owns preferences form, preferences context, and preference helpers.

### AI

```txt
feature/ai/
  api/
  components/
  helpers/
  hooks/
```

Owns the public AI widget, AI chat cache, OpenAI question flow, and Amazon Polly speech hook.

## CSS rules

Use CSS variables from the app theme:

```txt
--app-background
--app-surface
--app-surface-soft
--app-border-color
--app-text-color
--app-muted-text-color
--app-accent-color
--app-accent-hover-color
--app-accent-soft-color
--app-accent-border-color
```

Avoid creating feature-specific design systems. Features should look like the same app.

## Frontend validation

From root:

```powershell
npm --prefix frontend install
npm --prefix frontend run lint
npm --prefix frontend run build
```

Search for old shared UI imports:

```powershell
Get-ChildItem ".\frontend\src" -Recurse -File | Select-String -Pattern "shared/ui/content","shared/ui/forms","shared/ui/states","shared/ui/ai"
```

Search for direct localStorage usage:

```powershell
Get-ChildItem ".\frontend\src" -Recurse -File | Select-String -Pattern "localStorage"
```

Ideally, only shared storage/auth files should directly touch browser storage.

## TypeScript notes

When migrating frontend to TypeScript:

```txt
.jsx -> .tsx
.js helpers/api/mappers -> .ts
component props should be typed clearly
feature types should live near the feature
shared types only if used by multiple features
avoid any unless necessary
avoid complex types that hide the code
```

TypeScript should make the current architecture safer, not replace it.
