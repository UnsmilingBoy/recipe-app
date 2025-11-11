import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/middleware";
import { updateUserSchema, User, toPublicUser } from "@/lib/userSchema";
import { queryOne, query } from "@/lib/db";

/**
 * GET /api/users/me
 * Get current authenticated user profile
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    // If auth failed, return the error response
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    return NextResponse.json({ user: authResult.user }, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/me
 * Update current user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await request.json();

    // Validate input
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, currentPassword, newPassword } = validationResult.data;

    // Get current user with password hash for verification
    const currentUser = await queryOne<User>(
      "SELECT id, email, name, password_hash, created_at, updated_at FROM users WHERE id = $1",
      [user.id]
    );

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If changing email, check if new email is already in use
    if (email && email.toLowerCase() !== currentUser.email.toLowerCase()) {
      const existingUser = await queryOne<User>(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email.toLowerCase(), user.id]
      );

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    // If changing password, verify current password
    let newPasswordHash: string | undefined;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        currentUser.password_hash
      );
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      newPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramCounter = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCounter++}`);
      values.push(name);
    }

    if (email !== undefined) {
      updates.push(`email = $${paramCounter++}`);
      values.push(email.toLowerCase());
    }

    if (newPasswordHash) {
      updates.push(`password_hash = $${paramCounter++}`);
      values.push(newPasswordHash);
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      // Only updated_at, no actual changes
      return NextResponse.json(
        { message: "No changes provided", user },
        { status: 200 }
      );
    }

    // Execute update
    values.push(user.id);
    const updatedUser = await queryOne<User>(
      `UPDATE users SET ${updates.join(
        ", "
      )} WHERE id = $${paramCounter} RETURNING id, email, name, password_hash, created_at, updated_at`,
      values
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: toPublicUser(updatedUser),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/me
 * Delete current user account
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Delete user from database
    await query("DELETE FROM users WHERE id = $1", [user.id]);

    // Return response with cleared cookie
    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );

    // Clear auth cookie
    const { clearAuthCookie } = await import("@/lib/auth");
    response.headers.set("Set-Cookie", clearAuthCookie());

    return response;
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
