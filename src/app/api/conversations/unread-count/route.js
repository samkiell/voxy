import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let count = 0;
    if (user.role === 'customer') {
      // Unread count for customer: messages from owners/ai that are not read
      const res = await db.query(
        `SELECT COUNT(*) 
         FROM messages m
         JOIN conversations c ON m.conversation_id = c.id
         WHERE c.customer_id = $1 
         AND m.sender_type IN ('owner', 'ai')
         AND m.is_read = false`,
        [user.id]
      );
      count = parseInt(res.rows[0].count) || 0;
    } else {
      // Unread count for business/owner: messages from customers that are not read
      const res = await db.query(
        `SELECT COUNT(*) 
         FROM messages m
         JOIN conversations c ON m.conversation_id = c.id
         JOIN businesses b ON c.business_id = b.id
         WHERE b.owner_id = $1 
         AND m.sender_type = 'customer'
         AND m.is_read = false`,
        [user.id]
      );
      count = parseInt(res.rows[0].count) || 0;
    }

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Unread count error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
