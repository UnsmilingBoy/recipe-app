import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/oauth";
import { query, queryOne } from "@/lib/db";
import { User } from "@/lib/userSchema";
import { signToken } from "@/lib/auth";

/**
 * Handles Google OAuth callback
 * GET /api/auth/google/callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("[OAuth Callback] Starting OAuth flow");

    // Check for OAuth errors
    if (error) {
      console.error("[OAuth Callback] OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("Google authentication failed")}`,
          request.url
        )
      );
    }

    if (!code) {
      console.error("[OAuth Callback] No authorization code received");
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            "No authorization code received"
          )}`,
          request.url
        )
      );
    }

    // Verify state (CSRF protection)
    const storedState = request.cookies.get("oauth_state")?.value;
    if (state !== storedState) {
      console.error("[OAuth Callback] State mismatch:", { state, storedState });
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("Invalid state parameter")}`,
          request.url
        )
      );
    }

    console.log("[OAuth Callback] Exchanging code for tokens");
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    console.log("[OAuth Callback] Fetching user info from Google");
    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);
    console.log("[OAuth Callback] Google user:", {
      email: googleUser.email,
      verified: googleUser.email_verified,
      sub: googleUser.sub,
    });

    console.log("[OAuth Callback] Google user:", {
      email: googleUser.email,
      verified: googleUser.email_verified,
      sub: googleUser.sub,
    });

    // Check if user exists with this Google ID or email
    console.log("[OAuth Callback] Checking for existing user with Google ID");
    let user = await queryOne<User>(
      "SELECT id, email, name, password_hash, created_at, updated_at FROM users WHERE google_id = $1",
      [googleUser.sub]
    );

    if (!user) {
      console.log(
        "[OAuth Callback] No user found with Google ID, checking by email"
      );
      // Check if email already exists (user signed up with password)
      user = await queryOne<User>(
        "SELECT id, email, name, password_hash, created_at, updated_at FROM users WHERE email = $1",
        [googleUser.email.toLowerCase()]
      );

      if (user) {
        console.log(
          "[OAuth Callback] Found existing user by email, linking Google ID"
        );
        // Link existing account with Google ID
        await query(
          "UPDATE users SET google_id = $1, updated_at = NOW() WHERE id = $2",
          [googleUser.sub, user.id]
        );
      } else {
        console.log("[OAuth Callback] No existing user, creating new account");

        // Create new user
        const result = await query<User>(
          `INSERT INTO users (email, name, google_id, password_hash, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           RETURNING id, email, name, password_hash, created_at, updated_at`,
          [
            googleUser.email.toLowerCase(),
            googleUser.name,
            googleUser.sub,
            null, // NULL for OAuth-only users
          ]
        );

        user = result[0];
        console.log("[OAuth Callback] New user created:", user.id);
      }
    } else {
      console.log(
        "[OAuth Callback] Found existing user with Google ID:",
        user.id
      );
    }

    if (!user) {
      console.error("[OAuth Callback] User is null after all operations");
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("Failed to create/find user")}`,
          request.url
        )
      );
    }

    console.log("[OAuth Callback] Generating JWT token for user:", user.id);
    // Generate JWT token
    const token = signToken({ userId: user.id, email: user.email });

    console.log("[OAuth Callback] Creating auth cookie and redirecting");
    // Redirect to home with auth cookie
    const response = NextResponse.redirect(new URL("/", request.url));

    // Use cookies.set instead of headers.set for better cookie handling
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Clear the state cookie
    response.cookies.delete("oauth_state");

    console.log("[OAuth Callback] OAuth flow completed successfully");
    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          "Authentication failed. Please try again."
        )}`,
        request.url
      )
    );
  }
}
