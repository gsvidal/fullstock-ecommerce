import { type ComponentPropsWithRef } from "react";
import { Link } from "react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

// La base no lleva color ni tamaño (van en variant/size)
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-background text-primary-foreground hover:bg-primary-background-hover",
        secondary:
          "bg-secondary-background text-secondary-foreground hover:bg-secondary-background-hover",
        outline:
          "border border-border bg-background text-muted-foreground hover:bg-muted-background",
        ghost: "bg-transparent text-muted-foreground hover:bg-muted-background",
      },
      size: {
        md: "h-8 rounded-lg px-2.5 py-1.5 text-sm [&_svg]:size-4",
        sm: "h-6 rounded-md px-2 py-1 text-sm [&_svg]:size-4",
        lg: "h-10 rounded-lg px-3.5 py-2.5 text-sm [&_svg]:size-4",
        xl: "h-12 rounded-lg px-8 py-3 text-base [&_svg]:size-5",
        "sm-icon": "size-7 rounded-lg p-1 text-sm [&_svg]:size-5",
        icon: "size-8 rounded-lg p-1.5 text-sm [&_svg]:size-5",
        "lg-icon": "size-9 rounded-lg p-2 text-sm [&_svg]:size-5",
        "xl-icon": "size-10 rounded-lg p-2 text-sm [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// Props derivados de la config;
type ButtonVariants = VariantProps<typeof buttonVariants>;
// excluimos el null de cva (desactivaría el eje → botón roto con nuestra base vacía).
type ButtonBaseProps = {
  variant?: Exclude<ButtonVariants["variant"], null>;
  size?: Exclude<ButtonVariants["size"], null>;
};

type ButtonAsButtonProps = ButtonBaseProps &
  ComponentPropsWithRef<"button"> & { href?: never };

type ButtonAsLinkProps = ButtonBaseProps &
  ComponentPropsWithRef<"a"> & { href: string };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button({
  variant,
  size,
  className,
  ...delegated
}: ButtonProps) {
  const buttonClassName = cn(buttonVariants({ variant, size }), className);

  if (typeof delegated.href === "string") {
    const { href, ...rest } = delegated;
    // Enlaces internos navegan con el router (sin recarga); los externos
    // siguen siendo un <a> nativo.
    if (href.startsWith("/")) {
      return <Link to={href} className={buttonClassName} {...rest} />;
    }
    return <a href={href} className={buttonClassName} {...rest} />;
  }

  return <button className={buttonClassName} {...delegated} />;
}
