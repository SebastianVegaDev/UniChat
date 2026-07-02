# AI Documentation

UniChat has an AI assistant that helps users ask questions about course resources, tasks, exams, events, next classes, and study-related information.

The AI feature uses:

```txt
OpenAI for answers
Amazon Polly for text-to-speech
Frontend AI widget for user interaction
Backend AI module for provider logic
```

## High-level AI flow

```txt
User opens AI widget
  -> asks a question
    -> frontend sends question + recent history
      -> backend AI endpoint
        -> searches/uses app context
        -> calls OpenAI
        -> returns answer + related resources
          -> frontend renders bot message
            -> user can play audio
              -> backend Polly endpoint
                -> Amazon Polly
                  -> frontend plays audio
```

## Frontend AI structure

```txt
frontend/src/feature/ai/
  api/
    ai.api.js

  components/
    PublicAiWidget.jsx
    AiWidgetButton.jsx
    AiWidgetPanel.jsx
    AiMessageList.jsx
    AiMessageItem.jsx
    AiResourceList.jsx
    AiTypingMessage.jsx
    AiQuestionForm.jsx

  helpers/
    aiChatCache.js
    aiMessages.js
    aiSpeech.js

  hooks/
    useAiSpeech.js
```

## Frontend responsibilities

### `PublicAiWidget`

Owns the top-level widget state:

```txt
open/closed state
messages state
question state
loading state
outside click behavior
cache saving
submit question coordination
```

It should not contain low-level API or audio implementation details.

### `ai.api.js`

Owns AI HTTP calls:

```txt
askAiResources
fetchAiSpeech
```

Components should not hardcode AI endpoints.

### `aiMessages.js`

Owns AI message helpers:

```txt
initial message
normalizing cached messages
creating user messages
creating bot messages
creating error messages
building recent history
```

### `aiChatCache.js`

Owns user-scoped AI chat cache.

It should use:

```txt
shared/auth/sessionStorage.js
shared/storage/localStorage.js
```

The AI feature should not call `localStorage` directly.

### `aiSpeech.js`

Owns speech transformation helpers:

```txt
clean markdown text for speech
convert base64 audio into object URL
```

### `useAiSpeech.js`

Owns audio state and playback:

```txt
current speaking message
audio instance
audio URL cleanup
Polly result cache
play/stop behavior
error handling
```

## Backend AI responsibilities

The backend AI module owns:

```txt
OpenAI communication
Amazon Polly communication
resource-aware answers
event/class answers
next class answers
speech endpoint
AI response shaping
```

Provider-specific logic should stay inside the AI module.

Other backend modules should not know the details of OpenAI or Polly.

## AI endpoints

The frontend expects endpoints like:

```txt
POST /ai/resources/ask
POST /ai/speech
```

### Ask endpoint

Input conceptually:

```json
{
  "question": "What should I study for my exam?",
  "history": []
}
```

Output conceptually:

```json
{
  "answer": "You should review...",
  "resources": [],
  "intent": "resources",
  "courseFilter": null
}
```

### Speech endpoint

Input conceptually:

```json
{
  "text": "AI answer text"
}
```

Output conceptually:

```json
{
  "audioBase64": "...",
  "contentType": "audio/mpeg"
}
```

## OpenAI

OpenAI should be used only from the backend.

The frontend should never receive or know the OpenAI API key.

Backend config:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-nano
```

## Amazon Polly

Amazon Polly should be used only from the backend.

Backend config:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_POLLY_VOICE_ID=Enrique
```

The frontend receives audio data from the backend and plays it in the browser.

## AI cache

The frontend stores recent AI messages per user.

The cache should be user-scoped so different users do not share AI history in the same browser.

Cache should be normalized to avoid old/broken shapes.

Important helpers:

```txt
getCachedAiMessages
saveCachedAiMessages
normalizeAiMessages
```

## AI history

The frontend should not send the full infinite chat history.

It sends only recent history.

This keeps requests smaller and avoids unnecessary context growth.

## AI answer types

The AI can answer about:

```txt
course resources
tasks
exams
calendar events
next class
study help
general course context
```

Future AI features should keep the same structure:

```txt
frontend feature/ai
backend modules/ai
provider-specific logic inside AI module
```

## AI safety and reliability rules

```txt
Do not expose provider keys to frontend.
Do not trust AI output as database commands.
Do not let AI bypass authorization.
Do not send unnecessary sensitive user data to providers.
Do not mix AI provider code into unrelated modules.
Log enough for debugging but avoid logging secrets.
```

## AI code rules

When changing AI:

```txt
API calls go in feature/ai/api.
Message normalization goes in helpers.
Speech/audio goes in useAiSpeech and aiSpeech helper.
Widget UI stays in components.
Backend provider logic stays in backend AI module.
```

## Future improvements

Possible future AI improvements:

```txt
streaming responses
better resource ranking
course-specific memory
admin AI tools
teacher-only AI tools
summaries of unread chat
study plans
quiz generation
S3 audio caching
provider abstraction for OpenAI/other models
```

Add these only after the current architecture stays stable.
