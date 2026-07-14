import { type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

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
  size?: "sm";
};

export default function Container({
  as: Tag = "div",
  size,
  className,
  ...delegated
}: ContainerProps) {
  const containerClassName = clsx(
    styles["container"],
    size && styles[`container--${size}`],
    className,
  );

  return <Tag className={containerClassName} {...delegated} />;
}
