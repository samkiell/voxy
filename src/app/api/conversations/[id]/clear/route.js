import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Soft-delete: Append current user ID to hidden_for array for all messages in this conversation
    await db.query(
      `UPDATE messages 
       SET hidden_for = array_append(COALESCE(hidden_for, '{}'), $2)
       WHERE conversation_id = $1 AND NOT ($2 = ANY(COALESCE(hidden_for, '{}')))`,
      [id, user.id]
    );

    return NextResponse.json({ success: true, message: 'Chat cleared for user' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
