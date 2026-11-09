import { PosterCard } from "@/components/anime/poster-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { AiringEpisode } from "@/types/anime";

interface RecentEpisodesProps {
  episodes: AiringEpisode[];
}

export function RecentEpisodes({ episodes }: RecentEpisodesProps) {
  const uniqueEpisodes = episodes
    .filter(
      (item, index, list) =>
        list.findIndex((entry) => entry.anime.id === item.anime.id) === index,
    )
    .slice(0, 6);

  if (uniqueEpisodes.length === 0) return null;

  return (
    <section>
      <SectionHeading
        title="Episode Terbaru"
        href="/browse?sort=START_DATE_DESC"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
        {uniqueEpisodes.map(({ anime, episode }, index) => (
          <PosterCard
            key={`${anime.id}-${episode}`}
            anime={anime}
            href={`/anime/${anime.id}?episode=${episode}`}
            badge={`Ep ${episode}`}
            showScore={false}
            className={index >= 4 ? "max-md:hidden" : undefined}
            meta={
              anime.episodes
                ? `${anime.seasonYear ?? "—"}, ${anime.episodes} episodes`
                : `${anime.seasonYear ?? "—"}, ongoing`
            }
          />
        ))}
      </div>
    </section>
  );
}
