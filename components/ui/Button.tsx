import { clsx } from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-blue-600",
        variant === "ghost" &&
          "border border-slate-700 bg-slate-900 hover:bg-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
