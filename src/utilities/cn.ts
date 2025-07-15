// utils/cn.ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge arbitrary Tailwind/utility class-names
 * while de-duping conflicting Tailwind tokens.
 *
 * @example
 *   cn("p-2 bg-red-500", isActive && "bg-green-500")
 *   // -> "p-2 bg-green-500"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
