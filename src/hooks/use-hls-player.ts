"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls, { type Level } from "hls.js";

interface UseHlsPlayerOptions {
  src: string | null;
  autoPlay?: boolean;
  startTime?: number;
  onEnded?: () => void;
}

export function useHlsPlayer({
  src,
  autoPlay = false,
  startTime = 0,
  onEnded,
}: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const onEndedRef = useRef(onEnded);

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setError(null);
    setIsReady(false);
    setLevels([]);
    setCurrentLevel(-1);

    const handleEnded = () => onEndedRef.current?.();

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (startTime > 0) video.currentTime = startTime;
      if (autoPlay) void video.play().catch(() => {});
      setIsReady(true);
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
        setIsReady(true);
        if (startTime > 0) video.currentTime = startTime;
        if (autoPlay) void video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError("Stream gagal dimuat. Coba episode lain.");
      });
    } else {
      setError("Browser ini tidak mendukung pemutaran HLS.");
    }

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoPlay, startTime]);

  const setLevel = useCallback((level: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = level;
    setCurrentLevel(level);
  }, []);

  return {
    videoRef,
    levels,
    currentLevel,
    setLevel,
    error,
    isReady,
  };
}
