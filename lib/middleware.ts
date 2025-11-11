import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies, verifyToken } from "./auth";
import { queryOne } from "./db";
import { toPublicUser, PublicUser, User } from "./userSchema";

export interface AuthenticatedRequest extends NextRequest {
  user?: PublicUser;
}

/**
 * Middleware to verify authentication and attach user to request
 * Returns null if authenticated, or an error response if not
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: PublicUser } | NextResponse> {
  const cookieHeader = request.headers.get("cookie");
  const token = getTokenFromCookies(cookieHeader);

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // Fetch user from database to ensure they still exist
  const user = await queryOne<User>(
    "SELECT id, email, name, password_hash, created_at, updated_at FROM users WHERE id = $1",
    [payload.userId]
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  return { user: toPublicUser(user) };
}

/**
 * Optional auth - doesn't return error if not authenticated
 */
export async function optionalAuth(
  request: NextRequest
): Promise<PublicUser | null> {
  const cookieHeader = request.headers.get("cookie");
  const token = getTokenFromCookies(cookieHeader);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await queryOne<User>(
    "SELECT id, email, name, password_hash, created_at, updated_at FROM users WHERE id = $1",
    [payload.userId]
  );

  if (!user) {
    return null;
  }

  return toPublicUser(user);
}
