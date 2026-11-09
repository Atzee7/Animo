"use client";

import { useSyncExternalStore } from "react";
import {
  getFavorites,
  getFavoritesServerSnapshot,
  isFavorite,
  subscribeFavorites,
  toggleFavorite,
} from "@/lib/storage/favorites";

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavorites,
    getFavoritesServerSnapshot,
  );

  return {
    favorites,
    count: favorites.length,
    isFavorite,
    toggleFavorite,
  };
}
