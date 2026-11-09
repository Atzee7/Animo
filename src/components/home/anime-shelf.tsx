import { PosterCard } from "@/components/anime/poster-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { AnimeSummary } from "@/types/anime";

interface AnimeShelfProps {
  title: string;
  anime: AnimeSummary[];
  href?: string;
  linkLabel?: string;
  limit?: number;
}

export function AnimeShelf({
  title,
  anime,
  href,
  linkLabel,
  limit = 6,
}: AnimeShelfProps) {
  if (anime.length === 0) return null;

  return (
    <section>
      <SectionHeading title={title} href={href} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
        {anime.slice(0, limit).map((item, index) => (
          <PosterCard
            key={item.id}
            anime={item}
            className={index >= 4 ? "max-md:hidden" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
