import heroImage from "../assets/hero.jpg";
import { Button, Container } from "./ui";

export default function Hero() {
  return (
    <section className="relative overflow-hidden text-center text-(--white)">
      <img
        src={heroImage}
        alt="Nuevos productos"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/50" />
      <Container size="sm" className="relative py-32">
        <h2 className="mb-4 text-4xl font-bold md:text-6xl">
          Nuevos productos disponibles
        </h2>
        <p className="mb-8 text-xl">
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
