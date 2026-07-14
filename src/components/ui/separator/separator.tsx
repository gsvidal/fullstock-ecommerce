import { type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type SeparatorProps = ComponentPropsWithoutRef<"div"> & {
  orientation?: "horizontal" | "vertical";
};

export default function Separator({
  orientation = "horizontal",
  className,
  ...delegated
}: SeparatorProps) {
  const separatorClassName = clsx(
    styles["separator"],
    orientation === "vertical" && styles["separator--vertical"],
    className,
  );

  return <div className={separatorClassName} {...delegated} />;
}
