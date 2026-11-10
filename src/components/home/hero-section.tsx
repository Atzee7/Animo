import Image from "next/image";
import Link from "next/link";
import { ListVideo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FavoriteButton } from "@/components/anime/favorite-button";
import { ScorePill } from "@/components/anime/score-pill";
import { formatFormat, formatStatus, formatYear } from "@/lib/utils/format";
import type { AnimeSummary } from "@/types/anime";

interface HeroSectionProps {
  anime: AnimeSummary;
  episode?: number;
  badges?: string[];
  /** Only the first slide should preload its banner image. */
  isFirst?: boolean;
  /** CSS object-position for the banner crop. */
  imagePosition?: string;
}

export function HeroSection({
  anime,
  episode = 1,
  badges,
  isFirst = false,
  imagePosition,
}: HeroSectionProps) {
  const heroBadges =
    badges ??
    [
      anime.status ? formatStatus(anime.status) : null,
      anime.format ? formatFormat(anime.format) : null,
    ].filter((badge): badge is string => Boolean(badge));

  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute inset-0">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt=""
            fill
            priority={isFirst}
            loading="eager"
            sizes="100vw"
            draggable={false}
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
            className="object-cover object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,15,0.95)_0%,rgba(11,13,15,0.82)_35%,rgba(11,13,15,0.45)_60%,rgba(11,13,15,0.12)_85%,transparent_100%)]" />
        <div className="absolute inset-y-0 left-0 hidden w-[640px] bg-[linear-gradient(90deg,var(--color-background)_0%,var(--color-background)_90%,transparent_100%)] lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-background via-background/65 to-transparent" />
      </div>

      <div className="container-page relative flex min-h-[400px] flex-col justify-start pb-9 pt-7 sm:min-h-[460px] lg:min-h-[520px] lg:justify-end lg:pb-12 lg:pt-28">
        <div className="w-full max-w-[640px]">
          <div className="flex flex-wrap items-center gap-2">
            {heroBadges.map((badge, badgeIndex) => (
              <Badge key={badge} tone={badgeIndex === 0 ? "brand" : "neutral"}>
                {badge}
              </Badge>
            ))}
          </div>

          <h2 className="mt-4 max-w-[340px] text-balance font-display text-[clamp(28px,6vw,62px)] font-bold leading-[0.95] tracking-tight text-foreground sm:max-w-[640px]">
            {anime.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-soft sm:text-[13px]">
            <ScorePill score={anime.averageScore} variant="plain" />
            <span>{formatYear(anime.seasonYear)}</span>
            <span>{formatFormat(anime.format)}</span>
            <span>{formatStatus(anime.status)}</span>
          </div>

          {anime.genres.length > 0 ? (
            <p className="mt-3 text-[11px] text-soft sm:text-[13px]">
              {anime.genres.join(", ")}
            </p>
          ) : null}

          {anime.description ? (
            <p className="mt-3 max-w-[620px] text-xs leading-relaxed text-soft sm:text-sm">
              {anime.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/anime/${anime.id}?episode=${episode}`}
              draggable={false}
              className={buttonVariants({
                size: "lg",
                className: "h-11 px-5 text-[13px] lg:h-12 lg:px-6 lg:text-sm",
              })}
            >
              <ListVideo className="size-4" aria-hidden />
              Pilih Episode
            </Link>
            <FavoriteButton anime={anime} className="size-11 lg:size-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
