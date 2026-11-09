import type { EpisodeStream } from "@/types/watch";
import { mapAnimeParadiseStream } from "./mapper";
import type { AnimeParadiseStreamResponse } from "./types";

const AP_API = "https://api.animeparadise.moe";

/**
 * Episode tokens from AnimeParadise are bound to the caller's IP, so stream
 * resolution must happen in the browser, not on the server.
 */
export async function resolveEpisodeStream(
  uid: string,
  origin: string,
): Promise<EpisodeStream> {
  const url = new URL(`/ep/${uid}`, AP_API);
  url.searchParams.set("origin", origin);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil stream (HTTP ${response.status}).`);
  }

  const payload = (await response.json()) as AnimeParadiseStreamResponse;

  if (!payload.success || !payload.data?.episode) {
    throw new Error(payload.error || "Stream episode tidak tersedia.");
  }

  return mapAnimeParadiseStream(payload.data);
}
