import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../providers/auth-provider";
import {
  Button,
  Container,
  InputField,
  PasswordField,
  Section,
} from "../../components/ui";
import { useDocumentTitle } from "../../hooks";
import { ApiError, type FieldErrors } from "../../lib/api-error";
import styles from "./styles.module.css";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Crear cuenta");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    setFieldErrors(null);
    setFormError(null);

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ["Las contraseñas no coinciden"] });
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.fields) {
        setFieldErrors(error.fields);
      } else if (error instanceof ApiError && error.status === 409) {
        setFieldErrors({ email: [error.message] });
      } else {
        console.error(error);
        setFormError("No pudimos crear tu cuenta. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section>
      <Container className={styles["signup"]}>
        <h1 className={styles["signup__title"]}>Crea una cuenta</h1>
        <form
          className={styles["signup__form"]}
          onSubmit={handleSubmit}
          noValidate
        >
          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            required
            errors={fieldErrors?.email}
          />

          <PasswordField
            label="Contraseña"
            name="password"
            autoComplete="new-password"
            required
            errors={fieldErrors?.password}
          />

          <PasswordField
            label="Confirma tu contraseña"
            name="confirmPassword"
            autoComplete="new-password"
            required
            errors={fieldErrors?.confirmPassword}
          />

          <Button
            type="submit"
            size="lg"
            className={styles["signup__submit"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>

          {formError && (
            <p className={styles["signup__error"]} role="alert">
              {formError}
            </p>
          )}
        </form>

        <div className={styles["signup__footer"]}>
          <span className={styles["signup__footer_text"]}>
            ¿Ya tienes una cuenta?
          </span>
          <Link to="/login" className={styles["signup__footer_link"]}>
            Inicia sesión
          </Link>
        </div>
      </Container>
    </Section>
  );
}
