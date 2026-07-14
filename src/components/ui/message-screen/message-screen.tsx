import type { ReactNode } from "react";
import Container from "../container";
import Section from "../section";
import styles from "./styles.module.css";

type MessageScreenProps = {
  title: string;
  description: string;
  // La acción la decide quien lo usa, porque depende de qué se rompió y de
  // dónde: una ruta que no existe se abandona navegando, una app rota se
  // recarga, y a veces no hay nada que ofrecer.
  children?: ReactNode;
};

export default function MessageScreen({
  title,
  description,
  children,
}: MessageScreenProps) {
  return (
    <Section>
      <Container>
        <div className={styles["message-screen"]}>
          <h1 className={styles["message-screen__title"]}>{title}</h1>
          <p className={styles["message-screen__description"]}>{description}</p>
          {children}
        </div>
      </Container>
    </Section>
  );
}
