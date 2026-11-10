"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Level } from "hls.js";
import { Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface QualityMenuProps {
  levels: Level[];
  currentLevel: number;
  autoLevel: boolean;
  onSelect: (level: number) => void;
}

interface QualityOption {
  level: number;
  label: string;
  bitrate: number;
}

function formatLevel(level: Level): string {
  if (level.height) return `${level.height}p`;
  if (level.bitrate) return `${Math.round(level.bitrate / 1000)} kbps`;
  return "Sumber";
}

/**
 * Collapse renditions with the same height, keeping the highest bitrate, so the
 * menu shows one entry per resolution.
 */
function buildOptions(levels: Level[]): QualityOption[] {
  const byHeight = new Map<number, QualityOption>();

  levels.forEach((level, index) => {
    const key = level.height || index;
    const bitrate = level.bitrate ?? 0;
    const existing = byHeight.get(key);

    if (!existing || bitrate > existing.bitrate) {
      byHeight.set(key, {
        level: index,
        label: formatLevel(level),
        bitrate,
      });
    }
  });

  return Array.from(byHeight.values()).sort((a, b) => b.bitrate - a.bitrate);
}

export function QualityMenu({
  levels,
  currentLevel,
  autoLevel,
  onSelect,
}: QualityMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const options = useMemo(() => buildOptions(levels), [levels]);

  const activeLabel = autoLevel
    ? "Auto"
    : options.find((option) => option.level === currentLevel)?.label ?? "Auto";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (level: number) => {
    onSelect(level);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Kualitas video: ${activeLabel}`}
        className="inline-flex items-center gap-1.5 rounded-pill border border-white/15 bg-black/55 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition-colors hover:bg-black/75"
      >
        <SlidersHorizontal className="size-3.5" aria-hidden />
        {activeLabel}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Kualitas video"
          className="absolute right-0 top-full z-20 mt-1.5 w-40 overflow-hidden rounded-card border border-border bg-surface/95 p-1 shadow-xl backdrop-blur"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
            Kualitas
          </p>

          <button
            type="button"
            role="menuitemradio"
            aria-checked={autoLevel}
            onClick={() => handleSelect(-1)}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-xs font-medium transition-colors",
              autoLevel
                ? "bg-brand/15 text-brand"
                : "text-soft hover:bg-surface-raised hover:text-foreground",
            )}
          >
            Auto
            {autoLevel ? <Check className="size-3.5" aria-hidden /> : null}
          </button>

          {options.map((option) => {
            const active = !autoLevel && option.level === currentLevel;

            return (
              <button
                key={`${option.level}-${option.label}`}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => handleSelect(option.level)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-xs font-medium transition-colors",
                  active
                    ? "bg-brand/15 text-brand"
                    : "text-soft hover:bg-surface-raised hover:text-foreground",
                )}
              >
                {option.label}
                {active ? <Check className="size-3.5" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
