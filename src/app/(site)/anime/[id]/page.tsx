import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListVideo, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FavoriteButton } from "@/components/anime/favorite-button";
import { ScorePill } from "@/components/anime/score-pill";
import { EpisodeList } from "@/components/watch/episode-list";
import { getAnimeDetail } from "@/lib/anilist/client";
import {
  getAnimeParadiseEpisodes,
  resolveAnimeParadiseMatch,
} from "@/lib/animeparadise/server";
import { mapAnimeParadiseEpisode } from "@/lib/animeparadise/mapper";
import {
  formatEpisodeCount,
  formatFormat,
  formatStatus,
  formatYear,
} from "@/lib/utils/format";
import type { EpisodeSummary } from "@/types/watch";

export default async function AnimeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ episode?: string | string[] }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const animeId = Number(id);

  if (!Number.isInteger(animeId) || animeId <= 0) notFound();

  const anime = await getAnimeDetail(animeId);
  if (!anime) notFound();

  let episodes: EpisodeSummary[] = [];

  try {
    const match = await resolveAnimeParadiseMatch(anime);
    if (match) {
      const rawEpisodes = await getAnimeParadiseEpisodes(match._id);
      episodes = rawEpisodes
        .map(mapAnimeParadiseEpisode)
        .sort((a, b) => a.number - b.number);
    }
  } catch (error) {
    console.error("Failed to load AnimeParadise episodes", error);
  }

  const requestedEpisode = Array.isArray(query.episode)
    ? query.episode[0]
    : query.episode;
  const requestedNumber = requestedEpisode ? Number(requestedEpisode) : NaN;
  const selectedEpisode =
    episodes.find((episode) => episode.number === requestedNumber)?.number ??
    episodes[0]?.number ??
    1;

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-card bg-surface-raised md:mx-0">
          {anime.coverImage ? (
            <Image
              src={anime.coverImage}
              alt={anime.title}
              fill
              priority
              sizes="220px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Detail anime
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {anime.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <ScorePill score={anime.averageScore} />
            <span>{formatYear(anime.seasonYear)}</span>
            <span>{formatFormat(anime.format)}</span>
            <span>{formatStatus(anime.status)}</span>
            <span>{formatEpisodeCount(anime.episodes)}</span>
          </div>

          {anime.genres.length > 0 ? (
            <p className="mt-3 text-sm text-subtle">
              {anime.genres.join(" · ")}
            </p>
          ) : null}

          {anime.description ? (
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
              {anime.description}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#episodes"
              className={buttonVariants({ size: "lg" })}
            >
              <ListVideo className="size-4" aria-hidden />
              Pilih Episode
            </a>
            <FavoriteButton anime={anime} showLabel />
          </div>
        </div>
      </div>

      <section id="episodes" className="mt-12 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Daftar Episode
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Pilih episode untuk mulai menonton
            </h2>
            <p className="mt-1 text-sm text-muted">
              Klik nomor episode untuk memutar. Episode yang ditandai berasal
              dari pilihan sebelumnya.
            </p>
          </div>
          {episodes.length > 0 ? (
            <Link
              href={`/watch/${anime.id}/${selectedEpisode}`}
              className={buttonVariants()}
            >
              <Play className="size-4 fill-brand-ink" aria-hidden />
              Tonton Episode {selectedEpisode}
            </Link>
          ) : null}
        </div>

        {episodes.length > 0 ? (
          <div className="mt-5 max-h-[460px] overflow-y-auto pr-1">
            <EpisodeList
              animeId={anime.id}
              episodes={episodes}
              currentEpisode={selectedEpisode}
            />
          </div>
        ) : (
          <EmptyState
            className="mt-5"
            icon={<ListVideo className="size-8" aria-hidden />}
            title="Episode belum tersedia"
            description="Sumber episode untuk anime ini belum ditemukan. Metadata tetap bisa kamu lihat, dan daftar episode akan muncul saat sumbernya tersedia."
          />
        )}
      </section>

      {anime.recommendations.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-xl font-bold">Rekomendasi</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {anime.recommendations.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={`/anime/${item.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-card bg-surface-raised">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-brand">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
