import { useId, type ComponentPropsWithRef } from "react";
import { errorAttributes } from "./error-attributes";
import Field from "./field";

type InputFieldProps = ComponentPropsWithRef<"input"> & {
  label: string;
  // Los errores llegan como arreglo porque así los manda la API (el 422).
  error?: string;
};

export default function InputField({
  label,
  error,
  id,
  ...delegated
}: InputFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <Field id={fieldId} label={label} error={error}>
      <input id={fieldId} {...errorAttributes(fieldId, error)} {...delegated} />
    </Field>
  );
}
