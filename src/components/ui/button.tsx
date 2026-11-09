import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-pill font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-ink hover:bg-brand/90 active:bg-brand/80",
  secondary:
    "border border-border-strong bg-surface text-foreground hover:border-muted/60 hover:bg-surface-raised",
  ghost: "text-muted hover:bg-surface hover:text-foreground",
  icon: "border border-border-strong bg-surface text-foreground hover:border-muted/60 hover:bg-surface-raised",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    baseStyles,
    variantStyles[variant],
    variant === "icon" ? "size-10 rounded-full p-0" : sizeStyles[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
