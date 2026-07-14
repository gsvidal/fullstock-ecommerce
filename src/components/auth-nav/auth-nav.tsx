import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../providers/auth-provider";
import { Button, Container } from "../ui";
import styles from "./styles.module.css";

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
    <div className={styles["auth-nav"]}>
      <Container className={styles["auth-nav__container"]}>
        <nav aria-label="Autenticación de usuario">
          <ul className={styles["auth-nav__list"]}>
            {user ? (
              <>
                {logoutError && (
                  <li className={styles["auth-nav__error"]} role="alert">
                    {logoutError}
                  </li>
                )}
                <li className={styles["auth-nav__item"]}>
                  Bienvenido {user.email}
                </li>
                <li className={styles["auth-nav__item"]}>
                  <Button
                    type="button"
                    variant="ghost"
                    className={styles["auth-nav__button"]}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li className={styles["auth-nav__item"]}>
                  <Link to="/login" className={styles["auth-nav__link"]}>
                    Iniciar sesión
                  </Link>
                </li>
                <li className={styles["auth-nav__item"]}>
                  <Link to="/signup" className={styles["auth-nav__link"]}>
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
