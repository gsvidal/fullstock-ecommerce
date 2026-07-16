import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { FieldErrors } from "./api-error";

export function applyServerFieldErrors<T extends FieldValues>(
  fields: FieldErrors,
  setError: UseFormSetError<T>,
) {
  for (const [name, messages] of Object.entries(fields)) {
    if (messages[0]) {
      setError(name as Path<T>, { message: messages[0] });
    }
  }
}
