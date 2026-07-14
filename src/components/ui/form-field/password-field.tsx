import { useId, type ComponentPropsWithoutRef } from "react";
import PasswordInput from "../password-input";
import { errorAttributes } from "./error-attributes";
import Field from "./field";

// El `type` es asunto del PasswordInput, así que el consumidor no lo puede tocar.
type PasswordFieldProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: string;
  errors?: string[];
};

export default function PasswordField({
  label,
  errors,
  id,
  ...delegated
}: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const error = errors?.[0];

  return (
    <Field id={fieldId} label={label} error={error}>
      <PasswordInput
        id={fieldId}
        {...errorAttributes(fieldId, error)}
        {...delegated}
      />
    </Field>
  );
}
