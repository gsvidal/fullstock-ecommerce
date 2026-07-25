import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

type SectionProps = ComponentPropsWithoutRef<"section">;

export default function Section({ className, ...delegated }: SectionProps) {
  return (
    <section
      className={cn("py-12 sm:py-16 lg:py-24", className)}
      {...delegated}
    />
  );
}
