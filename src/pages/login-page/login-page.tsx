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

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Iniciar sesión");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    setFieldErrors(null);
    setFormError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.fields) {
        setFieldErrors(error.fields);
      } else if (error instanceof ApiError && error.status === 401) {
        setFormError(error.message);
      } else {
        console.error(error);
        setFormError("No pudimos iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section>
      <Container className={styles["login"]}>
        <h1 className={styles["login__title"]}>Inicia sesión en tu cuenta</h1>
        <form
          className={styles["login__form"]}
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
            autoComplete="current-password"
            required
            errors={fieldErrors?.password}
          />

          <Button
            type="submit"
            size="lg"
            className={styles["login__submit"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          {formError && (
            <p className={styles["login__error"]} role="alert">
              {formError}
            </p>
          )}
        </form>

        <div className={styles["login__footer"]}>
          <span className={styles["login__footer_text"]}>
            ¿Aún no tienes cuenta?
          </span>
          <Link to="/signup" className={styles["login__footer_link"]}>
            Crea una cuenta
          </Link>
        </div>
      </Container>
    </Section>
  );
}
