import Container from "./container";
import Section from "./section";

type SpinnerProps = {
  label?: string;
};

export default function Spinner({ label = "Cargando..." }: SpinnerProps) {
  return (
    <Section>
      <Container>
        <div className="flex justify-center py-12" role="status">
          <div className="size-10 animate-spin rounded-full border-[3px] border-border border-t-foreground [animation-duration:0.8s] motion-reduce:[animation-duration:2s]" />
          <span className="sr-only">{label}</span>
        </div>
      </Container>
    </Section>
  );
}
