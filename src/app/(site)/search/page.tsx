import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { PosterCard } from "@/components/anime/poster-card";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { searchAnimePage } from "@/lib/anilist/client";
import type { AnimeSummary } from "@/types/anime";
import type { Paginated } from "@/types/api";

export const metadata = {
  title: "Pencarian",
};

const PER_PAGE = 24;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function SearchForm({
  defaultValue = "",
  centered = false,
}: {
  defaultValue?: string;
  centered?: boolean;
}) {
  return (
    <form
      method="get"
      action="/search"
      className={
        centered
          ? "relative mx-auto mt-8 w-full"
          : "relative mt-5"
      }
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle"
        aria-hidden
      />
      <input
        name="q"
        defaultValue={defaultValue}
        required
        minLength={2}
        placeholder="Cari judul anime…"
        aria-label="Cari anime"
        className="h-12 w-full rounded-pill border border-border bg-surface pl-11 pr-24 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-brand/60 sm:pr-28"
      />
      <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {defaultValue ? (
          <Link
            href="/search"
            aria-label="Hapus pencarian"
            className="flex size-9 items-center justify-center rounded-full text-subtle transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </Link>
        ) : null}
        <button
          type="submit"
          aria-label="Cari"
          className={buttonVariants({
            className: "h-9 px-3 sm:px-4",
          })}
        >
          <Search className="size-4 sm:hidden" aria-hidden />
          <span className="hidden sm:inline">Cari</span>
        </button>
      </div>
    </form>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = first(params.q)?.trim() ?? "";
  const parsedPage = Number(first(params.page));
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const hasQuery = q.length >= 2;
  let result: Paginated<AnimeSummary> | null = null;

  if (hasQuery) {
    try {
      result = await searchAnimePage(q, page, PER_PAGE);
    } catch (error) {
      console.error("Failed to search anime", error);
    }
  }

  const lastPage = Math.max(1, result?.lastPage ?? 1);

  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams({ q });
    if (targetPage > 1) query.set("page", String(targetPage));
    return `/search?${query.toString()}`;
  };

  return (
    <div
      className={cn(
        "container-page",
        hasQuery ? "py-10" : "py-0 lg:flex lg:flex-1 lg:flex-col",
      )}
    >
      {!hasQuery ? (
        <div className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center text-center lg:min-h-0 lg:flex-1">
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-brand/50" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
                Pencarian
              </span>
              <span className="h-px w-6 bg-brand/50" aria-hidden />
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Cari anime
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Temukan judul, genre, atau karakter favoritmu.
            </p>
            <SearchForm centered />
          </div>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hasil untuk “{q}”
          </h1>
          <SearchForm defaultValue={q} />

          {!result ? (
            <EmptyState
              className="mt-8"
              icon={<Search className="size-8" aria-hidden />}
              title="Pencarian gagal"
              description="Sumber data sedang tidak bisa diakses. Coba lagi sebentar."
              action={
                <Link href={buildPageHref(1)} className={buttonVariants()}>
                  Coba lagi
                </Link>
              }
            />
          ) : result.items.length === 0 ? (
            <EmptyState
              className="mt-8"
              icon={<Search className="size-8" aria-hidden />}
              title={`Tidak ada hasil untuk “${q}”`}
              description="Coba kata kunci lain, periksa ejaan, atau jelajahi katalog."
              action={
                <Link href="/browse" className={buttonVariants()}>
                  Jelajahi katalog
                </Link>
              }
            />
          ) : (
            <>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-foreground">
                    {result.total >= 5000
                      ? "5.000+"
                      : result.total.toLocaleString("id-ID")}
                  </span>{" "}
                  hasil ditemukan
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
        </>
      )}
    </div>
  );
}
