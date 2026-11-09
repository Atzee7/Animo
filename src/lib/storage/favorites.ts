import type { FavoriteEntry } from "@/types/watch";
import { STORAGE_KEYS } from "./keys";
import { readJson, subscribeToStorage, writeJson } from "./storage";

const EMPTY_FAVORITES: FavoriteEntry[] = [];
let snapshot: FavoriteEntry[] | null = null;

function isFavoriteEntry(value: unknown): value is FavoriteEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<FavoriteEntry>;
  return typeof entry.animeId === "number" && typeof entry.title === "string";
}

function readFavorites(): FavoriteEntry[] {
  const stored = readJson<unknown>(STORAGE_KEYS.favorites, []);
  if (!Array.isArray(stored)) return EMPTY_FAVORITES;

  return stored
    .filter(isFavoriteEntry)
    .sort((a, b) => b.addedAt - a.addedAt);
}

export function getFavorites(): FavoriteEntry[] {
  if (snapshot === null) snapshot = readFavorites();
  return snapshot;
}

export function getFavoritesServerSnapshot(): FavoriteEntry[] {
  return EMPTY_FAVORITES;
}

export function isFavorite(animeId: number): boolean {
  return getFavorites().some((entry) => entry.animeId === animeId);
}

export function toggleFavorite(
  entry: Omit<FavoriteEntry, "addedAt">,
): boolean {
  const current = getFavorites();
  const exists = current.some((item) => item.animeId === entry.animeId);

  const next = exists
    ? current.filter((item) => item.animeId !== entry.animeId)
    : [{ ...entry, addedAt: Date.now() }, ...current];

  snapshot = next;
  writeJson(STORAGE_KEYS.favorites, next);
  return !exists;
}

export function removeFavorite(animeId: number): void {
  const next = getFavorites().filter((item) => item.animeId !== animeId);
  snapshot = next;
  writeJson(STORAGE_KEYS.favorites, next);
}

export function clearFavorites(): void {
  snapshot = EMPTY_FAVORITES;
  writeJson(STORAGE_KEYS.favorites, []);
}

export function subscribeFavorites(callback: () => void): () => void {
  return subscribeToStorage(() => {
    snapshot = null;
    callback();
  });
}
