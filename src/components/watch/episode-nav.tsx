import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface EpisodeNavProps {
  animeId: number;
  prevEpisode?: number | null;
  nextEpisode?: number | null;
}

export function EpisodeNav({
  animeId,
  prevEpisode,
  nextEpisode,
}: EpisodeNavProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {prevEpisode ? (
        <Link
          href={`/watch/${animeId}/${prevEpisode}`}
          className={buttonVariants({ variant: "secondary" })}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Episode {prevEpisode}
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Episode sebelumnya
        </span>
      )}

      {nextEpisode ? (
        <Link
          href={`/watch/${animeId}/${nextEpisode}`}
          className={buttonVariants()}
        >
          Episode {nextEpisode}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span
          className={cn(buttonVariants(), "pointer-events-none opacity-40")}
        >
          Episode berikutnya
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </div>
  );
}
