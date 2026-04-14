import { Context } from 'hono';
import { getSupabaseClient } from '../services/supabase';

export async function authMiddleware(c: Context, next: Function) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Missing user authentication. Provide Authorization: Bearer token header.' }, 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const supabase = getSupabaseClient(c.env as any);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return c.json({ error: 'Invalid token or session expired.' }, 401);
    }

    // Attach user ID to context
    c.set('userId', user.id);

    await next();
}