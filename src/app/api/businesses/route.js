import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get('public') === 'true';

    // 1. PUBLIC QUERY: Fetch all verified/live businesses
    if (isPublic) {
      const result = await db.query(
        'SELECT id, name, description, category, custom_category, profile_completion, is_live FROM businesses WHERE is_live = true'
      );
      return NextResponse.json({ 
        success: true, 
        businesses: result.rows 
      });
    }

    // 2. PRIVATE QUERY: Fetch owner's specific business
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db.query(
      'SELECT * FROM businesses WHERE owner_id = $1',
      [user.id]
    );

    return NextResponse.json({ 
      success: true, 
      business: result.rows[0] || null 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, description, category, custom_category, 
      assistant_tone, assistant_instructions, business_hours,
      profile_completion, is_live 
    } = body;

    // Check if business exists
    const existing = await db.query(
      'SELECT id FROM businesses WHERE owner_id = $1',
      [user.id]
    );

    let result;
    if (existing.rowCount > 0) {
      // Update
      result = await db.query(
        `UPDATE businesses SET 
          name = $1, description = $2, category = $3, 
          custom_category = $4, assistant_tone = $5, 
          assistant_instructions = $6, business_hours = $7,
          profile_completion = $8, is_live = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE owner_id = $10 RETURNING *`,
        [
          name, description, category, custom_category, 
          assistant_tone, assistant_instructions, JSON.stringify(business_hours),
          profile_completion, is_live, user.id
        ]
      );
    } else {
      // Insert
      result = await db.query(
        `INSERT INTO businesses (
          owner_id, name, description, category, 
          custom_category, assistant_tone, assistant_instructions, 
          business_hours, profile_completion, is_live
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          user.id, name, description, category, 
          custom_category, assistant_tone, assistant_instructions, 
          JSON.stringify(business_hours), profile_completion, is_live
        ]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Business settings saved", 
      business: result.rows[0] 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
