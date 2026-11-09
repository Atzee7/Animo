"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchResponse } from "@/types/api";
import type { AnimeSummary } from "@/types/anime";

export function SearchBox() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const term = debouncedQuery.trim();

    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(term)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Search request failed");
        return (await response.json()) as SearchResponse;
      })
      .then((data) => {
        setResults(data.results);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setResults([]);
        setError("Pencarian gagal. Coba lagi.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToResults = () => {
    const term = query.trim();
    if (term.length < 2) return;

    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const showDropdown =
    open && (loading || results.length > 0 || Boolean(error));

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex h-10 items-center gap-2 rounded-pill border border-border bg-surface px-4 focus-within:border-brand/60">
        <Search className="size-4 shrink-0 text-subtle" aria-hidden />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key === "Enter") {
              event.preventDefault();
              goToResults();
            }
          }}
          placeholder="Cari anime, judul, atau genre…"
          aria-label="Cari anime"
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-subtle"
        />
        {loading ? (
          <Loader2 className="size-4 animate-spin text-muted" aria-hidden />
        ) : null}
        {query && !loading ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            aria-label="Hapus pencarian"
            className="text-subtle transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-card border border-border bg-surface shadow-2xl shadow-black/40">
          {error ? (
            <p className="px-4 py-5 text-sm text-coral">{error}</p>
          ) : null}

          {!error && !loading && results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted">
              Tidak ada hasil untuk “{debouncedQuery}”.
            </p>
          ) : null}

          {results.length > 0 ? (
            <>
              <ul className="max-h-[420px] overflow-y-auto py-1">
                {results.map((anime) => (
                  <li key={anime.id}>
                    <Link
                      href={`/anime/${anime.id}`}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-surface-raised"
                    >
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-surface-raised">
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
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {anime.title}
                        </p>
                        <p className="mt-0.5 text-xs text-subtle">
                          {anime.format ?? "Anime"}
                          {anime.seasonYear ? ` · ${anime.seasonYear}` : ""}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/70 p-1.5">
                <Link
                  href={`/search?q=${encodeURIComponent(debouncedQuery.trim())}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-2 rounded px-2.5 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-brand"
                >
                  <span className="truncate">
                    Lihat semua hasil untuk “{debouncedQuery.trim()}”
                  </span>
                  <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                </Link>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
