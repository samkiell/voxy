require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testAPI() {
  try {
    const res = await pool.query('SELECT id FROM conversations ORDER BY created_at DESC LIMIT 1');
    const conv = res.rows[0];
    
    if (conv) {
      console.log("Sending POST to http://localhost:3000/api/assistant/chat with id:", conv.id);
      
      const apiRes = await fetch('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conv.id })
      });
      
      const json = await apiRes.json();
      console.log("API Status:", apiRes.status);
      console.log("API Response:", json);
    }
  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    pool.end();
  }
}

testAPI();
