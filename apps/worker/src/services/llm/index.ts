import { AnthropicProvider } from './providers/anthropic';
import type { GenerateChatReplyInput } from './types';

const provider = new AnthropicProvider();

export async function generateChatReply(input: GenerateChatReplyInput) {
    return provider.generateChatReply(input);
}

export type { ChatMessage, GenerateChatReplyInput } from './types';
