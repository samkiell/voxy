import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // 1. Find user
    const result = await db.query(
      'SELECT id, name, email, email_verification_code, email_verification_expires, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // 2. Already verified?
    if (user.is_verified) {
      return NextResponse.json(
        { success: true, message: 'Account already verified' },
        { status: 200 }
      );
    }

    // 3. Check expiry
    const now = new Date();
    const expiry = new Date(user.email_verification_expires);

    if (now > expiry) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // 4. Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.email_verification_code);
    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // 5. Success - Mark as verified and clear OTP fields
    await db.query(
      'UPDATE users SET is_verified = true, email_verification_code = NULL, email_verification_expires = NULL WHERE id = $1',
      [user.id]
    );

    // 6. Send Welcome Email (Fire and forget, don't block response)
    sendWelcomeEmail(user.email, user.name).catch(err => console.error('Welcome email error:', err));

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully! You can now log in.'
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
