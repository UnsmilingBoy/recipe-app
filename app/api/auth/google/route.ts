import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/oauth";

/**
 * Initiates Google OAuth flow
 * GET /api/auth/google
 */
export async function GET() {
  try {
    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();

    const authUrl = getGoogleAuthUrl(state);

    // In production, you'd want to store the state in a session/cookie
    // and verify it in the callback
    const response = NextResponse.redirect(authUrl);

    // Store state in a cookie for verification in callback
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error initiating Google OAuth:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google authentication" },
      { status: 500 }
    );
  }
}
