const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAllSchema() {
  try {
    const tables = ['businesses', 'conversations', 'messages', 'customers'];
    for (const table of tables) {
      const res = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table]);
      console.log(`\nColumns in "${table}" table:`);
      res.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));
    }
    process.exit(0);
  } catch (err) {
    console.error('Error checking schema:', err);
    process.exit(1);
  }
}

checkAllSchema();
