"use client";

import { useSyncExternalStore } from "react";
import {
  clearFavorites,
  getFavorites,
  getFavoritesServerSnapshot,
  isFavorite,
  removeFavorite,
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
    removeFavorite,
    clearFavorites,
  };
}
