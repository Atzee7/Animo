import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeTone = "brand" | "neutral" | "gold" | "coral";

const toneStyles: Record<BadgeTone, string> = {
  brand: "bg-brand text-brand-ink",
  neutral: "bg-surface-raised text-foreground",
  gold: "bg-gold/15 text-gold",
  coral: "bg-coral/15 text-coral",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded px-2 text-[11px] font-semibold leading-none",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
