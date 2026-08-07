import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  // El control: un <input>, un <select>, un PasswordInput...
  children: ReactNode;
};

/**
 * El armazón que comparten todos los campos: la etiqueta, el control y el
 * mensaje de error. No se exporta: solo lo usan InputField, SelectField y
 * PasswordField.
 */
export default function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span id={`${id}-error`} className="text-xs font-medium text-error">
          {error}
        </span>
      )}
    </div>
  );
}
