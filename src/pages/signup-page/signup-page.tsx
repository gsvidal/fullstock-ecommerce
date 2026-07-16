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
import { signupSchema, type SignupFormValues } from "../../schemas/auth";
import styles from "./styles.module.css";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Crear cuenta");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit({ email, password }: SignupFormValues) {
    try {
      await signup(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.fields) {
        applyServerFieldErrors(error.fields, setError);
      } else if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
      } else {
        console.error(error);
        setError("root", {
          message: "No pudimos crear tu cuenta. Intenta de nuevo.",
        });
      }
    }
  }

  return (
    <Section>
      <Container className={styles["signup"]}>
        <h1 className={styles["signup__title"]}>Crea una cuenta</h1>
        <form
          className={styles["signup__form"]}
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
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordField
            label="Confirma tu contraseña"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            size="lg"
            className={styles["signup__submit"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>

          {errors.root?.message && (
            <p className={styles["signup__error"]} role="alert">
              {errors.root.message}
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
