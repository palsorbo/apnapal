import { Context } from 'hono';

export async function authMiddleware(c: Context, next: Function) {
    const userId = c.req.header('x-user-id') as string | undefined;

    if (!userId) {
        return c.json({ error: 'Missing user authentication. Provide x-user-id header.' }, 401);
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
        return c.json({ error: 'Invalid user ID format. Must be a valid UUID.' }, 400);
    }

    // Attach user ID to context
    c.set('userId', userId);

    await next();
}