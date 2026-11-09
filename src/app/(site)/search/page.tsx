import Link from "next/link";
import { Search } from "lucide-react";
import { PosterCard } from "@/components/anime/poster-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { buttonVariants } from "@/components/ui/button";
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

  let result: Paginated<AnimeSummary> | null = null;

  if (q.length >= 2) {
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
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Pencarian"
        title={q.length >= 2 ? `Hasil untuk “${q}”` : "Cari anime"}
        description={
          q.length >= 2
            ? "Hasil pencarian, diurutkan berdasarkan relevansi."
            : "Ketik judul anime yang ingin kamu cari, lalu tekan Enter atau tombol Cari."
        }
      />

      <form
        method="get"
        action="/search"
        className="mb-8 rounded-card border border-border bg-surface p-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle"
              aria-hidden
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari judul anime…"
              aria-label="Cari anime"
              className="h-11 w-full rounded-card border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-brand/60"
            />
          </div>
          <button
            type="submit"
            className={buttonVariants({ size: "lg", className: "h-11" })}
          >
            Cari
          </button>
        </div>
      </form>

      {q.length < 2 ? (
        <EmptyState
          icon={<Search className="size-8" aria-hidden />}
          title="Mulai mencari"
          description="Ketik minimal 2 karakter untuk mencari anime berdasarkan judul."
        />
      ) : !result ? (
        <EmptyState
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
          icon={<Search className="size-8" aria-hidden />}
          title={`Tidak ada hasil untuk “${q}”`}
          description="Coba kata kunci lain, periksa ejaan, atau jelajahi katalog anime."
          action={
            <Link href="/browse" className={buttonVariants()}>
              Jelajahi katalog
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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

          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
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
