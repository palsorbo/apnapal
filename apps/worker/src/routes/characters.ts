import { Hono } from 'hono';
import type { Env } from '../types';
import { getSupabaseClient } from '../services/supabase';

const app = new Hono();

// GET /characters - List characters (with optional language filter)
app.get('/', async (c) => {
    try {
        const env = c.env as Env;
        const lang = c.req.query('lang');
        const supabase = getSupabaseClient(env);

        let query = supabase
            .from('characters')
            .select('id, name, persona_type, language_code, description, avatar_url')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        // If language filter is provided, filter by exact language_code
        if (lang) {
            query = query.eq('language_code', lang);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return c.json(data || []);
    } catch (error: any) {
        console.error('Error fetching characters:', error);
        return c.json({ error: 'Failed to fetch characters', details: error.message }, 500);
    }
});

// GET /characters/:id - Get single character details
// if we want to show idv character details
app.get('/:id', async (c) => {
    try {
        const env = c.env as Env;
        const characterId = c.req.param('id');
        const supabase = getSupabaseClient(env);

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(characterId)) {
            return c.json({ error: 'Invalid character ID format' }, 400);
        }

        const { data, error } = await supabase
            .from('characters')
            .select('id, name, persona_type, language_code, description, avatar_url')
            .eq('id', characterId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return c.json({ error: 'Character not found' }, 404);
            }
            throw error;
        }

        return c.json(data);
    } catch (error: any) {
        console.error('Error fetching character:', error);
        return c.json({ error: 'Failed to fetch character', details: error.message }, 500);
    }
});

export default app;