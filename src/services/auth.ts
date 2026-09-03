import { ApiError } from "../lib/api-error";
import { request } from "../lib/api-client";
import type { User } from "../types";
import type { ApiCookies } from "../lib/api-cookies";

export async function getCurrentUser(
  cookies: ApiCookies,
): Promise<User | null> {
  try {
    return await request<User>(
      "/users/me",
      { credentials: "include" },
      cookies,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function createSession(
  email: string,
  password: string,
  cookies: ApiCookies,
): Promise<User> {
  return request<User>(
    "/sessions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    },
    cookies,
  );
}

export function deleteSession(cookies: ApiCookies): Promise<void> {
  return request<void>(
    "/sessions",
    {
      method: "DELETE",
      credentials: "include",
    },
    cookies,
  );
}

export function createUser(
  email: string,
  password: string,
  cookies: ApiCookies,
): Promise<User> {
  return request<User>(
    "/users",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    },
    cookies,
  );
}
