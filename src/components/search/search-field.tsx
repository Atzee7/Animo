"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowRight, Loader2, Search, Star, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils/cn";
import { formatFormat, formatScore } from "@/lib/utils/format";
import type { AnimeSummary } from "@/types/anime";
import type { SearchResponse } from "@/types/api";

const MAX_SUGGESTIONS = 5;
const HEADER_OFFSET = 84;

function suggestionMeta(anime: AnimeSummary) {
  return [
    anime.seasonYear ? String(anime.seasonYear) : null,
    anime.format ? formatFormat(anime.format) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

interface SearchFieldProps {
  defaultValue?: string;
  centered?: boolean;
}

export function SearchField({
  defaultValue = "",
  centered = false,
}: SearchFieldProps) {
  const router = useRouter();
  const listboxId = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const cacheRef = useRef(new Map<string, AnimeSummary[]>());

  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resolvedTerm, setResolvedTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const [listMaxHeight, setListMaxHeight] = useState(372);

  const term = query.trim();
  const debouncedTerm = useDebounce(term, 300);
  const canSuggest = term.length >= 2;

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (debouncedTerm.length < 2) {
      setResults([]);
      setLoading(false);
      setError(false);
      setResolvedTerm("");
      setActiveIndex(-1);
      return;
    }

    const cached = cacheRef.current.get(debouncedTerm);
    if (cached) {
      setResults(cached);
      setLoading(false);
      setError(false);
      setResolvedTerm(debouncedTerm);
      setActiveIndex(-1);
      return;
    }

    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch(`/api/search?q=${encodeURIComponent(debouncedTerm)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Search request failed");
        return (await response.json()) as SearchResponse;
      })
      .then((data) => {
        if (!active) return;
        const items = data.results.slice(0, MAX_SUGGESTIONS);
        cacheRef.current.set(debouncedTerm, items);
        setResults(items);
        setResolvedTerm(debouncedTerm);
        setError(false);
        setActiveIndex(-1);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setResults([]);
        setResolvedTerm(debouncedTerm);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedTerm]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const noResults =
    !loading &&
    !error &&
    results.length === 0 &&
    resolvedTerm === debouncedTerm &&
    debouncedTerm.length >= 2;

  const showDropdown =
    open &&
    canSuggest &&
    (loading || error || results.length > 0 || noResults);

  useEffect(() => {
    if (!showDropdown) return;

    const update = () => {
      const rect = inputRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const below = viewportHeight - rect.bottom - 20;
      const above = rect.top - HEADER_OFFSET;
      const next: "top" | "bottom" =
        below < 340 && above > below ? "top" : "bottom";
      const available = (next === "top" ? above : below) - 52;

      setPlacement(next);
      setListMaxHeight(Math.max(160, Math.min(available, 380)));
    };

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [showDropdown]);

  const closeDropdown = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selected = activeIndex >= 0 ? results[activeIndex] : undefined;
    closeDropdown();

    if (selected) {
      router.push(`/anime/${selected.id}`);
      return;
    }

    if (term.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        results.length === 0 ? -1 : (index + 1) % results.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        results.length === 0
          ? -1
          : index <= 0
            ? results.length - 1
            : index - 1,
      );
      return;
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setResolvedTerm("");
    setError(false);
    closeDropdown();
    inputRef.current?.focus();
  };

  return (
    <form
      ref={formRef}
      method="get"
      action="/search"
      onSubmit={handleSubmit}
      className={
        centered ? "relative mx-auto mt-8 w-full" : "relative mt-5"
      }
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle"
          aria-hidden
        />

        <input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          required
          minLength={2}
          placeholder="Cari judul anime…"
          aria-label="Cari anime"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          className="h-12 w-full rounded-pill border border-border bg-surface pl-11 pr-28 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-brand/60 sm:pr-40"
        />

        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading ? (
            <Loader2
              className="size-4 shrink-0 animate-spin text-muted"
              aria-hidden
            />
          ) : null}

          {query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Hapus pencarian"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}

          <button
            type="submit"
            aria-label="Cari"
            className={buttonVariants({
              className: "h-9 px-3 sm:px-4",
            })}
          >
            <Search className="size-4 sm:hidden" aria-hidden />
            <span className="hidden sm:inline">Cari</span>
          </button>
        </div>
      </div>

      {showDropdown ? (
        <div
          className={cn(
            "absolute inset-x-0 z-50 overflow-hidden rounded-2xl border border-border bg-surface/95 text-left shadow-2xl shadow-black/40 backdrop-blur-xl",
            placement === "top"
              ? "bottom-[calc(100%+8px)]"
              : "top-[calc(100%+8px)]",
          )}
        >
          {error ? (
            <p className="px-4 py-4 text-sm text-coral">
              Pencarian sedang tidak tersedia. Coba lagi.
            </p>
          ) : null}

          {!error && loading && results.length === 0 ? (
            <div className="space-y-1 p-1.5" aria-hidden>
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3 px-2.5 py-2">
                  <div className="h-14 w-10 shrink-0 animate-pulse rounded-md bg-surface-raised" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 animate-pulse rounded-full bg-surface-raised" />
                    <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-surface-raised" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!error && !loading && noResults ? (
            <p className="px-4 py-4 text-sm text-muted">
              Tidak ada hasil untuk “{debouncedTerm}”.
            </p>
          ) : null}

          {!error && results.length > 0 ? (
            <>
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Saran anime"
                style={{ maxHeight: listMaxHeight }}
                className="overflow-y-auto p-1.5"
              >
                {results.map((anime, index) => (
                  <li
                    key={anime.id}
                    id={`${listboxId}-option-${index}`}
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <Link
                      href={`/anime/${anime.id}`}
                      onClick={closeDropdown}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
                        index === activeIndex
                          ? "bg-surface-raised"
                          : "hover:bg-surface-raised/70",
                      )}
                    >
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-surface-raised">
                        {anime.coverImage ? (
                          <Image
                            src={anime.coverImage}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {anime.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-subtle">
                          {suggestionMeta(anime) || "Anime"}
                        </p>
                      </div>

                      {anime.averageScore != null ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand">
                          <Star
                            className="size-3 fill-current"
                            aria-hidden
                          />
                          {formatScore(anime.averageScore)}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border/70 p-1.5">
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  onClick={closeDropdown}
                  className="flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-brand"
                >
                  <span className="truncate">
                    Lihat semua hasil untuk “{term}”
                  </span>
                  <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                </Link>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
