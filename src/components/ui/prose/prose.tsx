import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import Container from "../container";
import styles from "./styles.module.css";

type ProseProps = ComponentPropsWithoutRef<"article">;

/**
 * Texto largo: estiliza el HTML de adentro (h1, p, ul, a...) sin que haya que
 * ponerle una clase a cada elemento.
 *
 * Funciona como CSS Module porque los Modules solo hashean los NOMBRES DE CLASE:
 * en `.prose h2 { ... }`, el `.prose` se hashea y el `h2` se queda como está.
 *
 * Va siempre en un contenedor angosto, y eso no es un detalle de layout: una
 * línea demasiado larga se lee mal.
 */
export default function Prose({ className, ...delegated }: ProseProps) {
  return (
    <Container
      as="article"
      size="sm"
      className={clsx(styles["prose"], className)}
      {...delegated}
    />
  );
}
