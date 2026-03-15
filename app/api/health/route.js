import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // 1. Check if we can run a basic SQL command using the query helper
    const timestampResult = await query('SELECT NOW() as current_time');
    
    // 2. Check if the schema tables exist
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'businesses', 'assistants', 'conversations', 'credits')
    `);

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Neon DB",
      serverTime: timestampResult.rows[0]?.current_time,
      foundTables: tablesResult.rows.map(r => r.table_name),
      status: tablesResult.rows.length === 5 ? "All schema tables found" : "Tables not initialized yet"
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error.message
    }, { status: 500 });
  }
}
