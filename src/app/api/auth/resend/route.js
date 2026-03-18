import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // 1. Find user
    const result = await db.query(
      'SELECT id, name, email, is_verified, otp_request_count, last_otp_request FROM users WHERE email = $1',
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

    // 3. Rate limiting (Max 3 requests per 10 minutes)
    const now = new Date();
    const lastRequest = user.last_otp_request ? new Date(user.last_otp_request) : null;
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    let count = user.otp_request_count || 0;

    // Reset count if last request was more than 10 mins ago
    if (lastRequest && lastRequest < tenMinutesAgo) {
      count = 0;
    }

    if (count >= 3) {
      const waitTime = Math.ceil((lastRequest.getTime() + 10 * 60 * 1000 - now.getTime()) / 60000);
      return NextResponse.json(
        { success: false, error: `Too many requests. Please try again in ${waitTime} minutes.` },
        { status: 429 }
      );
    }

    // 4. Generate AND Update OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.query(
      'UPDATE users SET email_verification_code = $1, email_verification_expires = $2, otp_request_count = $3, last_otp_request = $4 WHERE id = $5',
      [otpHash, otpExpiry, count + 1, now, user.id]
    );

    // 5. Send new verification email
    try {
      await sendVerificationEmail(user.email, user.name, otp);
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'New verification code sent to your email.'
    });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
