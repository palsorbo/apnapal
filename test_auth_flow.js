import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmF1bHQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3NjMwNjMwMCwiZXhwIjoxOTkyMDgyMzAwfQ.H_something';

// Load keys from config if possible, but default local dev keys work usually.
const ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

const WORKER_URL = 'http://localhost:8787';

async function testAuth() {
    try {
        console.log('1. Signing up dummy user to get JWT...');
        const supabase = createClient(SUPABASE_URL, ANON_KEY);
        
        const dummyEmail = `testuser_${Date.now()}@example.com`;
        
        const { data, error } = await supabase.auth.signUp({
            email: dummyEmail,
            password: 'password123'
        });

        if (error || !data.session) {
            throw new Error(`Failed to sign up: ${error?.message || 'No session returned (confirm email might be strictly required without custom conf)'}`);
        }

        const token = data.session.access_token;
        console.log(`✅ Success! Created user and grabbed JWT block (prefix): ${token.substring(0, 15)}...`);

        // Check if worker is awake
        console.log('\n2. Testing health endpoint on Worker...');
        let check = await fetch(`${WORKER_URL}/health`);
        if (!check.ok) throw new Error('Worker is not reachable');
        console.log('✅ Worker reachable');

        console.log('\n3. Testing API endpoint WITH valid token...');
        const resValid = await fetch(`${WORKER_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (resValid.ok) {
            const profile = await resValid.json();
            console.log('✅ Worker accepted token and successfully retrieved profile via DB!');
            console.log(profile);
        } else {
            const text = await resValid.text();
            throw new Error(`Worker rejected valid token. Response: ${resValid.status} ${text}`);
        }

        console.log('\n4. Testing API endpoint WITHOUT token...');
        const resInvalid = await fetch(`${WORKER_URL}/profile`);
        if (resInvalid.status === 401) {
            console.log('✅ Worker properly rejected request without token! (401 Unauthorized)');
        } else {
            throw new Error(`Worker failed to block request without token. Got status: ${resInvalid.status}`);
        }

        console.log('\n🎉 ALL AUTHENTICATION middleware verified successfully.');

    } catch (e) {
        console.error('❌ Test Failed:', e.message);
        process.exit(1);
    }
}

testAuth();
