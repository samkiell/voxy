require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkRealtime() {
  try {
    const res = await pool.query("SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';");
    console.log("Realtime enabled tables:", res.rows.map(r => r.tablename));
  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    pool.end();
  }
}

checkRealtime();
