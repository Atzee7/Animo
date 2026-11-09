import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatFormat, formatYear } from "@/lib/utils/format";
import type { AnimeSummary } from "@/types/anime";
import { FavoriteButton } from "./favorite-button";
import { ScorePill } from "./score-pill";

interface AnimeCardProps {
  anime: AnimeSummary;
  priority?: boolean;
  className?: string;
  episode?: number | null;
}

export function AnimeCard({
  anime,
  priority = false,
  className,
  episode,
}: AnimeCardProps) {
  const href = episode
    ? `/anime/${anime.id}?episode=${episode}`
    : `/anime/${anime.id}`;

  return (
    <article className={cn("group relative min-w-0", className)}>
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-card bg-surface-raised">
          {anime.coverImage ? (
            <Image
              src={anime.coverImage}
              alt={anime.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

          <ScorePill
            score={anime.averageScore}
            className="absolute bottom-2 left-2"
          />

          {episode ? (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-brand px-1.5 py-1 text-[10px] font-bold text-brand-ink">
              <Play className="size-3 fill-brand-ink" aria-hidden />
              EP {episode}
            </span>
          ) : null}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand text-brand-ink shadow-lg">
              <Play className="ml-0.5 size-5 fill-brand-ink" aria-hidden />
            </span>
          </div>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
          {anime.title}
        </h3>
        <p className="mt-1 text-[11px] text-subtle">
          {formatFormat(anime.format)} · {formatYear(anime.seasonYear)}
        </p>
      </Link>

      <FavoriteButton
        anime={anime}
        className="absolute right-2 top-2 z-10 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      />
    </article>
  );
}
