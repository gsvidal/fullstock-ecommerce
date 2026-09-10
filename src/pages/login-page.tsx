import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  replace,
  useActionData,
  useSubmit,
  type ActionFunctionArgs,
} from "react-router";

import {
  Button,
  Container,
  InputField,
  PasswordField,
  Section,
} from "../components/ui";
import { ApiError } from "../lib/api-error";
import { applyServerFieldErrors } from "../lib/apply-server-field-errors";
import { loginSchema, type LoginFormValues } from "../schemas/auth";
import { logError } from "../lib/log-error";
import { pageTitle } from "../lib/page-meta";
import z from "zod";
import { verifyCredentials } from "../services/user.service";
import { commitSession, getSession } from "../lib/session.server";
import type { PublicUser } from "../repositories/user.repository";
import { resolveCartId } from "../services/cart.service";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { fields: z.flattenError(parsed.error).fieldErrors };
  }

  let user: PublicUser;

  try {
    user = await verifyCredentials(parsed.data.email, parsed.data.password);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { root: error.message };
    }
    logError(error);
    return { root: "No pudimos completar la operación. Intenta de nuevo." };
  }

  const session = await getSession(request);
  session.set("userId", user.id);

  const cartId = await resolveCartId(session.get("cartId"), user.id);
  if (cartId !== undefined) session.set("cartId", cartId);

  return replace("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export function meta() {
  return [pageTitle("Iniciar sesión")];
}

export default function LoginPage() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

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

  useEffect(() => {
    if (actionData?.fields) applyServerFieldErrors(actionData.fields, setError);
    if (actionData?.root) setError("root", { message: actionData.root });
  }, [actionData, setError]);

  async function onSubmit(values: LoginFormValues) {
    submit(values, { method: "post" });
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
