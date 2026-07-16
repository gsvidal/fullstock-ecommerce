import { useId, type ComponentPropsWithRef } from "react";
import PasswordInput from "../password-input";
import { errorAttributes } from "./error-attributes";
import Field from "./field";

// El `type` es asunto del PasswordInput, así que el consumidor no lo puede tocar.
type PasswordFieldProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  label: string;
  error?: string;
};

export default function PasswordField({
  label,
  error,
  id,
  ...delegated
}: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

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
