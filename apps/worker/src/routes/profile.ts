import { Hono } from 'hono';
import type { Env } from '../types';
import { getSupabaseClient } from '../services/supabase';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Variables: { userId: string } }>();

// GET /profile - Get user profile
app.get('/', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const supabase = getSupabaseClient(env);

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return c.json({ error: 'Profile not found' }, 404);
            }
            throw error;
        }

        return c.json(data);
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return c.json({ error: 'Failed to fetch profile', details: error.message }, 500);
    }
});

// PATCH /profile - Update user profile
app.patch('/', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const body = await c.req.json();
        const { name, preferred_language } = body;
        const supabase = getSupabaseClient(env);

        const updates: Record<string, string> = {};

        // Validate name if provided
        if (name !== undefined) {
            if (typeof name !== 'string') {
                return c.json({ error: 'Name must be a string' }, 400);
            }
            if (name.length > 100) {
                return c.json({ error: 'Name must be 100 characters or less' }, 400);
            }
            updates.name = name;
        }

        // Validate preferred_language if provided
        if (preferred_language !== undefined) {
            if (typeof preferred_language !== 'string') {
                return c.json({ error: 'Preferred language must be a string' }, 400);
            }
            if (preferred_language.length > 50) {
                return c.json({ error: 'Preferred language must be 50 characters or less' }, 400);
            }
            updates.preferred_language = preferred_language;
        }

        if (Object.keys(updates).length === 0) {
            return c.json({ error: 'No valid fields provided for update' }, 400);
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return c.json(data);
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return c.json({ error: 'Failed to update profile', details: error.message }, 500);
    }
});

export default app;