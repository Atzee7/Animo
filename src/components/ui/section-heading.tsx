import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeading({
  title,
  href,
  linkLabel = "Lihat semua",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4", className)}>
      <h2 className="font-display text-[22px] font-bold leading-none tracking-tight text-foreground">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="mt-1 text-[11px] font-semibold text-muted transition-colors hover:text-brand"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
