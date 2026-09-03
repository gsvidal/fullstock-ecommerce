import { API_URL } from "../config";
import type { ApiCookies } from "./api-cookies";
import { ApiError, type FieldErrors } from "./api-error";

type ApiSuccess<T> = { data: T };
type ApiFailure = { error: string; fields?: FieldErrors };
type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export async function request<T>(
  path: string,
  options?: RequestInit,
  cookies?: ApiCookies,
): Promise<T> {
  const newHeaders = new Headers(options?.headers);
  if (cookies?.send != null) {
    newHeaders.append("Cookie", cookies.send);
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: newHeaders,
  });

  // 204 No Content (p. ej. un DELETE exitoso): no hay cuerpo que parsear.
  if (response.status === 204) {
    return undefined as T;
  }

  let body: ApiResponse<T>;

  try {
    body = await response.json();
  } catch {
    // El cuerpo no era JSON.
    throw new ApiError(
      "El servidor respondió en un formato inesperado.",
      response.status,
    );
  }

  if (!response.ok) {
    const { error, fields } = body as ApiFailure;
    throw new ApiError(error, response.status, fields);
  }

  if (cookies !== undefined) {
    cookies.received = response.headers.getSetCookie()[0] ?? null;
  }

  return (body as ApiSuccess<T>).data;
}
