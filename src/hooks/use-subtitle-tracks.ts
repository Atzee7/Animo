"use client";

import { useEffect, useState } from "react";
import type { SubtitleTrack } from "@/types/watch";

/**
 * AnimeParadise serves valid WebVTT files as application/octet-stream, which
 * browsers reject for <track>. Fetch the text in the browser (same IP/session)
 * and expose a Blob URL with the correct text/vtt MIME type.
 */
export function useSubtitleTracks(source: SubtitleTrack[] | undefined) {
  const [tracks, setTracks] = useState<SubtitleTrack[]>([]);

  useEffect(() => {
    if (!source || source.length === 0) {
      setTracks([]);
      return;
    }

    let cancelled = false;
    const objectUrls: string[] = [];

    Promise.all(
      source.map(async (subtitle) => {
        try {
          const response = await fetch(subtitle.src);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const text = await response.text();
          const url = URL.createObjectURL(
            new Blob([text], { type: "text/vtt" }),
          );

          objectUrls.push(url);
          return { ...subtitle, src: url };
        } catch (error) {
          console.warn(
            `[subtitles] Gagal memuat subtitle ${subtitle.label}`,
            error,
          );
          return null;
        }
      }),
    ).then((results) => {
      if (cancelled) {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      setTracks(
        results.filter((track): track is SubtitleTrack => track !== null),
      );
    });

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [source]);

  return tracks;
}
