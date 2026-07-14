import { Button, Container } from "../ui";
import styles from "./styles.module.css";

export default function Hero() {
  return (
    <section className={styles["hero"]}>
      <Container size="sm" className={styles["hero__container"]}>
        <h2 className={styles["hero__title"]}>Nuevos productos disponibles</h2>
        <p className={styles["hero__text"]}>
          Un pequeño lote de increíbles productos acaba de llegar.
          <br />
          Agrega tus favoritos al carrito antes que se agoten.
        </p>
        <Button href="/categories/polos" size="xl">
          Compra ahora
        </Button>
      </Container>
    </section>
  );
}
