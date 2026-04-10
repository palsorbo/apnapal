import { Hono } from 'hono';
import type { Env, LegacySession, LegacyMessage, LegacyUserCharacterMemory, ClaudeResponse } from '../types';
import { getSupabaseClient } from '../services/supabase';

const app = new Hono();

// Legacy in-memory storage (Backward Compatibility)
const legacySessions: Record<string, LegacySession> = {};
const legacyMessages: Record<string, Array<LegacyMessage>> = {};
const legacyUserCharacterMemory: Record<string, LegacyUserCharacterMemory> = {};

const SYSTEM_PROMPT = 'You are a helpful assistant.';

const FACT_EXTRACTION_PROMPT = `Review this conversation and extract factual information about the user.
Only extract verifiable facts (name, location, preferences, occupation, relationships, etc.)
Not emotions or temporary states.

Output format (one fact per line, start each with "- "):
- Fact 1
- Fact 2

If no new facts found, output:
- No new facts`;

// POST /legacy/chat - Legacy chat endpoint
app.post('/chat', async (c) => {
    const env = c.env as Env | undefined;
    const body = await c.req.json();
    const { message, sessionId, characterId } = body;

    // Validate characterId
    if (!characterId) {
        return c.json({ error: 'Missing required field: characterId' }, 400);
    }

    // Basic validation
    if (!message || !sessionId) {
        return c.json({ error: 'Missing required fields: message and sessionId' }, 400);
    }

    // Get or create session with metadata
    if (!legacySessions[sessionId]) {
        legacySessions[sessionId] = {
            id: sessionId,
            created_at: Date.now(),
            credits: 30
        };
        legacyMessages[sessionId] = [];
    }

    // Get or initialize user-character memory
    const memoryKey = `${sessionId}_${characterId}`;
    if (!legacyUserCharacterMemory[memoryKey]) {
        legacyUserCharacterMemory[memoryKey] = {
            userId: sessionId,
            characterId: characterId,
            facts: [],
            updatedAt: Date.now()
        };
    }

    // Build system prompt with user facts
    const userFacts = legacyUserCharacterMemory[memoryKey].facts;
    const systemPromptWithFacts = userFacts.length > 0
        ? `${SYSTEM_PROMPT}\n\nUser Facts (remember these):\n${userFacts.map(f => `- ${f}`).join('\n')}`
        : SYSTEM_PROMPT;

    // Check credits before processing
    if (legacySessions[sessionId].credits <= 0) {
        return c.json({ error: "No credits left", paywall: true }, 403);
    }

    // Fetch last 5 messages from session for context building
    const sessionMessages = legacyMessages[sessionId] || [];
    const context = sessionMessages.slice(-5);

    // Build messages array for Claude API
    const messagesForClaude = [...context, { role: 'user', content: message }];

    // Get API key from environment
    const anthropicApiKey = env?.ANTHROPIC_API_KEY || '';
    let assistantResponse = 'Hello beta...';

    // Call Claude API if key is available
    if (anthropicApiKey) {
        try {
            const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'X-API-Key': anthropicApiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1024,
                    system: systemPromptWithFacts,
                    messages: messagesForClaude
                })
            });

            if (claudeResponse.ok) {
                const data = await claudeResponse.json() as ClaudeResponse;
                assistantResponse = data.content[0].text;
            } else {
                console.error('Claude API error:', await claudeResponse.text());
            }
        } catch (error) {
            console.error('Error calling Claude API:', error);
        }
    }

    // Deduct credit after successful response
    legacySessions[sessionId].credits -= 1;

    // Add user message to session with timestamp
    legacyMessages[sessionId].push({
        role: 'user',
        content: message,
        created_at: Date.now()
    });

    // Add assistant response to session with timestamp
    legacyMessages[sessionId].push({
        role: 'assistant',
        content: assistantResponse,
        created_at: Date.now()
    });

    // Memory cap: keep only last 20 messages
    if (legacyMessages[sessionId].length > 20) {
        legacyMessages[sessionId] = legacyMessages[sessionId].slice(-20);
    }

    // Fact extraction: trigger every 5 messages
    let extractedFacts: string[] = [];
    if (anthropicApiKey && legacyMessages[sessionId].length % 5 === 0 && legacyMessages[sessionId].length > 0) {
        try {
            const recentMessages = legacyMessages[sessionId].slice(-10);
            const conversationText = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
            const existingFactsText = userFacts.length > 0 ? `Existing facts:\n${userFacts.map(f => `- ${f}`).join('\n')}` : '';

            const factResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'X-API-Key': anthropicApiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 512,
                    system: FACT_EXTRACTION_PROMPT,
                    messages: [
                        { role: 'user', content: `${conversationText}\n\n${existingFactsText}` }
                    ]
                })
            });

            if (factResponse.ok) {
                const factData = await factResponse.json() as ClaudeResponse;
                const factText = factData.content[0].text;
                const newFacts = factText
                    .split('\n')
                    .map((line: string) => line.replace(/^-\s*/, '').trim())
                    .filter((line: string) => line && line !== 'No new facts');

                // Merge with existing facts (deduplicate)
                const allFacts = [...userFacts];
                for (const fact of newFacts) {
                    if (!allFacts.some((f: string) => f.toLowerCase() === fact.toLowerCase())) {
                        allFacts.push(fact);
                    }
                }

                legacyUserCharacterMemory[memoryKey] = {
                    ...legacyUserCharacterMemory[memoryKey],
                    facts: allFacts,
                    updatedAt: Date.now()
                };
                extractedFacts = newFacts;

                console.log('Extracted facts:', extractedFacts);
            }
        } catch (error) {
            console.error('Error extracting facts:', error);
        }
    }

    // Return response
    return c.json({
        reply: assistantResponse,
        sessionId: sessionId,
        characterId: characterId,
        credits: legacySessions[sessionId].credits,
        context: context,
        history: legacyMessages[sessionId],
        memory: {
            facts: legacyUserCharacterMemory[memoryKey].facts,
            extractedThisTurn: extractedFacts
        }
    });
});

export default app;