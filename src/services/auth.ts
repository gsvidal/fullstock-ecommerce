import { ApiError } from "../lib/api-error";
import { request } from "../lib/api-client";
import type { User } from "../types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await request<User>("/users/me", { credentials: "include" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function createSession(email: string, password: string): Promise<User> {
  return request<User>("/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}

export function deleteSession(): Promise<void> {
  return request<void>("/sessions", {
    method: "DELETE",
    credentials: "include",
  });
}

export function createUser(email: string, password: string): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}
