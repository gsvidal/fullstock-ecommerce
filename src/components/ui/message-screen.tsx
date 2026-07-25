import type { ReactNode } from "react";
import Container from "./container";
import Section from "./section";

type MessageScreenProps = {
  title: string;
  description: string;
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
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold">{title}</h1>
          <p className="mb-4 text-muted-foreground">{description}</p>
          {children}
        </div>
      </Container>
    </Section>
  );
}
