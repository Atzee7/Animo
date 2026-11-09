"use client";

import { useEffect } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useHlsPlayer } from "@/hooks/use-hls-player";
import type { SubtitleTrack } from "@/types/watch";

interface VideoPlayerProps {
  src: string | null;
  poster?: string | null;
  startTime?: number;
  autoPlay?: boolean;
  subtitles?: SubtitleTrack[];
  errorMessage?: string | null;
  onEnded?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
}

export function VideoPlayer({
  src,
  poster,
  startTime = 0,
  autoPlay = false,
  subtitles = [],
  errorMessage,
  onEnded,
  onProgress,
}: VideoPlayerProps) {
  const { videoRef, error, isReady } = useHlsPlayer({
    src,
    autoPlay,
    startTime,
    onEnded,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applySubtitleMode = () => {
      const preferred =
        subtitles.find((subtitle) => subtitle.default) ?? subtitles[0];
      const preferredKey = preferred
        ? `${preferred.lang}|${preferred.label}`
        : null;

      for (let index = 0; index < video.textTracks.length; index += 1) {
        const track = video.textTracks[index];
        const key = `${track.language}|${track.label}`;
        track.mode =
          preferredKey && key === preferredKey ? "showing" : "disabled";
      }
    };

    applySubtitleMode();
    video.textTracks.addEventListener("addtrack", applySubtitleMode);

    return () => {
      video.textTracks.removeEventListener("addtrack", applySubtitleMode);
    };
  }, [subtitles, videoRef]);

  const displayError = errorMessage ?? error;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-border bg-black">
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        controls
        playsInline
        className="h-full w-full"
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (video.duration && !Number.isNaN(video.duration)) {
            onProgress?.(video.currentTime, video.duration);
          }
        }}
      >
        {subtitles.map((subtitle) => (
          <track
            key={`${subtitle.lang}-${subtitle.label}`}
            kind="subtitles"
            src={subtitle.src}
            srcLang={subtitle.lang}
            label={subtitle.label}
            default={subtitle.default}
          />
        ))}
      </video>

      {!src && !displayError ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-center">
          <Loader2 className="size-6 animate-spin text-brand" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            Menyiapkan stream episode…
          </p>
          <p className="max-w-xs text-xs text-muted">
            Video akan diputar langsung di perangkatmu.
          </p>
        </div>
      ) : null}

      {src && !isReady && !displayError ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="size-6 animate-spin text-brand" aria-hidden />
        </div>
      ) : null}

      {displayError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 px-6 text-center">
          <TriangleAlert className="size-6 text-coral" aria-hidden />
          <p className="text-sm font-medium text-foreground">{displayError}</p>
        </div>
      ) : null}
    </div>
  );
}
