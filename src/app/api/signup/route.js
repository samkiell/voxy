import { NextResponse } from 'next/server';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import db from '@/lib/db';
import { getUniqueSlug } from '@/lib/utils';

export async function POST(req) {
  try {
    const { name, email, password, role = 'customer' } = await req.json();

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Generate unique slug
    const slug = await getUniqueSlug('users', name || email.split('@')[0], db);

    // 5. Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 6. Create user (unverified)
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role, slug, is_verified, email_verification_code, email_verification_expires) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, role, slug',
      [name, email, passwordHash, role, slug, false, otpHash, otpExpiry]
    );

    const newUser = result.rows[0];

    // 7. Send Verification Email
    try {
      await sendVerificationEmail(email, name, otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We still return 201 as user was created, but inform about email issues or log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created! Please check your email for a verification code.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
