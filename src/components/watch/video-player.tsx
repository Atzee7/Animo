"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, SkipForward, TriangleAlert } from "lucide-react";
import { useHlsPlayer } from "@/hooks/use-hls-player";
import { buttonVariants } from "@/components/ui/button";
import type { SubtitleTrack } from "@/types/watch";
import { QualityMenu } from "./quality-menu";

interface SkipRange {
  start: number;
  end: number;
}

interface VideoPlayerProps {
  src: string | null;
  poster?: string | null;
  startTime?: number;
  autoPlay?: boolean;
  subtitles?: SubtitleTrack[];
  intro?: SkipRange | null;
  outro?: SkipRange | null;
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
  intro,
  outro,
  errorMessage,
  onEnded,
  onProgress,
}: VideoPlayerProps) {
  const {
    videoRef,
    levels,
    currentLevel,
    autoLevel,
    setLevel,
    error,
    isReady,
  } = useHlsPlayer({
    src,
    autoPlay,
    startTime,
    onEnded,
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [outroDismissed, setOutroDismissed] = useState(false);

  useEffect(() => {
    setCurrentTime(0);
    setIntroDismissed(false);
    setOutroDismissed(false);
  }, [src]);

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

  const seekTo = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = time;
    },
    [videoRef],
  );

  const reportProgress = useCallback(
    (video: HTMLVideoElement) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      onProgress?.(video.currentTime, video.duration);
    },
    [onProgress],
  );

  const displayError = errorMessage ?? error;

  const showSkipIntro =
    Boolean(intro) &&
    !introDismissed &&
    !displayError &&
    currentTime >= (intro?.start ?? 0) &&
    currentTime < (intro?.end ?? 0);

  const showSkipOutro =
    Boolean(outro) &&
    !outroDismissed &&
    !displayError &&
    currentTime >= (outro?.start ?? 0) &&
    currentTime < (outro?.end ?? 0);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card border border-border bg-black">
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full"
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (!Number.isFinite(video.duration) || video.duration <= 0) return;

          setCurrentTime(video.currentTime);
          onProgress?.(video.currentTime, video.duration);
        }}
        onPause={(event) => reportProgress(event.currentTarget)}
        onSeeked={(event) => reportProgress(event.currentTarget)}
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

      {levels.length > 1 && !displayError ? (
        <div className="absolute right-3 top-3 z-10">
          <QualityMenu
            levels={levels}
            currentLevel={currentLevel}
            autoLevel={autoLevel}
            onSelect={setLevel}
          />
        </div>
      ) : null}

      {showSkipIntro && intro ? (
        <div className="absolute bottom-16 left-3 z-10">
          <button
            type="button"
            onClick={() => {
              seekTo(intro.end);
              setIntroDismissed(true);
            }}
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className:
                "border-white/20 bg-black/65 text-white backdrop-blur hover:border-white/40 hover:bg-black/85",
            })}
          >
            <SkipForward className="size-3.5" aria-hidden />
            Lewati intro
          </button>
        </div>
      ) : null}

      {showSkipOutro && outro ? (
        <div className="absolute bottom-16 right-3 z-10">
          <button
            type="button"
            onClick={() => {
              seekTo(outro.end);
              setOutroDismissed(true);
            }}
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className:
                "border-white/20 bg-black/65 text-white backdrop-blur hover:border-white/40 hover:bg-black/85",
            })}
          >
            <SkipForward className="size-3.5" aria-hidden />
            Lewati outro
          </button>
        </div>
      ) : null}

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
