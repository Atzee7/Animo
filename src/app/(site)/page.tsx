import { AnimeShelf } from "@/components/home/anime-shelf";
import { ContinueWatchingRail } from "@/components/home/continue-watching-rail";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { RecentEpisodes } from "@/components/home/recent-episodes";
import {
  getPopularAnime,
  getRecentEpisodes,
  getTopAiring,
} from "@/lib/anilist/client";
import { demoContinueWatching, featuredItems } from "@/lib/featured";

export default async function HomePage() {
  const [recentEpisodes, topAiring, popularAnime] = await Promise.all([
    getRecentEpisodes(20).catch(() => []),
    getTopAiring(12).catch(() => []),
    getPopularAnime(6).catch(() => []),
  ]);

  return (
    <>
      <HeroCarousel items={featuredItems} />

      <div className="container-page space-y-10 pb-10 pt-10 lg:space-y-12 lg:pb-11 lg:pt-12">
        <ContinueWatchingRail fallback={demoContinueWatching} />
        <RecentEpisodes episodes={recentEpisodes} />

        <AnimeShelf
          title="Top Airing"
          anime={topAiring}
          href="/browse?status=RELEASING&sort=POPULARITY_DESC"
          limit={12}
        />

        <AnimeShelf
          title="Anime Populer"
          anime={popularAnime}
          href="/browse?sort=POPULARITY_DESC"
          limit={6}
        />
      </div>
    </>
  );
}
