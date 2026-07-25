import { useState, type ComponentPropsWithRef } from "react";
import Button from "./button";
import { EyeIcon, EyeOffIcon } from "./icons";
import { cn } from "../../lib/cn";

type PasswordInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

export default function PasswordInput({
  className,
  ...delegated
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative flex items-center">
      <input
        type={isVisible ? "text" : "password"}
        className={cn("pr-10 aria-invalid:border-error", className)}
        {...delegated}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm-icon"
        className="absolute right-1.5 text-muted-foreground"
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
}
