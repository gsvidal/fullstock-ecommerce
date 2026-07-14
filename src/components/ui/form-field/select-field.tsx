import { useId, type ComponentPropsWithoutRef } from "react";
import { errorAttributes } from "./error-attributes";
import Field from "./field";

type SelectFieldProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  errors?: string[];
};

export default function SelectField({
  label,
  errors,
  id,
  children,
  ...delegated
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const error = errors?.[0];

  return (
    <Field id={fieldId} label={label} error={error}>
      <select id={fieldId} {...errorAttributes(fieldId, error)} {...delegated}>
        {children}
      </select>
    </Field>
  );
}
