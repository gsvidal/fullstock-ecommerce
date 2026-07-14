import { useEffect, useState } from "react";
import { Button } from "../ui";
import { MoonIcon, SunIcon } from "../ui/icons";

type Theme = "light" | "dark";

export default function ThemeToggler() {
  // Inicializador lazy: lee el tema UNA sola vez al montar, desde la clase que
  // el script anti-FOUC ya aplicó en <html>.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  // Efecto: sincroniza el DOM (sistema externo) cada vez que cambia el tema.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
  }, [theme]);

  // Efecto: se suscribe a los cambios de tema del sistema operativo.
  // Solo reacciona si el usuario NO ha guardado una preferencia explícita.
  // El cleanup quita el listener al desmontar.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent) {
      if (!localStorage.getItem("theme")) {
        setTheme(event.matches ? "dark" : "light");
      }
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Al hacer clic guardamos la preferencia
  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  const isDark = theme === "dark";
  const label = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <Button
      type="button"
      variant="ghost"
      size="xl-icon"
      aria-label={label}
      onClick={toggleTheme}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
