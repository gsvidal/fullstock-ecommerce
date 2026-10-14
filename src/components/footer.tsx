import { type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, Container, Section, Separator } from "./ui";

type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    console.log("Suscripción al boletín:", formData.get("email"));
  }

  return (
    <footer className={className}>
      <Container>
        <Section className="flex flex-col gap-8 lg:flex-row">
          <div className="flex grow flex-wrap gap-x-8 gap-y-4">
            <ul
              role="list"
              className="flex grow basis-40 flex-col gap-6 text-sm/6 text-muted-foreground"
            >
              <li className="font-medium text-foreground">Tienda</li>
              <li>
                <Link to="/categories/polos">Polos</Link>
              </li>
              <li>
                <Link to="/categories/tazas">Tazas</Link>
              </li>
              <li>
                <Link to="/categories/stickers">Stickers</Link>
              </li>
            </ul>
            <ul
              role="list"
              className="flex grow basis-40 flex-col gap-6 text-sm/6 text-muted-foreground"
            >
              <li className="font-medium text-foreground">Compañía</li>
              <li>
                <Link to="/about">Quienes somos</Link>
              </li>
              <li>
                <Link to="/terms">Términos y condiciones</Link>
              </li>
              <li>
                <Link to="/privacy">Privacidad</Link>
              </li>
            </ul>
            <ul
              role="list"
              className="flex grow basis-40 flex-col gap-6 text-sm/6 text-muted-foreground"
            >
              <li className="font-medium text-foreground">Conecta</li>
              <li>
                <a href="https://wa.me/" target="_blank">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" target="_blank">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div className="max-w-md text-sm/6">
            <p className="mb-6 font-medium">Suscríbete a nuestro boletín</p>
            <p className="mb-2 text-muted-foreground">
              Recibe las últimas ofertas y descuentos en tu correo semanalmente.
            </p>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                className="grow"
                type="email"
                aria-label="Correo"
                name="email"
                required
                placeholder="ejemplo@mail.com"
                autoComplete="email"
              />
              <Button variant="secondary" size="lg" type="submit">
                Suscribirse
              </Button>
            </form>
          </div>
        </Section>
        <Separator />
        <small className="block py-6 text-center text-sm/6 text-muted-foreground">
          Todos los derechos reservados © Full Stock
        </small>
      </Container>
    </footer>
  );
}
