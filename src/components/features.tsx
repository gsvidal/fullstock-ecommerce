import { Container } from "./ui";
import { IdeaIcon, ReturnIcon, RibbonIcon, TruckIcon } from "./ui/icons";

export default function Features() {
  return (
    <section className="bg-muted-background py-12 text-center md:py-24">
      <Container>
        <h2 className="mb-12 text-2xl/6 font-bold">
          Nuestra Promesa de Calidad
        </h2>
        <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-4">
          <div>
            <TruckIcon className="mb-6 inline-block" />
            <h3 className="mb-2 text-sm font-medium">Entrega rápida</h3>
            <p className="text-sm text-muted-foreground">
              Recibe tus productos en tiempo récord, directo a tu puerta, para
              que puedas disfrutar de ellos cuanto antes.
            </p>
          </div>

          <div>
            <ReturnIcon className="mb-6 inline-block" />
            <h3 className="mb-2 text-sm font-medium">
              Satisfacción Garantizada
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu felicidad es nuestra prioridad. Si no estás 100% satisfecho,
              estamos aquí para ayudarte con cambios o devoluciones.
            </p>
          </div>

          <div>
            <RibbonIcon className="mb-6 inline-block" />
            <h3 className="mb-2 text-sm font-medium">
              Materiales de Alta Calidad
            </h3>
            <p className="text-sm text-muted-foreground">
              Nos aseguramos de que todos nuestros productos estén hechos con
              materiales de la más alta calidad.
            </p>
          </div>

          <div>
            <IdeaIcon className="mb-6 inline-block" />
            <h3 className="mb-2 text-sm font-medium">Diseños Exclusivos</h3>
            <p className="text-sm text-muted-foreground">
              Cada producto está diseñado pensando en los desarrolladores, con
              estilos únicos que no encontrarás en ningún otro lugar.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
