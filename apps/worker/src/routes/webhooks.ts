import { Hono } from 'hono';
import type { Env } from '../types';
import { getSupabaseClient } from '../services/supabase';

const app = new Hono();

async function verifyWebhookHmac(keyStr: string, text: string, hash: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyStr);
    const textData = encoder.encode(text);

    const key = await crypto.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['sign']
    );

    const signatureBytes = await crypto.subtle.sign('HMAC', key, textData);
    const signatureHex = Array.from(new Uint8Array(signatureBytes))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return signatureHex === hash;
}

app.post('/razorpay', async (c) => {
    try {
        const env = c.env as Env;
        if (!env.RAZORPAY_WEBHOOK_SECRET) {
            return c.text('No webhook secret configured', 500);
        }

        const signature = c.req.header('x-razorpay-signature');
        if (!signature) {
            return c.text('Missing signature', 400);
        }
        
        const payloadText = await c.req.text();
        
        const isValid = await verifyWebhookHmac(env.RAZORPAY_WEBHOOK_SECRET, payloadText, signature);
        if (!isValid) {
            return c.text('Invalid signature', 400);
        }

        const payload = JSON.parse(payloadText);
        
        if (payload.event === 'payment.captured') {
             // Depending on how you trace back to the user, typically via Notes sent during order creation.
             // We'll acknowledge it simply right now for MVP.
             console.log('Payment Captured:', payload.payload.payment.entity);
        }

        return c.json({ status: 'ok' });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return c.text('Webhook error', 500);
    }
});

export default app;
