import type { ComponentPropsWithoutRef } from "react";
import Container from "./container";
import { cn } from "../../lib/cn";
type ProseProps = ComponentPropsWithoutRef<"article">;

export default function Prose({ className, ...delegated }: ProseProps) {
  return (
    <Container
      as="article"
      size="sm"
      className={cn("prose", className)}
      {...delegated}
    />
  );
}
