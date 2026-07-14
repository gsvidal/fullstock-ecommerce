import { type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type SectionProps = ComponentPropsWithoutRef<"section">;

export default function Section({ className, ...delegated }: SectionProps) {
  const sectionClassName = clsx(styles["section"], className);

  return <section className={sectionClassName} {...delegated} />;
}
