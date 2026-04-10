import { Hono } from 'hono';
import { cors } from 'hono/cors';

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
        name: 'apnapal-worker',
        status: 'ok',
        version: '1.0.0'
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
