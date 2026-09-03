import { useEffect } from "react";
import { Button } from "./ui";
import { MoonIcon, SunIcon } from "./ui/icons";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(theme);
}

export default function ThemeToggler() {
  // Efecto: se suscribe a los cambios de tema del sistema operativo.
  // Solo reacciona si el usuario NO ha guardado una preferencia explícita.
  // El cleanup quita el listener al desmontar.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent) {
      if (!localStorage.getItem("theme")) {
        applyTheme(event.matches ? "dark" : "light");
      }
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Al hacer clic guardamos la preferencia
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isDark ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <Button type="button" variant="ghost" size="xl-icon" onClick={toggleTheme}>
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
      <span className="sr-only dark:hidden">Cambiar a modo oscuro</span>
      <span className="sr-only hidden dark:inline">Cambiar a modo claro</span>
    </Button>
  );
}
