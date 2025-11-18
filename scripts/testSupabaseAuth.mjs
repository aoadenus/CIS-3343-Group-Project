import fs from 'fs';

const env = fs.existsSync('./.env.local')
  ? Object.fromEntries(
      fs.readFileSync('./.env.local', 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((l) => l.split('='))
    )
  : process.env;

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Missing SUPABASE_URL or ANON_KEY in .env.local or environment');
  process.exit(2);
}

const email = 'emily@emilybakescakes.com';
const password = 'test';

// Use global fetch available in Node 18+ (this environment uses Node 22)
(async () => {
  try {
    const url = `${SUPABASE_URL.replace(/\/+$/,'')}/auth/v1/token`;
    console.log('POST', url);
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('email', email);
    params.append('password', password);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: ANON_KEY,
      },
      body: params.toString(),
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Network/Fetch error:', err);
    process.exit(1);
  }
})();
