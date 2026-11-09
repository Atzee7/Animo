"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils/cn";
import type { AnimeSummary } from "@/types/anime";

interface FavoriteButtonProps {
  anime: AnimeSummary;
  className?: string;
  showLabel?: boolean;
}

export function FavoriteButton({
  anime,
  className,
  showLabel = false,
}: FavoriteButtonProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const active = favorites.some((entry) => entry.animeId === anime.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Hapus dari favorit" : "Tambah ke favorit"}
      onClick={() =>
        toggleFavorite({
          animeId: anime.id,
          title: anime.title,
          coverImage: anime.coverImage,
          format: anime.format,
          averageScore: anime.averageScore,
          seasonYear: anime.seasonYear,
        })
      }
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border transition-colors",
        showLabel ? "h-12 px-5 text-sm font-semibold" : "size-9",
        active
          ? "border-brand/40 bg-brand/15 text-brand"
          : "border-border-strong bg-black/55 text-foreground hover:border-muted/60 hover:bg-black/75",
        className,
      )}
    >
      <Heart
        className={cn("size-4", active && "fill-brand")}
        aria-hidden
      />
      {showLabel ? (active ? "Tersimpan" : "Favorit") : null}
    </button>
  );
}
