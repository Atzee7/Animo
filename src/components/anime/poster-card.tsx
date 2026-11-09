import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCardMeta, formatScore } from "@/lib/utils/format";
import type { AnimeSummary } from "@/types/anime";

interface PosterCardProps {
  anime: AnimeSummary;
  href?: string;
  badge?: string;
  meta?: string;
  priority?: boolean;
  showScore?: boolean;
  className?: string;
}

export function PosterCard({
  anime,
  href,
  badge,
  meta,
  priority = false,
  showScore = true,
  className,
}: PosterCardProps) {
  return (
    <article className={cn("group min-w-0", className)}>
      <Link href={href ?? `/anime/${anime.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-raised">
          {anime.coverImage ? (
            <Image
              src={anime.coverImage}
              alt={anime.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 204px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}

          {badge ? (
            <span className="absolute left-2 top-2 rounded bg-brand px-2 py-1 text-[10px] font-semibold leading-none text-brand-ink">
              {badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[2.2em] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
          {anime.title}
        </h3>

        <div className="mt-2 flex min-w-0 items-center gap-2 text-[11px]">
          {showScore ? (
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-gold">
              <Star className="size-3 fill-gold" aria-hidden />
              {formatScore(anime.averageScore)}
            </span>
          ) : null}
          <span className="truncate text-muted">
            {meta ?? formatCardMeta(anime)}
          </span>
        </div>
      </Link>
    </article>
  );
}
