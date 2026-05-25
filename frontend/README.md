# UniChat Frontend

Vite React frontend for UniChat. It provides the student, teacher, and admin UI, including realtime chat, preferences, course resources, calendar pages, announcements, and the UniChat AI widget.

## Stack

- React 19
- Vite
- React Router
- Socket.IO client
- FullCalendar
- Lucide icons
- React Toastify

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Environment

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=
VITE_SOCKET_URL=http://localhost:3000
```

For Docker/nginx, the frontend is built with:

```env
VITE_API_URL=/api
VITE_SOCKET_URL=/
```

That lets nginx proxy `/api`, `/uploads`, and `/socket.io` to the backend container.

## Main Routes

- `/login`
- `/register`
- `/`
- `/admin`
- `/news`
- `/course/:courseSlug`
- `/course/:courseSlug/chat`
- `/course/:courseSlug/calendar`

## Notes

- Generated `dist/` output is ignored and should not be committed.
- Auth state is currently stored in `localStorage`.
- Uploaded assets and API-relative file URLs are normalized through `shared/api/config.js`.
- The public AI widget caches recent messages in `localStorage` per user.
- The admin page is protected both in UI and backend; backend role checks are the source of truth.

## Validation

```bash
npm run build
npm run lint
```
