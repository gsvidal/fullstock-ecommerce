import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ApiError } from "../../lib/api-error";
import { applyServerFieldErrors } from "../../lib/apply-server-field-errors";
import { loginSchema, type LoginFormValues } from "../../schemas/auth";
import styles from "./styles.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Iniciar sesión");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit({ email, password }: LoginFormValues) {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.fields) {
        applyServerFieldErrors(error.fields, setError);
      } else if (error instanceof ApiError && error.status === 401) {
        setError("root", { message: error.message });
      } else {
        console.error(error);
        setError("root", {
          message: "No pudimos iniciar sesión. Intenta de nuevo.",
        });
      }
    }
  }

  return (
    <Section>
      <Container className={styles["login"]}>
        <h1 className={styles["login__title"]}>Inicia sesión en tu cuenta</h1>
        <form
          className={styles["login__form"]}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordField
            label="Contraseña"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            className={styles["login__submit"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          {errors.root?.message && (
            <p className={styles["login__error"]} role="alert">
              {errors.root.message}
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
