import { Container } from "../ui";
import styles from "./styles.module.css";
import { IdeaIcon, ReturnIcon, RibbonIcon, TruckIcon } from "../ui/icons";

export default function Features() {
  return (
    <section className={styles["features"]}>
      <Container>
        <h2 className={styles["features__title"]}>
          Nuestra Promesa de Calidad
        </h2>
        <div className={styles["features__grid"]}>
          <div>
            <TruckIcon className={styles["feature__icon"]} />
            <h3 className={styles["feature__title"]}>Entrega rápida</h3>
            <p className={styles["feature__description"]}>
              Recibe tus productos en tiempo récord, directo a tu puerta, para
              que puedas disfrutar de ellos cuanto antes.
            </p>
          </div>

          <div>
            <ReturnIcon className={styles["feature__icon"]} />
            <h3 className={styles["feature__title"]}>
              Satisfacción Garantizada
            </h3>
            <p className={styles["feature__description"]}>
              Tu felicidad es nuestra prioridad. Si no estás 100% satisfecho,
              estamos aquí para ayudarte con cambios o devoluciones.
            </p>
          </div>

          <div>
            <RibbonIcon className={styles["feature__icon"]} />
            <h3 className={styles["feature__title"]}>
              Materiales de Alta Calidad
            </h3>
            <p className={styles["feature__description"]}>
              Nos aseguramos de que todos nuestros productos estén hechos con
              materiales de la más alta calidad.
            </p>
          </div>

          <div>
            <IdeaIcon className={styles["feature__icon"]} />
            <h3 className={styles["feature__title"]}>Diseños Exclusivos</h3>
            <p className={styles["feature__description"]}>
              Cada producto está diseñado pensando en los desarrolladores, con
              estilos únicos que no encontrarás en ningún otro lugar.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
