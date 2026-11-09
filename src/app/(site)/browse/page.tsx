import Link from "next/link";
import { Compass, SlidersHorizontal } from "lucide-react";
import { PosterCard } from "@/components/anime/poster-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
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
const FIELD_CLASS =
  "h-10 w-full rounded-card border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-brand/60";
const LABEL_CLASS =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted";

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

  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Katalog"
        title="Jelajahi anime"
        description="Temukan anime berdasarkan genre. Data diambil langsung dari AniList."
      />

      <form
        method="get"
        className="rounded-card border border-border bg-surface p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {status ? (
            <input type="hidden" name="status" value={status} />
          ) : null}

          <label className="sm:flex-1">
            <span className={LABEL_CLASS}>Urutkan</span>
            <select name="sort" defaultValue={sort} className={FIELD_CLASS}>
              {BASE_SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="sm:flex-1">
            <span className={LABEL_CLASS}>Genre</span>
            <select name="genre" defaultValue={genre} className={FIELD_CLASS}>
              <option value="">Semua genre</option>
              {GENRES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className={buttonVariants({ className: "flex-1 sm:flex-none" })}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Terapkan
            </button>
            <Link
              href="/browse"
              className={buttonVariants({ variant: "secondary" })}
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {!result ? (
        <EmptyState
          className="mt-8"
          icon={<Compass className="size-8" aria-hidden />}
          title="Gagal memuat katalog"
          description="AniList sedang tidak bisa diakses. Coba muat ulang halaman ini."
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
                className={buttonVariants({ variant: "secondary" })}
              >
                Sebelumnya
              </Link>
            ) : (
              <span
                className={buttonVariants({
                  variant: "secondary",
                  className: "pointer-events-none opacity-40",
                })}
              >
                Sebelumnya
              </span>
            )}

            <span className="text-xs text-muted">
              Halaman {result.page} / {lastPage}
            </span>

            {result.hasNextPage ? (
              <Link
                href={buildPageHref(result.page + 1)}
                className={buttonVariants()}
              >
                Berikutnya
              </Link>
            ) : (
              <span
                className={buttonVariants({
                  className: "pointer-events-none opacity-40",
                })}
              >
                Berikutnya
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
