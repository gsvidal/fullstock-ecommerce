// Errores de validación de la API
export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  // Solo presente en respuestas de validación (422): los errores por campo.
  readonly fields?: FieldErrors;

  constructor(message: string, status: number, fields?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}
