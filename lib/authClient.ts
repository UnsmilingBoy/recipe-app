"use client";

import { PublicUser } from "./userSchema";

/**
 * Client-side auth utilities for making API calls
 */

export async function loginUser(
  email: string,
  password: string
): Promise<PublicUser> {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data.user;
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<PublicUser> {
  const response = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data.user;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  try {
    const response = await fetch("/api/users/me", {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function updateUser(updates: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<PublicUser> {
  const response = await fetch("/api/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Update failed");
  }

  return data.user;
}

export async function deleteAccount(): Promise<void> {
  const response = await fetch("/api/users/me", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Delete failed");
  }
}
