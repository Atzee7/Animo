"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls, { type Level } from "hls.js";

interface UseHlsPlayerOptions {
  src: string | null;
  autoPlay?: boolean;
  startTime?: number;
  onEnded?: () => void;
}

const MAX_RECOVERY_ATTEMPTS = 2;
const STREAM_ERROR_MESSAGE = "Stream gagal dimuat. Coba episode lain.";

export function useHlsPlayer({
  src,
  autoPlay = false,
  startTime = 0,
  onEnded,
}: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const onEndedRef = useRef(onEnded);
  // Resume point is updated separately from the source effect so progress
  // updates from history don't restart playback.
  const startTimeRef = useRef(startTime);

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [autoLevel, setAutoLevel] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Snapshot once per source; later startTime updates are ignored.
    const resumeAt = startTimeRef.current;

    setError(null);
    setIsReady(false);
    setLevels([]);
    setCurrentLevel(-1);
    setAutoLevel(true);

    const handleEnded = () => onEndedRef.current?.();
    const handleLoadedMetadata = () => {
      if (resumeAt > 0) {
        video.currentTime = resumeAt;
      }
      setIsReady(true);
      if (autoPlay) void video.play().catch(() => {});
    };

    const handleNativeError = () => setError(STREAM_ERROR_MESSAGE);

    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      let networkAttempts = 0;
      let mediaAttempts = 0;

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
        setIsReady(true);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentLevel(data.level);
        setAutoLevel(hls.autoLevelEnabled);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;

        if (
          data.type === Hls.ErrorTypes.NETWORK_ERROR &&
          networkAttempts < MAX_RECOVERY_ATTEMPTS
        ) {
          networkAttempts += 1;
          setIsReady(false);
          hls.startLoad();
          return;
        }

        if (
          data.type === Hls.ErrorTypes.MEDIA_ERROR &&
          mediaAttempts < MAX_RECOVERY_ATTEMPTS
        ) {
          mediaAttempts += 1;
          setIsReady(false);
          hls.recoverMediaError();
          return;
        }

        setError(STREAM_ERROR_MESSAGE);
        hls.destroy();
        hlsRef.current = null;
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari/iOS can play HLS natively but has no MSE support.
      video.addEventListener("error", handleNativeError);
      video.src = src;
      // Some browsers already have metadata from the previous source.
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        handleLoadedMetadata();
      }
    } else {
      setError("Browser ini tidak mendukung pemutaran HLS.");
    }

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleNativeError);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoPlay]);

  const setLevel = useCallback((level: number) => {
    const hls = hlsRef.current;
    if (!hls) return;

    hls.currentLevel = level;
    setCurrentLevel(level);
    setAutoLevel(level === -1);
  }, []);

  return {
    videoRef,
    levels,
    currentLevel,
    autoLevel,
    setLevel,
    error,
    isReady,
  };
}
