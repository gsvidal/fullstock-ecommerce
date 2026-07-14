import Container from "../container";
import Section from "../section";
import styles from "./styles.module.css";

type SpinnerProps = {
  label?: string;
};

export default function Spinner({ label = "Cargando..." }: SpinnerProps) {
  return (
    <Section>
      <Container>
        <div className={styles["spinner"]} role="status">
          <div className={styles["spinner__circle"]} />
          {/* El círculo que gira no le dice nada a un lector de pantalla, así
              que el mensaje viaja en texto que solo él lee. */}
          <span className={styles["spinner__label"]}>{label}</span>
        </div>
      </Container>
    </Section>
  );
}
