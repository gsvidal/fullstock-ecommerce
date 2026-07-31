import { type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorVariants = VariantProps<typeof separatorVariants>;

type SeparatorProps = ComponentPropsWithoutRef<"div"> & {
  orientation?: Exclude<SeparatorVariants["orientation"], null>;
};

export default function Separator({
  orientation,
  className,
  ...delegated
}: SeparatorProps) {
  return (
    <div
      className={cn(separatorVariants({ orientation }), className)}
      {...delegated}
    />
  );
}
