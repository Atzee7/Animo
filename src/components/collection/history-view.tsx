"use client";

import Image from "next/image";
import Link from "next/link";
import { History as HistoryIcon, Play, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";
import { useMounted } from "@/hooks/use-mounted";
import { formatDuration, formatRelativeTime } from "@/lib/utils/format";

export function HistoryView() {
  const { history, count, removeHistory, clearHistory } = useHistory();
  const mounted = useMounted();

  const handleClear = () => {
    if (window.confirm("Hapus seluruh riwayat tontonan?")) {
      clearHistory();
    }
  };

  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Koleksi"
        title="Riwayat tonton"
        description="Lanjutkan episode terakhir yang kamu tonton. Progres disimpan lokal di browser dan tidak dikirim ke server."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">
            {mounted ? count : "—"}
          </span>{" "}
          anime dalam riwayat
        </p>
        {mounted && count > 0 ? (
          <button
            type="button"
            onClick={handleClear}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Hapus semua
          </button>
        ) : null}
      </div>

      {!mounted ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="size-8" aria-hidden />}
          title="Riwayat masih kosong"
          description="Mulai menonton satu episode, lalu kembali ke sini untuk melanjutkan dari episode dan detik terakhir."
          action={
            <Link href="/browse" className={buttonVariants()}>
              Cari anime
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => {
            const percent =
              entry.durationSeconds > 0
                ? Math.min(
                    100,
                    Math.round(
                      (entry.progressSeconds / entry.durationSeconds) * 100,
                    ),
                  )
                : 0;
            const href = `/watch/${entry.animeId}/${entry.episodeNumber}`;

            return (
              <li
                key={entry.animeId}
                className="group flex flex-col gap-3 rounded-card border border-border bg-surface p-3 transition-colors hover:border-border-strong sm:flex-row sm:items-center"
              >
                <Link
                  href={href}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-surface-raised">
                    {entry.coverImage ? (
                      <Image
                        src={entry.coverImage}
                        alt={entry.title}
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                      Episode {entry.episodeNumber}
                    </p>
                    <h2 className="mt-0.5 line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
                      {entry.title}
                    </h2>
                    <p className="mt-1 text-[11px] text-muted">
                      {formatRelativeTime(entry.updatedAt)} ·{" "}
                      {formatDuration(entry.progressSeconds)} /{" "}
                      {formatDuration(entry.durationSeconds)}
                    </p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-2 pl-0 sm:pl-3">
                  <Link
                    href={href}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    <Play className="size-3.5" aria-hidden />
                    Lanjutkan
                  </Link>
                  <Button
                    variant="icon"
                    className="size-9"
                    aria-label={`Hapus riwayat ${entry.title}`}
                    onClick={() => removeHistory(entry.animeId)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
