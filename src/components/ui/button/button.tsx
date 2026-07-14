import { type ComponentPropsWithRef } from "react";
import { Link } from "react-router";
import clsx from "clsx";
import styles from "./styles.module.css";

type ButtonBaseProps = {
  variant?: "secondary" | "outline" | "ghost";
  size?: "sm" | "lg" | "xl" | "sm-icon" | "icon" | "lg-icon" | "xl-icon";
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
  const buttonClassName = clsx(
    styles["button"],
    variant && styles[`button--${variant}`],
    size && styles[`button--${size}`],
    className,
  );

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
