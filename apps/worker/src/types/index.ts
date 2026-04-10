// Environment variables interface for Cloudflare Workers
export interface Env {
    ANTHROPIC_API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
}

// Database types matching the SQL schema
export interface Profile {
    id: string;
    name: string | null;
    created_at: string;
}

export interface Character {
    id: string;
    name: string;
    persona_type: string;
    description: string | null;
    system_prompt: string;
    avatar_url: string | null;
    is_active: boolean;
    version: number;
    voice_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    id: string;
    user_id: string;
    character_id: string;
    memory: Record<string, any>;
    started_at: string;
    last_message_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    type: 'text' | 'voice';
    content: string;
    audio_url: string | null;
    created_at: string;
}

export interface CreditTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: string;
    reference_id: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
}

// Legacy in-memory storage types (for backward compatibility)
export interface LegacySession {
    id: string;
    created_at: number;
    credits: number;
}

export interface LegacyMessage {
    role: string;
    content: string;
    created_at: number;
}

export interface LegacyUserCharacterMemory {
    userId: string;
    characterId: string;
    facts: string[];
    updatedAt: number;
}

// Claude API response types
export interface ClaudeMessage {
    type: string;
    text: string;
}

export interface ClaudeResponse {
    content: ClaudeMessage[];
}