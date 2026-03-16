require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkDB() {
  try {
    const res = await pool.query('SELECT id, business_id FROM conversations ORDER BY created_at DESC LIMIT 1');
    const conv = res.rows[0];
    console.log("Latest conversation:", conv);
    
    if (conv) {
      console.log("Testing API route query...");
      const conversationRes = await pool.query(
        `SELECT c.*, b.name as business_name, b.category, b.assistant_tone, b.assistant_instructions, b.description as business_desc
         FROM conversations c
         JOIN businesses b ON c.business_id = b.id
         WHERE c.id = $1`,
        [conv.id]
      );
      console.log("Joined query result:", conversationRes.rows);
      
      const resMsg = await pool.query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC LIMIT 5', [conv.id]);
      console.log("Messages:", resMsg.rows.map(m => m.content));
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    pool.end();
  }
}

checkDB();
