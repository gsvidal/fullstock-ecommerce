import { type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const containerVariants = cva("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-3xl",
    },
  },
});

type ContainerVariants = VariantProps<typeof containerVariants>;

type ContainerElement =
  | "div"
  | "main"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "nav";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  as?: ContainerElement;
  size?: Exclude<ContainerVariants["size"], null>;
};

export default function Container({
  as: Tag = "div",
  size,
  className,
  ...delegated
}: ContainerProps) {
  return (
    <Tag
      className={cn(containerVariants({ size }), className)}
      {...delegated}
    />
  );
}
