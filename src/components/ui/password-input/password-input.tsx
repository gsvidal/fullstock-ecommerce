import { useState, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import Button from "../button";
import styles from "./styles.module.css";
import { EyeIcon, EyeOffIcon } from "../icons";

type PasswordInputProps = Omit<ComponentPropsWithoutRef<"input">, "type">;

export default function PasswordInput({
  className,
  ...delegated
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles["password-input"]}>
      <input
        type={isVisible ? "text" : "password"}
        className={clsx(styles["password-input__field"], className)}
        {...delegated}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm-icon"
        className={styles["password-input__toggle"]}
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}
