import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatScore } from "@/lib/utils/format";

interface ScorePillProps {
  score: number | null | undefined;
  className?: string;
  variant?: "overlay" | "plain";
}

export function ScorePill({
  score,
  className,
  variant = "overlay",
}: ScorePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold text-gold",
        variant === "overlay"
          ? "rounded bg-black/70 px-1.5 py-1 text-[11px] backdrop-blur-sm"
          : "text-[13px]",
        className,
      )}
    >
      <Star
        className={cn(variant === "overlay" ? "size-3" : "size-3.5", "fill-gold")}
        aria-hidden
      />
      {formatScore(score)}
    </span>
  );
}
