import { Hono } from 'hono';
import type { Env } from '../types';
import { getSupabaseClient } from '../services/supabase';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const supabase = getSupabaseClient(env);

        const { data, error } = await supabase
            .from('credits')
            .select('balance')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return c.json({ balance: 0 }); // Fallback
            }
            throw error;
        }

        return c.json(data);
    } catch (error: any) {
        console.error('Error fetching balance:', error);
        return c.json({ error: 'Failed to fetch credits balance' }, 500);
    }
});

app.get('/transactions', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const supabase = getSupabaseClient(env);
        
        let limit = Number.parseInt(c.req.query('limit') || '20', 10);
        if (isNaN(limit) || limit < 1) limit = 20;

        const { data, error } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return c.json(data || []);
    } catch (error: any) {
        console.error('Error fetching transactions:', error);
        return c.json({ error: 'Failed to fetch transactions' }, 500);
    }
});

app.post('/recharge', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        
        if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
            return c.json({ error: 'Payment gateway not configured' }, 503);
        }

        const body = await c.req.json();
        const { planId } = body; 

        // Hardcode a simple plan structure for MVP
        const plans: Record<string, { credits: number; priceInPaise: number }> = {
            'basic': { credits: 50, priceInPaise: 4900 },
            'pro': { credits: 150, priceInPaise: 9900 },
            'ultra': { credits: 400, priceInPaise: 19900 }
        };

        const plan = plans[planId as string];
        if (!plan) return c.json({ error: 'Invalid plan selected' }, 400);

        const authHeader = 'Basic ' + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify({
                amount: plan.priceInPaise,
                currency: 'INR',
                receipt: `rcpt_${userId}_${Date.now()}`
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Razorpay Error:', errorData);
            return c.json({ error: 'Failed to create order' }, 502);
        }

        const data = await response.json() as any;
        return c.json({ order_id: data.id, amount: data.amount, credits: plan.credits });
    } catch (error: any) {
        console.error('Error creating recharge:', error);
        return c.json({ error: 'Failed to initiate recharge' }, 500);
    }
});

async function verifyHmac(keyStr: string, text: string, hash: string): Promise<boolean> {
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

app.post('/recharge/verify', authMiddleware, async (c) => {
    try {
        const env = c.env as Env;
        const userId = c.get('userId');
        const supabase = getSupabaseClient(env);
        
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, credits } = await c.req.json();
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !credits) {
            return c.json({ error: 'Missing required parameters' }, 400);
        }

        const generatedSignatureStr = `${razorpay_order_id}|${razorpay_payment_id}`;
        const isValid = await verifyHmac(env.RAZORPAY_KEY_SECRET, generatedSignatureStr, razorpay_signature);

        if (!isValid) {
            return c.json({ error: 'Invalid payment signature' }, 400);
        }

        // Call our RPC to natively fulfill transaction.
        const { data, error } = await supabase.rpc('recharge_credits', {
            p_user_id: userId,
            p_amount: credits,
            p_type: 'recharge',
            p_metadata: { order_id: razorpay_order_id, payment_id: razorpay_payment_id }
        });

        if (error) {
            if (error.code === '23505') {
                 // Might error on collision, or if we had a unique constraint on metadata
                 console.error('Double spend prevention / duplicate insert:', error);
            } else {
                 throw error;
            }
        }

        return c.json({ success: true, message: 'Recharge successful' });
    } catch (error: any) {
        console.error('Error verifying recharge:', error);
        return c.json({ error: 'Payment verification failed' }, 500);
    }
});

export default app;
