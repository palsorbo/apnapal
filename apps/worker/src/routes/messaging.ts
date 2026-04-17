import { Hono } from 'hono';
import type { Env } from '../types';
import { getSupabaseClient } from '../services/supabase';
import { authMiddleware } from '../middleware/auth';
import { generateChatReply } from '../services/llm';

const app = new Hono<{ Variables: { userId: string } }>();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BASE_TEMPLATE = `<identity>
    You are a companion connecting with a user on a mobile chat app. You must strictly adopt the persona and identity provided below.
    Never break character. Never refer to yourself as an AI assistant program.
</identity>
<persona_guidelines>
    Keep your responses concise, natural, and engaging. Adopt the tone, language context, and cultural nuances specific to your character.
</persona_guidelines>`;

function errorResponse(c: any, status: number, code: string, message: string, extra: Record<string, unknown> = {}) {
    return c.json({ error: { code, message, ...extra } }, status);
}

type MessageBodyValidation =
    | { content: string; error?: never }
    | { error: string; content?: never };

function validateMessageBody(body: unknown): MessageBodyValidation {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { error: 'Request body must be a JSON object' };
    }

    const content = (body as { content?: unknown }).content;

    if (typeof content !== 'string' || content.trim().length === 0) {
        return { error: 'Message content is required' };
    }

    if (content.length > 4000) {
        return { error: 'Message too long (max 4000 characters)' };
    }

    return { content };
}


app.post('/:conversationId/messages', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const conversationId = c.req.param('conversationId') as string;
        const supabase = getSupabaseClient(env);
        let body: unknown;

        try {
            body = await c.req.json();
        } catch {
            return errorResponse(c, 400, 'invalid_json', 'Request body must be valid JSON');
        }

        const validatedBody = validateMessageBody(body);

        if (validatedBody.error !== undefined) {
            return errorResponse(c, 400, 'invalid_request', validatedBody.error);
        }

        const { content } = validatedBody;

        // Validate UUID format
        if (!uuidRegex.test(conversationId)) {
            return errorResponse(c, 400, 'invalid_conversation_id', 'Invalid conversation ID format');
        }

        // Verify conversation belongs to user (can be skipped by sending characterid from fe)
        // and fetch system prompt (can be move to redis/ cache)

        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .select('*, characters(*)')
            .eq('id', conversationId)
            .eq('user_id', userId)
            .single();

        if (convError) {
            if (convError.code === 'PGRST116') {
                return errorResponse(c, 404, 'conversation_not_found', 'Conversation not found or access denied');
            }
            throw convError;
        }



        // Early credit check for UX. The RPC still re-checks inside the DB transaction.
        // later we can cache or move to some redis / cache
        const { data: creditsData, error: creditsError } = await supabase
            .from('credits')
            .select('balance')
            .eq('user_id', userId)
            .single();

        if (creditsError) {
            if (creditsError.code === 'PGRST116') {
                return errorResponse(c, 404, 'credits_not_found', 'No credits account found');
            }
            throw creditsError;
        }



        // it should be deduction based on type of message.
        if (creditsData.balance < 1) {
            return errorResponse(c, 403, 'insufficient_credits', 'Insufficient credits', {
                paywall: true,
                balance: creditsData.balance
            });
        }

        // Get conversation context (last 10 messages)
        const { data: recentMessages, error: recentMessagesError, count } = await supabase
            .from('messages')
            .select('role, content', { count: 'exact' })
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .order('id', { ascending: false })
            .limit(10);

        if (recentMessagesError) {
            throw recentMessagesError;
        }

        // Get user memory for this character
        const { data: memoryData, error: memoryError } = await supabase
            .from('user_character_memory')
            .select('memory')
            .eq('user_id', userId)
            .eq('character_id', conversation.character_id)
            .single();

        if (memoryError && memoryError.code !== 'PGRST116') {
            throw memoryError;
        }

        const userFacts = memoryData?.memory?.facts || [];
        const factsSection = userFacts.length > 0
            ? `<long_term_facts>\n${userFacts.map((f: string) => `- ${f}`).join('\n')}\n</long_term_facts>`
            : '';

        // 1. Prepare messages for LLM
        const messagesForLlm = (recentMessages || [])
            .reverse()
            .map(m => ({ role: m.role as any, content: m.content }));
        messagesForLlm.push({ role: 'user', content });

        // Phase 1: Short-Term Context (STC) - Detect Mood/Intent (Delta-Only)
        let detectedMood = 'Neutral';
        try {
            const previousMood = conversation.memory?.last_mood || 'Neutral';
            const stcPrompt = `<task_directive>
    Analyze the conversation delta and provide the NEW conversation mood or user intent in EXACTLY one word (e.g., Happy, Curious, Sad, Flirty, Angry, Neutral).
    ONLY output the word. No other text.
</task_directive>
<conversation_context>
    <previous_mood>${previousMood}</previous_mood>
</conversation_context>`;
            
            // Delta-Only: Only send the last 2 messages (Assistant response + User's new message)
            const deltaMessages = messagesForLlm.slice(-2);

            const rawMood = await generateChatReply({
                env,
                systemPrompt: stcPrompt,
                messages: deltaMessages,
                maxTokens: 10,
                timeoutMs: 5000 // Fast timeout for STC
            });
            
            detectedMood = rawMood.trim().replace(/[^\w\s]/gi, '').split(/\s+/)[0] || 'Neutral';
            console.log("Detected Mood (Delta-Only):", detectedMood);
        } catch (error) {
            console.error('STC Call Failed, falling back to Neutral:', error);
            detectedMood = 'Neutral';
        }

        // Phase 2: Persona Response
        let assistantResponse: string = '';
        try {
            const personaSystemPrompt = `${BASE_TEMPLATE}
<character_profile>
    ${conversation.characters.system_prompt}
</character_profile>
<language_context>
    Primary Language Code: ${conversation.characters.language_code}
    Respond strictly in the character's designated language/dialect (e.g., hi = Hinglish/Hindi, bn = Bengali, ta = Tamil).
</language_context>
<user_context>
    ${factsSection}
</user_context>
<conversation_state>
    <current_mood>${detectedMood}</current_mood>
    <memory_history>${JSON.stringify(conversation.memory || {})}</memory_history>
</conversation_state>
<response_directive>
    Provide your direct response to the user in character. Do not include any meta-talk, JSON, tags, or markers like 'REPLY:'.
</response_directive>`;

            assistantResponse = await generateChatReply({
                env,
                systemPrompt: personaSystemPrompt,
                messages: messagesForLlm,
                maxTokens: 1500,
                timeoutMs: 15000
            });
            console.log("Persona Response:", assistantResponse);
        } catch (error) {
            console.error('Persona Generation Failed:', error);
            if (error instanceof Error && error.message === 'LLM provider request timed out') {
                return errorResponse(c, 504, 'llm_timeout', 'Assistant response timed out');
            }
            return errorResponse(c, 502, 'llm_generation_failed', 'Failed to generate assistant response');
        }

        // Phase 3: Persistence & Credits
        const { data: processResult, error: processError } = await supabase.rpc('process_message_with_credits', {
            p_user_id: userId,
            p_conversation_id: conversationId,
            p_user_content: content,
            p_assistant_content: assistantResponse,
            p_credit_amount: 1
        });

        if (processError) {
            throw processError;
        }

        const result = processResult?.[0];

        if (result?.success) {
            // Update conversation memory with the new mood (Phase 1 result)
            c.executionCtx.waitUntil(
                (async () => {
                    await supabase.from('conversations')
                        .update({ 
                            memory: { 
                                ...(conversation.memory || {}), 
                                last_mood: detectedMood,
                                updated_at: new Date().toISOString()
                            } 
                        })
                        .eq('id', conversationId);
                })()
            );

            // Phase 4: Long-Term Memory (LTM) - Background
            const totalMessagesAfterTurn = (count || 0) + 2;
            if (totalMessagesAfterTurn > 0 && totalMessagesAfterTurn % 10 === 0) {
                c.executionCtx.waitUntil(
                    (async () => {
                        try {
                            const extractionPrompt = `<task_definition>
    You are a memory extraction AI. Analyze the conversation transcript and the existing list of facts about the user.
    Extract a distilled list of long-term facts about the user (e.g. name, preferences, personal details).
    - Retain valid old facts.
    - Incorporate new facts.
    - Remove invalid/contradicted facts.
    - Maximum 15 facts.
</task_definition>
<output_format>
    Output STRICTLY a JSON array of strings: ["fact 1", "fact 2"]. Do not add any formatting or tags outside the JSON.
</output_format>`;

                            const transcript = [...messagesForLlm, { role: 'assistant', content: assistantResponse }]
                                .map(m => `${m.role.toUpperCase()}: ${m.content}`)
                                .join('\n');

                            const extractionMessage = `Existing Facts: ${JSON.stringify(userFacts)}\n\nTranscript:\n${transcript}`;

                            const rawExtraction = await generateChatReply({
                                env,
                                systemPrompt: extractionPrompt,
                                messages: [{ role: 'user', content: extractionMessage }],
                                maxTokens: 500,
                                timeoutMs: 15000
                            });

                            const extJsonStr = rawExtraction.replace(/```json\n?|\n?```/gi, '').trim();
                            const newFactsJSON = JSON.parse(extJsonStr);

                            if (Array.isArray(newFactsJSON) && newFactsJSON.length > 0) {
                                const limitedFacts = newFactsJSON.slice(0, 15);
                                await supabase
                                    .from('user_character_memory')
                                    .upsert({
                                        user_id: userId,
                                        character_id: conversation.character_id,
                                        memory: { facts: limitedFacts },
                                        updated_at: new Date().toISOString()
                                    }, { onConflict: 'user_id, character_id' });
                            }
                        } catch (extError) {
                            console.error('LTM Extraction Error:', extError);
                        }
                    })()
                );
            }
        }

        if (!result?.success) {
            if (result?.error_code === 'insufficient_credits') {
                return errorResponse(c, 403, 'insufficient_credits', 'Insufficient credits', {
                    paywall: true,
                    balance: result.balance ?? 0
                });
            }
            throw new Error(`process_message_with_credits failed: ${result?.error_code || 'unknown_error'}`);
        }

        return c.json({
            reply: assistantResponse
        });
    } catch (error: any) {
        console.error('Error sending message:', {
            message: error instanceof Error ? error.message : String(error)
        });
        return errorResponse(c, 500, 'message_send_failed', 'Failed to send message');
    }
});

export default app;
