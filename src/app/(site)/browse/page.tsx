import Link from "next/link";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { PosterCard } from "@/components/anime/poster-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { getBrowseAnime } from "@/lib/anilist/client";
import type { AnimeSummary } from "@/types/anime";
import type { Paginated } from "@/types/api";

export const metadata = {
  title: "Jelajahi",
};

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

const STATUS_VALUES = [
  "RELEASING",
  "FINISHED",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
] as const;

const BASE_SORTS = [
  { value: "POPULARITY_DESC", label: "Terpopuler" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "SCORE_DESC", label: "Skor tertinggi" },
  { value: "START_DATE_DESC", label: "Terbaru" },
  { value: "TITLE_ROMAJI", label: "A–Z" },
] as const;

const PER_PAGE = 24;

const chipClass = (active: boolean) =>
  cn(
    "inline-flex h-9 shrink-0 items-center rounded-pill border px-3.5 text-xs font-semibold transition-colors",
    active
      ? "border-brand/40 bg-brand text-brand-ink"
      : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
  );

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const genreParam = first(params.genre) ?? "";
  const statusParam = first(params.status) ?? "";
  const sortParam = first(params.sort) ?? "";
  const pageParam = first(params.page) ?? "";

  const genre = GENRES.includes(genreParam as (typeof GENRES)[number])
    ? genreParam
    : "";
  const status = STATUS_VALUES.includes(
    statusParam as (typeof STATUS_VALUES)[number],
  )
    ? statusParam
    : "";

  const parsedPage = Number(pageParam);
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const sortValues: string[] = BASE_SORTS.map((item) => item.value);
  const sort = sortValues.includes(sortParam)
    ? sortParam
    : "POPULARITY_DESC";

  let result: Paginated<AnimeSummary> | null = null;

  try {
    result = await getBrowseAnime({
      page,
      perPage: PER_PAGE,
      genre: genre || null,
      status: status || null,
      sort: [sort],
    });
  } catch (error) {
    console.error("Failed to load browse catalog", error);
  }

  const lastPage = Math.max(1, result?.lastPage ?? 1);

  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams();

    if (genre) query.set("genre", genre);
    if (status) query.set("status", status);
    query.set("sort", sort);
    if (targetPage > 1) query.set("page", String(targetPage));

    return `/browse?${query.toString()}`;
  };

  const buildFilterHref = (
    overrides: { genre?: string; status?: string; sort?: string } = {},
  ) => {
    const nextGenre = overrides.genre ?? genre;
    const nextStatus = overrides.status ?? status;
    const nextSort = overrides.sort ?? sort;

    const query = new URLSearchParams();
    if (nextGenre) query.set("genre", nextGenre);
    if (nextStatus) query.set("status", nextStatus);
    query.set("sort", nextSort);

    return `/browse?${query.toString()}`;
  };

  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Katalog"
        title="Jelajahi anime"
        description="Temukan anime berdasarkan genre dan urutan."
      />

      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3">
          <span className="w-14 shrink-0 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">
            Urutkan
          </span>
          <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 max-lg:[mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)] lg:flex-wrap lg:overflow-visible">
            {BASE_SORTS.map((item) => (
              <Link
                key={item.value}
                href={buildFilterHref({ sort: item.value })}
                aria-current={item.value === sort ? "page" : undefined}
                className={chipClass(item.value === sort)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="w-14 shrink-0 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">
            Genre
          </span>
          <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 max-lg:[mask-image:linear-gradient(to_right,#000_calc(100%-2rem),transparent)] lg:flex-wrap lg:overflow-visible">
            <Link
              href={buildFilterHref({ genre: "" })}
              aria-current={!genre ? "page" : undefined}
              className={chipClass(!genre)}
            >
              Semua
            </Link>
            {GENRES.map((item) => (
              <Link
                key={item}
                href={buildFilterHref({ genre: item })}
                aria-current={item === genre ? "page" : undefined}
                className={chipClass(item === genre)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {!result ? (
        <EmptyState
          className="mt-8"
          icon={<Compass className="size-8" aria-hidden />}
          title="Gagal memuat katalog"
          description="Sumber data sedang tidak bisa diakses. Coba muat ulang halaman ini."
          action={
            <Link href="/browse" className={buttonVariants()}>
              Coba lagi
            </Link>
          }
        />
      ) : result.items.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Compass className="size-8" aria-hidden />}
          title="Tidak ada anime yang cocok"
          description="Coba pilih genre lain atau reset filter untuk melihat katalog lainnya."
          action={
            <Link href="/browse" className={buttonVariants()}>
              Reset filter
            </Link>
          }
        />
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>
                <span className="font-semibold text-foreground">
                  {result.total >= 5000
                    ? "5.000+"
                    : result.total.toLocaleString("id-ID")}
                </span>{" "}
                anime ditemukan
              </span>
              {status ? (
                <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand">
                  {status === "RELEASING" ? "Ongoing" : status}
                </span>
              ) : null}
              {genre ? (
                <span className="rounded bg-surface-raised px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-soft">
                  {genre}
                </span>
              ) : null}
              {genre || status ? (
                <Link
                  href={buildFilterHref({ genre: "", status: "" })}
                  className="text-xs font-semibold text-brand transition-colors hover:text-brand/80"
                >
                  Reset
                </Link>
              ) : null}
            </p>
            <p className="text-xs text-muted">
              Halaman {result.page} dari {lastPage}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
            {result.items.map((anime, index) => (
              <PosterCard
                key={anime.id}
                anime={anime}
                priority={index < 3}
              />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3">
            {result.page > 1 ? (
              <Link
                href={buildPageHref(result.page - 1)}
                aria-label="Halaman sebelumnya"
                className={buttonVariants({
                  variant: "secondary",
                  className: "h-11",
                })}
              >
                <ChevronLeft className="size-4" aria-hidden />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Link>
            ) : (
              <span
                className={buttonVariants({
                  variant: "secondary",
                  className: "pointer-events-none h-11 opacity-40",
                })}
              >
                <ChevronLeft className="size-4" aria-hidden />
                <span className="hidden sm:inline">Sebelumnya</span>
              </span>
            )}

            <span className="text-xs text-muted">
              Halaman {result.page} / {lastPage}
            </span>

            {result.hasNextPage ? (
              <Link
                href={buildPageHref(result.page + 1)}
                aria-label="Halaman berikutnya"
                className={buttonVariants({ className: "h-11" })}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <span
                className={buttonVariants({
                  className: "pointer-events-none h-11 opacity-40",
                })}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-4" aria-hidden />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
