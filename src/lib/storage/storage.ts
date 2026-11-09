import { STORAGE_EVENT } from "./keys";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}

export function removeStoredValue(key: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Ignore storage failures.
  }
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key.startsWith("animo:")) callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}
