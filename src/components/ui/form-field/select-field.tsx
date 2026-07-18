import { useId, type ComponentPropsWithRef } from "react";
import { errorAttributes } from "./error-attributes";
import Field from "./field";

type SelectFieldProps = ComponentPropsWithRef<"select"> & {
  label: string;
  error?: string;
};

export default function SelectField({
  label,
  error,
  id,
  children,
  ...delegated
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <Field id={fieldId} label={label} error={error}>
      <select id={fieldId} {...errorAttributes(fieldId, error)} {...delegated}>
        {children}
      </select>
    </Field>
  );
}
