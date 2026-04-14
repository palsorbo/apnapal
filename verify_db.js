const { Client } = require('pg');

async function verify() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // 1. Verify Characters SEED
    console.log('\n--- Checking Characters ---');
    const chars = await client.query('SELECT name, persona_type, system_prompt FROM public.characters;');
    console.table(chars.rows);
    if (chars.rows.length !== 3) {
      throw new Error(`Expected 3 characters, found ${chars.rows.length}`);
    }

    // 2. Test handle_new_user and handle_new_profile triggers
    console.log('\n--- Testing Triggers ---');
    const testUserId = '00000000-0000-0000-0000-000000000001';
    
    // Clear if exists
    await client.query('DELETE FROM auth.users WHERE id = $1', [testUserId]);

    // Insert mock user into auth.users (trigger handle_new_user should run)
    await client.query(`
      INSERT INTO auth.users (id, instance_id, aud, role, email)
      VALUES ($1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test@example.com')
    `, [testUserId]);
    console.log(`Successfully created mock auth user (id: ${testUserId})`);

    // Verify profiles creation (which is created by handle_new_user)
    const profileRes = await client.query('SELECT * FROM public.profiles WHERE id = $1', [testUserId]);
    if (profileRes.rows.length === 0) {
      throw new Error('Profile was not automatically created by trigger.');
    }
    console.log('Profile automatically created:', profileRes.rows[0]);

    // Verify credits creation (which is created by handle_new_profile)
    const creditRes = await client.query('SELECT * FROM public.credits WHERE user_id = $1', [testUserId]);
    if (creditRes.rows.length === 0) {
      throw new Error('Credits row was not automatically created by trigger.');
    }
    console.log('Credits automatically created:', creditRes.rows[0]);

    if (creditRes.rows[0].balance !== 20) {
      throw new Error(`Expected 20 credits, got ${creditRes.rows[0].balance}`);
    }

    console.log('\n✅ All Database tests passed!');
  } catch (error) {
    console.error('\n❌ Verification Failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verify();
