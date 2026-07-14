import { useId, type ComponentPropsWithoutRef } from "react";
import { errorAttributes } from "./error-attributes";
import Field from "./field";

type InputFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  // Los errores llegan como arreglo porque así los manda la API (el 422).
  errors?: string[];
};

export default function InputField({
  label,
  errors,
  id,
  ...delegated
}: InputFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const error = errors?.[0];

  return (
    <Field id={fieldId} label={label} error={error}>
      <input id={fieldId} {...errorAttributes(fieldId, error)} {...delegated} />
    </Field>
  );
}
