import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const result = await db.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [id]
    );

    return NextResponse.json({ success: true, messages: result.rows });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { content, senderType, setStatus } = body;

    const result = await db.query(
      'INSERT INTO messages (conversation_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
      [id, senderType, content]
    );

    // Update conversation's updated_at and optionally status
    if (setStatus) {
      await db.query(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP, status = $2 WHERE id = $1',
        [id, setStatus]
      );
    } else {
      await db.query(
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: result.rows[0] 
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
