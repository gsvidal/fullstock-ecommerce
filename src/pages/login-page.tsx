import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../providers/auth-provider";
import {
  Button,
  Container,
  InputField,
  PasswordField,
  Section,
} from "../components/ui";
import { useDocumentTitle } from "../hooks";
import { ApiError } from "../lib/api-error";
import { applyServerFieldErrors } from "../lib/apply-server-field-errors";
import { loginSchema, type LoginFormValues } from "../schemas/auth";

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
      <Container className="max-w-sm">
        <h1 className="mb-10 text-center text-2xl/7 font-bold">
          Inicia sesión en tu cuenta
        </h1>
        <form
          className="flex flex-col gap-6"
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
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          {errors.root?.message && (
            <p className="mt-2 text-center text-sm text-error" role="alert">
              {errors.root.message}
            </p>
          )}
        </form>

        <div className="mt-10 flex justify-center gap-2 text-sm/6">
          <span className="text-muted-foreground">¿Aún no tienes cuenta?</span>
          <Link to="/signup" className="text-accent-foreground hover:underline">
            Crea una cuenta
          </Link>
        </div>
      </Container>
    </Section>
  );
}
