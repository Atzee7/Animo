"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { FeaturedItem } from "@/lib/featured";
import { HeroSection } from "./hero-section";

const AUTOPLAY_MS = 4000;
const DRAG_THRESHOLD_RATIO = 0.2;
const CLICK_SUPPRESS_PX = 8;
const FLICK_VELOCITY = 0.35; // px per ms
const AXIS_LOCK_PX = 6;
const EDGE_RESISTANCE = 0.35;

interface HeroCarouselProps {
  items: FeaturedItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const detachDragRef = useRef<(() => void) | null>(null);
  const suppressClickRef = useRef(false);

  const count = items.length;
  const current = items[index];
  const paused = hovered || focused || isDragging || pageHidden || reducedMotion;

  const goPrev = useCallback(() => {
    setIndex((currentIndex) =>
      currentIndex === 0 ? count - 1 : currentIndex - 1,
    );
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((currentIndex) =>
      currentIndex === count - 1 ? 0 : currentIndex + 1,
    );
  }, [count]);

  // Autoplay. Restarting on index/pause gives manual navigation a fresh
  // window instead of counting down from a stale position.
  useEffect(() => {
    if (count <= 1 || paused) return;

    const timer = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [count, index, paused]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageHidden(document.hidden);

    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => () => detachDragRef.current?.(), []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (count <= 1) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    detachDragRef.current?.();
    suppressClickRef.current = false;

    const viewport = event.currentTarget;
    const { pointerId } = event;
    const startX = event.clientX;
    const startY = event.clientY;
    const startIndex = index;
    const startTime = performance.now();

    let axis: "x" | "y" | null = null;
    let lastX = startX;
    let lastTime = startTime;
    let velocity = 0;
    let moved = false;

    setIsDragging(true);

    const detach = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      window.removeEventListener("blur", onWindowBlur);
      detachDragRef.current = null;
    };

    // Losing window focus (e.g. pointer released over browser chrome) should
    // not leave the track stuck mid-drag.
    const onWindowBlur = () => {
      detach();
      setIsDragging(false);
      setDragOffset(0);
    };

    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (axis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      // Vertical gesture: step aside so the page keeps scrolling normally.
      if (axis === "y") {
        detach();
        setIsDragging(false);
        setDragOffset(0);
        return;
      }

      const now = performance.now();
      const elapsed = now - lastTime;
      if (elapsed > 0) velocity = (moveEvent.clientX - lastX) / elapsed;
      lastX = moveEvent.clientX;
      lastTime = now;
      moved = true;

      if (Math.abs(dx) > CLICK_SUPPRESS_PX) suppressClickRef.current = true;

      const atStart = startIndex === 0;
      const atEnd = startIndex === count - 1;
      const rubberBand = (atStart && dx > 0) || (atEnd && dx < 0);

      setDragOffset(rubberBand ? dx * EDGE_RESISTANCE : dx);
    };

    const onEnd = (endEvent: PointerEvent) => {
      if (endEvent.pointerId !== pointerId) return;

      detach();
      setIsDragging(false);
      setDragOffset(0);

      if (endEvent.type === "pointercancel") return;
      if (axis !== "x" || !moved) return;

      const width = viewport.clientWidth || 1;
      const threshold = width * DRAG_THRESHOLD_RATIO;
      const dragged = endEvent.clientX - startX;

      // Ignore stale momentum if the finger rested before lifting.
      if (performance.now() - lastTime > 120) velocity = 0;

      // Dragging past either end rubber-bands instead of wrapping, so the
      // track never reveals empty space. Dots/arrows still wrap around.
      const wantsNext =
        startIndex < count - 1 &&
        dragged < 0 &&
        (dragged <= -threshold || velocity <= -FLICK_VELOCITY);
      const wantsPrev =
        startIndex > 0 &&
        dragged > 0 &&
        (dragged >= threshold || velocity >= FLICK_VELOCITY);

      if (wantsNext) goNext();
      else if (wantsPrev) goPrev();
    };

    detachDragRef.current = detach;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    window.addEventListener("blur", onWindowBlur);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;

    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Anime unggulan"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
      className="relative outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
    >
      <h1 className="sr-only">
        {current.anime.title} — anime unggulan hari ini
      </h1>

      <div
        className={cn(
          "touch-pan-y overflow-hidden",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        aria-live={paused ? "polite" : "off"}
      >
        <div
          className="flex"
          style={{
            transform: `translate3d(calc(${-index * 100}% + ${dragOffset}px), 0, 0)`,
            transition:
              isDragging || reducedMotion
                ? "none"
                : "transform 480ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {items.map((item, itemIndex) => {
            const isActive = itemIndex === index;

            return (
              <div
                key={item.anime.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${itemIndex + 1} dari ${count}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className="w-full shrink-0"
              >
                <HeroSection
                  anime={item.anime}
                  episode={item.episode}
                  badges={item.badges}
                  isFirst={itemIndex === 0}
                  imagePosition={item.imagePosition}
                />
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div className="absolute bottom-11 right-12 hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Anime sebelumnya"
            className="flex size-10 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:bg-surface-raised"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Anime berikutnya"
            className="flex size-10 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:bg-surface-raised"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </section>
  );
}
