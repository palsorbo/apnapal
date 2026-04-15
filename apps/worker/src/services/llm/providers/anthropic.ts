import type { GenerateChatReplyInput, LlmProvider } from '../types';

interface AnthropicMessage {
    type: string;
    text: string;
}

interface AnthropicResponse {
    content: AnthropicMessage[];
}

export class AnthropicProvider implements LlmProvider {
    async generateChatReply(input: GenerateChatReplyInput): Promise<string> {
        const apiKey = input.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            throw new Error('LLM provider is not configured');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? 15000);

        let response: Response;
        try {
            response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: input.maxTokens ?? 550,
                    system: input.systemPrompt,
                    messages: input.messages
                }),
                signal: controller.signal
            });
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new Error('LLM provider request timed out');
            }

            throw error;
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            console.log("error raw response", await response.text())
            throw new Error(await response.text());
        }

        const data = await response.json() as AnthropicResponse;
        const reply = data.content[0]?.text?.trim();
        console.log("raw response", data)

        if (!reply) {
            throw new Error('LLM provider returned an empty response');
        }

        return reply;
    }
}
