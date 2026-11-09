import type { HistoryEntry } from "@/types/watch";
import { STORAGE_KEYS } from "./keys";
import { readJson, subscribeToStorage, writeJson } from "./storage";

const EMPTY_HISTORY: HistoryEntry[] = [];
let snapshot: HistoryEntry[] | null = null;

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<HistoryEntry>;
  return (
    typeof entry.animeId === "number" &&
    typeof entry.title === "string" &&
    typeof entry.episodeNumber === "number"
  );
}

function readHistory(): HistoryEntry[] {
  const stored = readJson<unknown>(STORAGE_KEYS.history, []);
  if (!Array.isArray(stored)) return EMPTY_HISTORY;

  return stored
    .filter(isHistoryEntry)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getHistory(): HistoryEntry[] {
  if (snapshot === null) snapshot = readHistory();
  return snapshot;
}

export function getHistoryServerSnapshot(): HistoryEntry[] {
  return EMPTY_HISTORY;
}

export function getHistoryForAnime(animeId: number): HistoryEntry | undefined {
  return getHistory().find((entry) => entry.animeId === animeId);
}

/**
 * Continue Watching keeps one entry per anime: the most recent episode wins.
 */
export function upsertHistory(
  entry: Omit<HistoryEntry, "updatedAt"> & { updatedAt?: number },
): void {
  const nextEntry: HistoryEntry = {
    ...entry,
    updatedAt: entry.updatedAt ?? Date.now(),
  };

  const next = [
    nextEntry,
    ...getHistory().filter((item) => item.animeId !== entry.animeId),
  ].sort((a, b) => b.updatedAt - a.updatedAt);

  snapshot = next;
  writeJson(STORAGE_KEYS.history, next);
}

export function removeHistory(animeId: number): void {
  const next = getHistory().filter((item) => item.animeId !== animeId);
  snapshot = next;
  writeJson(STORAGE_KEYS.history, next);
}

export function clearHistory(): void {
  snapshot = EMPTY_HISTORY;
  writeJson(STORAGE_KEYS.history, []);
}

export function subscribeHistory(callback: () => void): () => void {
  return subscribeToStorage(() => {
    snapshot = null;
    callback();
  });
}
