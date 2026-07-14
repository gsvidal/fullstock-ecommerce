import { API_URL } from "../config";
import { ApiError, type FieldErrors } from "./api-error";

type ApiSuccess<T> = { data: T };
type ApiFailure = { error: string; fields?: FieldErrors };
type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

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

  return (body as ApiSuccess<T>).data;
}
