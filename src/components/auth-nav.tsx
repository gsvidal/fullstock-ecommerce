import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../providers/auth-provider";
import { Button, Container } from "./ui";

export default function AuthNav() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error(error);
      setLogoutError("No pudimos cerrar sesión.");
    } finally {
      setIsLoggingOut(false);
    }
  }

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
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-inherit"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                  </Button>
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
