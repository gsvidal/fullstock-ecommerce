import { Link, useFetcher } from "react-router";
import { useCurrentUser } from "../hooks";
import { Button, Container } from "./ui";
import type { action as logoutAction } from "../routes/logout";

export default function AuthNav() {
  const fetcher = useFetcher<typeof logoutAction>();
  const user = useCurrentUser();

  const logoutError = fetcher.data?.error;
  const isLoggingOut = fetcher.state !== "idle";

  return (
    <div className="dark bg-(--black) text-sm font-medium text-foreground">
      {/*
    .dark fija color-scheme: dark en este subárbol para que light-dark()
    resuelva la rama oscura (texto, error, etc.).
    bg-(--black) da superficie propia (negro puro): en tema oscuro la franja
    no se fusiona con el bg-background del header.
    */}
      <Container className="flex h-10 items-center justify-end">
        <nav aria-label="Autenticación de usuario">
          <ul className="flex items-center gap-4">
            {user ? (
              <>
                {logoutError && (
                  <li className="text-error" role="alert">
                    {logoutError}
                  </li>
                )}
                <li>Bienvenido {user.email}</li>
                <li>
                  <fetcher.Form method="post" action="/logout">
                    <Button
                      type="submit"
                      variant="ghost"
                      className="text-inherit"
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                    </Button>
                  </fetcher.Form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:underline hover:underline-offset-2"
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:underline hover:underline-offset-2"
                  >
                    Crear una cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
