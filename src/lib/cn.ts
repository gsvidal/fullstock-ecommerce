import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx para componer + tailwind-merge para que la última utilidad en conflicto
// gane (si no, el ganador lo decide el orden del stylesheet, no el del class).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
