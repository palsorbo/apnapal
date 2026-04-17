import { Hono } from 'hono';
import type { Env } from '../types';
import { getSupabaseClient } from '../services/supabase';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Variables: { userId: string } }>();
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseLimit(rawLimit: string | undefined, defaultValue = 20) {
    const parsed = Number.parseInt(rawLimit || String(defaultValue), 10);

    if (!Number.isFinite(parsed) || parsed < 1) {
        return null;
    }

    return Math.min(parsed, 50);
}

// GET /conversations - List user's recent conversations
app.get('/', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const limit = parseLimit(c.req.query('limit'));
        const supabase = getSupabaseClient(env);

        if (limit === null) {
            return c.json({ error: 'Invalid limit. Use a positive integer up to 50.' }, 400);
        }

        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                characters (
                    id,
                    name,
                    avatar_url,
                    persona_type
                )
            `)
            .eq('user_id', userId)
            .order('last_message_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return c.json(data || []);
    } catch (error: any) {
        console.error('Error fetching conversations:', error);
        return c.json({ error: 'Failed to fetch conversations', details: error.message }, 500);
    }
});

// GET /conversations/:id - Get single conversation details
app.get('/:id', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const conversationId = c.req.param('id');
        const supabase = getSupabaseClient(env);

        if (!conversationId || !uuidRegex.test(conversationId)) {
            return c.json({ error: 'Invalid conversation ID format' }, 400);
        }

        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                characters (
                    id,
                    name,
                    avatar_url,
                    persona_type
                )
            `)
            .eq('id', conversationId)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return c.json({ error: 'Conversation not found' }, 404);
            }
            throw error;
        }

        return c.json(data);
    } catch (error: any) {
        console.error('Error fetching conversation:', error);
        return c.json({ error: 'Failed to fetch conversation', details: error.message }, 500);
    }
});

// POST /conversations - Start new conversation or return existing
app.post('/', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const { character_id } = await c.req.json();
        const characterId = character_id as string;

        if (!characterId) {
            return c.json({ error: 'character_id is required in request body' }, 400);
        }

        if (!uuidRegex.test(characterId)) {
            return c.json({ error: 'Invalid character ID format' }, 400);
        }
        const supabase = getSupabaseClient(env);

        // Check if character exists
        const { data: character, error: characterError } = await supabase
            .from('characters')
            .select('id, is_active')
            .eq('id', characterId)
            .single();

        if (characterError) {
            if (characterError.code === 'PGRST116') {
                return c.json({ error: 'Character not found' }, 404);
            }
            throw characterError;
        }

        if (!character.is_active) {
            return c.json({ error: 'Character is no longer active' }, 400);
        }

        // Check if conversation already exists
        const { data: existingConversation, error: existingError } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', userId)
            .eq('character_id', characterId)
            .order('started_at', { ascending: false })
            .limit(1)
            .single();

        if (existingError && existingError.code !== 'PGRST116') {
            throw existingError;
        }

        if (existingConversation) {
            return c.json(existingConversation);
        }

        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
            .from('conversations')
            .insert({
                user_id: userId,
                character_id: characterId,
                memory: {}
            })
            .select()
            .single();

        if (createError) {
            if (createError.code === '23505') {
                const { data: concurrentConversation, error: concurrentError } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('character_id', characterId)
                    .order('started_at', { ascending: false })
                    .limit(1)
                    .single();

                if (concurrentError) {
                    throw concurrentError;
                }

                return c.json(concurrentConversation);
            }
            throw createError;
        }

        return c.json(newConversation, 201);
    } catch (error: any) {
        console.error('Error creating conversation:', error);
        return c.json({ error: 'Failed to create conversation', details: error.message }, 500);
    }
});



// DELETE /conversations/:id - Delete a conversation
app.delete('/:id', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const conversationId = c.req.param('id') as string;
        const supabase = getSupabaseClient(env);

        // Validate UUID format
        if (!uuidRegex.test(conversationId)) {
            return c.json({ error: 'Invalid conversation ID format' }, 400);
        }

        // Verify conversation exists and belongs to user
        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .select('id, user_id')
            .eq('id', conversationId)
            .eq('user_id', userId)
            .single();

        if (convError) {
            if (convError.code === 'PGRST116') {
                return c.json({ error: 'Conversation not found or access denied' }, 404);
            }
            throw convError;
        }

        // Delete the conversation (messages will be deleted via cascade if foreign key has ON DELETE CASCADE)
        const { error: deleteError } = await supabase
            .from('conversations')
            .delete()
            .eq('id', conversationId);

        if (deleteError) {
            throw deleteError;
        }

        return c.json({ message: 'Conversation deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting conversation:', error);
        return c.json({ error: 'Failed to delete conversation', details: error.message }, 500);
    }
});

// GET /conversations/:conversationId/messages - Load message history with pagination
app.get('/:conversationId/messages', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const conversationId = c.req.param('conversationId') as string;
        const cursor = c.req.query('cursor');
        const limit = parseLimit(c.req.query('limit'));
        const supabase = getSupabaseClient(env);

        if (limit === null) {
            return c.json({ error: 'Invalid limit. Use a positive integer up to 50.' }, 400);
        }

        // Validate UUID format
        if (!uuidRegex.test(conversationId)) {
            return c.json({ error: 'Invalid conversation ID format' }, 400);
        }

        // Verify conversation belongs to user
        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .select('id, user_id')
            .eq('id', conversationId)
            .eq('user_id', userId)
            .single();

        if (convError) {
            if (convError.code === 'PGRST116') {
                return c.json({ error: 'Conversation not found or access denied' }, 404);
            }
            throw convError;
        }

        // Build query for messages
        let query = supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .order('id', { ascending: false })
            .limit(limit);

        // If cursor is provided, fetch messages before that timestamp
        if (cursor) {
            const cursorDate = new Date(cursor);
            if (isNaN(cursorDate.getTime())) {
                return c.json({ error: 'Invalid cursor format. Use ISO timestamp.' }, 400);
            }
            query = query.lt('created_at', cursorDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        // Return messages in chronological order (oldest first)
        // Using id as tie-breaker for stable sorting when timestamps are identical
        const messages = (data || []).sort((a, b) => {
            const timeDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (timeDiff !== 0) return timeDiff;
            return a.id.localeCompare(b.id);
        });

        // Provide next cursor for pagination
        const nextCursor = messages.length > 0
            ? messages[0].created_at
            : null;

        return c.json({
            messages,
            nextCursor,
            hasMore: messages.length === limit
        });
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        return c.json({ error: 'Failed to fetch messages', details: error.message }, 500);
    }
});

export default app;
