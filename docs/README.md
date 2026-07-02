# UniChat Docs

This folder contains the long-form documentation for UniChat.

The root `README.md` should stay short. Detailed explanations live here.

## Documents

```txt
ARCHITECTURE.md   Overall mental map of the project
BACKEND.md        Backend architecture and module rules
FRONTEND.md       Frontend feature/shared architecture
DATABASE.md       PostgreSQL schema, seed, and database rules
DOCKER.md         Docker Compose and container workflow
ENVIRONMENT.md    Environment variables and secrets
AI.md             OpenAI, Amazon Polly, and AI widget architecture
DEVELOPMENT.md    Local development commands and workflow
DEPLOYMENT.md     Production deployment notes
DECISIONS.md      Architecture decisions and reasoning
```

## Recommended reading order

If you are new to the project:

```txt
1. ARCHITECTURE.md
2. FRONTEND.md
3. BACKEND.md
4. DATABASE.md
5. DEVELOPMENT.md
```

If you are deploying:

```txt
1. ENVIRONMENT.md
2. DOCKER.md
3. DEPLOYMENT.md
```

If you are working on AI:

```txt
1. AI.md
2. BACKEND.md
3. FRONTEND.md
```

If you are changing architecture:

```txt
1. ARCHITECTURE.md
2. DECISIONS.md
```

## Main rule

UniChat favors clarity:

```txt
features own their code
shared is truly shared
helpers hold non-UI logic
hooks hold state/effects
api files hold HTTP calls
mappers transform data
docs explain why
```
