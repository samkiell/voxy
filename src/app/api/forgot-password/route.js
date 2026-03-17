import { NextResponse } from "next/server";

/**
 * Forgot Password API Route
 * 
 * In a real-world scenario, this would:
 * 1. Generate a secure, time-limited reset token.
 * 2. Store it in the database.
 * 3. Send an email via Resend, SendGrid, etc.
 * 
 * For now, this is a placeholder that simulates success.
 */
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" }, 
        { status: 400 }
      );
    }

    // Simulate database lookup & email sending
    console.log(`[AUTH] Password reset requested for: ${email}`);

    // Mock success response
    return NextResponse.json({ 
      success: true, 
      message: "If an account exists with that email, a reset link has been sent." 
    });

  } catch (error) {
    console.error("[AUTH_ERROR] Forgot password failure:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
