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
    <div className="bg-(--black) text-sm font-medium text-(--white)">
      <Container className="flex h-10 items-center justify-end">
        <nav aria-label="Autenticación de usuario">
          <ul className="flex items-center gap-4">
            {user ? (
              <>
                {/* Esta barra siempre tiene fondo negro, y --error (hsl(10 82%
                45%)) solo alcanza 4.3:1 sobre él: por debajo del 4.5:1 que
                exige WCAG AA. Usamos una variante clara del mismo tono, que
                llega a ~9:1. */}
                {logoutError && (
                  <li className="text-[hsl(10_90%_72%)]" role="alert">
                    {logoutError}
                  </li>
                )}
                <li>Bienvenido {user.email}</li>
                <li>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-(--white)"
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
