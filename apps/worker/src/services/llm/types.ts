import type { Env } from '../../types';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

export interface GenerateChatReplyInput {
    env: Env;
    systemPrompt: string;
    messages: ChatMessage[];
    maxTokens?: number;
    timeoutMs?: number;
}

export interface LlmProvider {
    generateChatReply(input: GenerateChatReplyInput): Promise<string>;
}
