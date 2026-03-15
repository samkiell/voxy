import { neon, neonConfig } from '@neondatabase/serverless';

// Caching database connections across function invocations for serverless performance
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);

/**
 * Executes a database query using the Neon Serverless driver.
 */
export async function query(text, params = []) {
  try {
    // If no params, just use the tagged template style on a raw string
    // Neon allows this if it's safe.
    const result = await sql.query(text, params);
    
    return {
      rows: Array.isArray(result) ? result : result.rows || [],
      rowCount: result.length || result.rowCount || 0
    };
  } catch (error) {
    if (error.message.includes('tagged-template') && (!params || params.length === 0)) {
       // Fallback for no-param queries if sql.query fails
       const rows = await sql(text);
       return { rows, rowCount: rows.length };
    }
    console.error('Neon Query Error:', error.message);
    throw error;
  }
}

export default sql;
