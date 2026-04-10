import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Import routes
import legacyRoutes from './routes/legacy';
import profileRoutes from './routes/profile';
import charactersRoutes from './routes/characters';
import conversationsRoutes from './routes/conversations';
import messagingRoutes from './routes/messaging';

// Initialize app
const app = new Hono();

// CORS middleware
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
}));

// Root endpoint
app.get('/', (c) => {
    return c.json({
        message: 'Welcome to ApnaPal Worker API',
        version: '2.1.0',
        endpoints: {
            legacy: {
                chat: 'POST /legacy/chat (deprecated)'
            },
            profile: {
                get: 'GET /profile',
                update: 'PATCH /profile'
            },
            characters: {
                list: 'GET /characters',
                detail: 'GET /characters/:id'
            },
            conversations: {
                list: 'GET /conversations',
                create: 'POST /conversations (body: { character_id })',
                get: 'GET /conversations/:id',
                delete: 'DELETE /conversations/:id',
                messages: 'GET /conversations/:id/messages'
            },
            messaging: {
                send: 'POST /conversations/:id/messages (body: { content })'
            },
            health: {
                check: 'GET /health'
            }
        }
    });
});

// Health check endpoint
app.get('/health', (c) => {
    return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Register routes
app.route('/legacy', legacyRoutes);
app.route('/profile', profileRoutes);
app.route('/characters', charactersRoutes);
app.route('/conversations', conversationsRoutes);
app.route('/conversations', messagingRoutes);

// Error handler
app.onError((err, c) => {
    console.error('Unhandled error:', err);
    return c.json({
        error: 'Internal server error',
        message: err.message
    }, 500);
});

export default app;
