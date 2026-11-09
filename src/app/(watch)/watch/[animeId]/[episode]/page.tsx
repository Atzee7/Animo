import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ListVideo } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WatchView } from "@/components/watch/watch-view";
import { getAnimeDetail } from "@/lib/anilist/client";
import {
  getAnimeParadiseEpisodes,
  resolveAnimeParadiseMatch,
} from "@/lib/animeparadise/server";
import { mapAnimeParadiseEpisode } from "@/lib/animeparadise/mapper";
import type { EpisodeSummary } from "@/types/watch";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ animeId: string; episode: string }>;
}) {
  const { animeId, episode } = await params;
  const id = Number(animeId);
  const episodeNumber = Number(episode);

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !Number.isFinite(episodeNumber) ||
    episodeNumber <= 0
  ) {
    notFound();
  }

  const anime = await getAnimeDetail(id);
  if (!anime) notFound();

  let animeParadiseId: string | null = null;
  let episodes: EpisodeSummary[] = [];

  try {
    const match = await resolveAnimeParadiseMatch(anime);
    if (match) {
      animeParadiseId = match._id;
      const rawEpisodes = await getAnimeParadiseEpisodes(match._id);
      episodes = rawEpisodes
        .map(mapAnimeParadiseEpisode)
        .sort((a, b) => a.number - b.number);
    }
  } catch (error) {
    console.error("Failed to load AnimeParadise episodes", error);
  }

  const currentEpisode = episodes.find(
    (item) => item.number === episodeNumber,
  );

  if (!animeParadiseId || !currentEpisode) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <ListVideo className="mb-5 size-9 text-muted" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Episode {episodeNumber}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          Episode belum tersedia
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          Sumber episode untuk <strong>{anime.title}</strong> belum ditemukan.
          Coba pilih episode lain dari halaman detail.
        </p>
        <Link
          href={`/anime/${anime.id}?episode=${episodeNumber}`}
          className={buttonVariants({ className: "mt-7" })}
        >
          <ChevronLeft className="size-4" aria-hidden />
          Kembali ke detail anime
        </Link>
      </div>
    );
  }

  return (
    <WatchView
      animeId={anime.id}
      animeTitle={anime.title}
      coverImage={anime.coverImage || null}
      bannerImage={anime.bannerImage || null}
      episodeNumber={episodeNumber}
      episodeTitle={currentEpisode.title}
      episodes={episodes}
      origin={animeParadiseId}
      uid={currentEpisode.uid}
    />
  );
}
