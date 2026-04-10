# Kirdar Backend API Documentation

## Overview

This is a Cloudflare Workers backend for an AI character conversation platform. It uses Supabase for database storage and Claude API for AI responses.

## API Endpoints

### Authentication

All authenticated endpoints require an `x-user-id` header containing a valid UUID of the user.

### Legacy Endpoints (Backward Compatibility)

These endpoints maintain compatibility with the original in-memory system.

#### `POST /legacy/chat`
Legacy chat endpoint with in-memory storage.

**Request Body:**
```json
{
  "message": "Hello!",
  "sessionId": "user-123",
  "characterId": "character-uuid"
}
```

**Response:**
```json
{
  "reply": "Hello! How can I help you today?",
  "sessionId": "user-123",
  "characterId": "character-uuid",
  "credits": 29,
  "context": [],
  "history": [],
  "memory": {
    "facts": [],
    "extractedThisTurn": []
  }
}
```

---

### Profile Endpoints

#### `GET /profile`
Get the current user's profile.

**Headers:**
- `x-user-id`: UUID of the user

**Response:**
```json
{
  "id": "user-uuid",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### `PATCH /profile`
Update the current user's profile.

**Headers:**
- `x-user-id`: UUID of the user

**Request Body:**
```json
{
  "name": "Jane Doe"
}
```

**Response:**
```json
{
  "id": "user-uuid",
  "name": "Jane Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### Characters Endpoints

#### `GET /characters`
List all active characters with optional language filter.

**Query Parameters:**
- `lang` (optional): Filter by language (e.g., "en", "ar", "hi")

**Response:**
```json
[
  {
    "id": "character-uuid",
    "name": "Scheherazade",
    "persona_type": "storyteller",
    "description": "A mystical storyteller from ancient Persia",
    "system_prompt": "You are Scheherazade...",
    "avatar_url": "https://...",
    "is_active": true,
    "version": 1,
    "voice_id": "voice-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### `GET /characters/:id`
Get details of a specific character.

**Response:**
```json
{
  "id": "character-uuid",
  "name": "Scheherazade",
  "persona_type": "storyteller",
  "description": "A mystical storyteller from ancient Persia",
  "system_prompt": "You are Scheherazade...",
  "avatar_url": "https://...",
  "is_active": true,
  "version": 1,
  "voice_id": "voice-uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### Conversations Endpoints

#### `GET /conversations`
List the current user's conversations, ordered by most recent.

**Headers:**
- `x-user-id`: UUID of the user

**Query Parameters:**
- `limit` (optional): Number of conversations to return (default: 20, max: 50)

**Response:**
```json
[
  {
    "id": "conversation-uuid",
    "user_id": "user-uuid",
    "character_id": "character-uuid",
    "memory": {},
    "started_at": "2024-01-01T00:00:00Z",
    "last_message_at": "2024-01-02T00:00:00Z",
    "characters": {
      "id": "character-uuid",
      "name": "Scheherazade",
      "avatar_url": "https://...",
      "persona_type": "storyteller"
    }
  }
]
```

#### `POST /conversations/:character_id`
Start a new conversation with a character, or return existing one if already exists.

**Headers:**
- `x-user-id`: UUID of the user

**Response (201 Created for new, 200 OK for existing):**
```json
{
  "id": "conversation-uuid",
  "user_id": "user-uuid",
  "character_id": "character-uuid",
  "memory": {},
  "started_at": "2024-01-01T00:00:00Z",
  "last_message_at": "2024-01-01T00:00:00Z"
}
```

#### `GET /conversations/:id/messages`
Load message history for a conversation with pagination.

**Headers:**
- `x-user-id`: UUID of the user

**Query Parameters:**
- `cursor` (optional): ISO timestamp for pagination (returns messages before this time)
- `limit` (optional): Number of messages to return (default: 20, max: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": "message-uuid",
      "conversation_id": "conversation-uuid",
      "role": "user",
      "type": "text",
      "content": "Hello!",
      "audio_url": null,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "message-uuid",
      "conversation_id": "conversation-uuid",
      "role": "assistant",
      "type": "text",
      "content": "Hello! How can I help you?",
      "audio_url": null,
      "created_at": "2024-01-01T00:00:01Z"
    }
  ],
  "nextCursor": "2024-01-01T00:00:01Z",
  "hasMore": false
}
```

---

### Messaging Endpoints

#### `POST /conversations/:id/message`
Send a text message to a conversation.

**Headers:**
- `x-user-id`: UUID of the user

**Request Body:**
```json
{
  "content": "Tell me a story"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": "message-uuid",
    "content": "Tell me a story",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "assistantMessage": {
    "id": "message-uuid",
    "content": "Once upon a time...",
    "created_at": "2024-01-01T00:00:01Z"
  },
  "credits": 19,
  "conversationId": "conversation-uuid"
}
```

**Cost:** 1 credit per message

#### `POST /conversations/:id/voice`
Send a voice message to a conversation.

**Headers:**
- `x-user-id`: UUID of the user

**Request Body:**
```json
{
  "audio_url": "https://storage.example.com/audio.mp3",
  "transcription": "Tell me a story"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": "message-uuid",
    "content": "Tell me a story",
    "audio_url": "https://storage.example.com/audio.mp3",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "assistantMessage": {
    "id": "message-uuid",
    "content": "Once upon a time...",
    "created_at": "2024-01-01T00:00:01Z"
  },
  "credits": 18,
  "conversationId": "conversation-uuid"
}
```

**Cost:** 2 credits per voice message

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input (e.g., missing required fields, invalid UUID format)
- `401 Unauthorized`: Missing or invalid user authentication
- `403 Forbidden`: Insufficient credits or access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Credit-Related Errors

When credits are insufficient:

```json
{
  "error": "Insufficient credits",
  "paywall": true,
  "balance": 0
}
```

---

## Database Schema

The application uses the following PostgreSQL tables (defined in `sql.sql`):

- `profiles`: User profiles (extends Supabase auth.users)
- `characters`: AI character definitions
- `conversations`: User conversations with characters
- `messages`: Message history
- `user_character_memory`: Per-user, per-character memory storage
- `credits`: User credit balances
- `credit_transactions`: Credit transaction history

---

## Environment Variables

Required environment variables:

- `ANTHROPIC_API_KEY`: Claude API key for AI responses
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

---

## Notes

1. **Conversation Reuse**: `POST /conversations/:character_id` returns an existing conversation if one exists between the user and character, rather than creating a new one.

2. **Message Pagination**: Use the `nextCursor` from the response as the `cursor` parameter to load older messages.

3. **Credit System**: 
   - Text messages cost 1 credit
   - Voice messages cost 2 credits
   - New users receive 20 free credits on signup

4. **Memory Management**: The system automatically extracts factual information about users from conversations every 5 messages and stores it in `user_character_memory`.

5. **AI Integration**: All messaging endpoints use Claude API (claude-3-haiku) for generating responses, with character-specific system prompts and user memory context.