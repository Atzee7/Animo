"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { ScorePill } from "@/components/anime/score-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { useMounted } from "@/hooks/use-mounted";
import { formatFormat, formatYear } from "@/lib/utils/format";

export function FavoritesView() {
  const { favorites, count, removeFavorite, clearFavorites } = useFavorites();
  const mounted = useMounted();

  const handleClear = () => {
    if (window.confirm("Hapus semua anime dari favorit?")) {
      clearFavorites();
    }
  };

  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Koleksi"
        title="Favorit saya"
        description="Anime yang kamu simpan tersimpan di localStorage perangkat ini. Tidak ada akun, tidak ada database."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">
            {mounted ? count : "—"}
          </span>{" "}
          anime tersimpan
        </p>
        {mounted && count > 0 ? (
          <button
            type="button"
            onClick={handleClear}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Hapus semua
          </button>
        ) : null}
      </div>

      {!mounted ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[2/3] w-full" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-8" aria-hidden />}
          title="Belum ada favorit"
          description="Tekan ikon hati pada halaman detail anime untuk menyimpannya. Daftar favoritmu akan muncul di sini."
          action={
            <Link href="/browse" className={buttonVariants()}>
              Jelajahi anime
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
          {favorites.map((entry) => (
            <article key={entry.animeId} className="group relative min-w-0">
              <Link href={`/anime/${entry.animeId}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-raised">
                  {entry.coverImage ? (
                    <Image
                      src={entry.coverImage}
                      alt={entry.title}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 204px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <ScorePill
                    score={entry.averageScore}
                    className="absolute left-2 top-2"
                  />
                </div>

                <h2 className="mt-3 line-clamp-2 min-h-[2.2em] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
                  {entry.title}
                </h2>
                <p className="mt-2 text-[11px] text-muted">
                  {formatFormat(entry.format)} · {formatYear(entry.seasonYear)}
                </p>
              </Link>

              <button
                type="button"
                aria-label={`Hapus ${entry.title} dari favorit`}
                onClick={() => removeFavorite(entry.animeId)}
                className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-brand/40 bg-brand/15 text-brand backdrop-blur-sm transition-colors hover:bg-brand/25"
              >
                <Heart className="size-4 fill-brand" aria-hidden />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
