import { NextResponse } from 'next/server';
import { getUserFromCookie, hashPassword } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  try {
    const payload = await getUserFromCookie();

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const result = await db.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [payload.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: {
        name: result.rows[0].name,
        email: result.rows[0].email
      }
    });

  } catch (error) {
    console.error('Fetch Customer Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const payload = await getUserFromCookie();

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { name, password } = body;

    if (!name && !password) {
      return NextResponse.json(
        { success: false, error: 'Nothing to update. Provide name or password.' },
        { status: 400 }
      );
    }

    let queryText = 'UPDATE users SET ';
    const queryParams = [];
    let paramIndex = 1;

    if (name) {
      queryText += `name = $${paramIndex}`;
      queryParams.push(name);
      paramIndex++;
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      if (paramIndex > 1) {
        queryText += ', ';
      }
      queryText += `password = $${paramIndex}`;
      queryParams.push(hashedPassword);
      paramIndex++;
    }

    // Set updated_at if you have such a column, skipping it to be safe 
    // but assuming users table just needs these basic fields updated.

    queryText += ` WHERE id = $${paramIndex} RETURNING id, name, email`;
    queryParams.push(payload.id);

    const result = await db.query(queryText, queryParams);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      customer: {
        name: result.rows[0].name,
        email: result.rows[0].email
      }
    });

  } catch (error) {
    console.error('Update Customer Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
