"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, History as HistoryIcon, Search } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils/cn";
import { SearchBox } from "./search-box";

export function SiteHeader({
  showMobileSearch = false,
}: {
  showMobileSearch?: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container-page flex h-[72px] items-center gap-6">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-[0.04em] text-brand"
        >
          ANIMO
        </Link>

        <nav
          className="ml-16 hidden items-center gap-7 md:flex"
          aria-label="Navigasi utama"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-[72px] items-center text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
              {isActive(item.href) ? (
                <span className="absolute inset-x-0 bottom-[19px] h-0.5 rounded-full bg-brand" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="ml-8 hidden min-w-0 flex-1 lg:block">
          <div className="w-full max-w-[480px]">
            <SearchBox />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Cari anime"
            className={cn(
              "size-10 items-center justify-center text-muted transition-colors hover:text-foreground lg:hidden",
              showMobileSearch ? "flex" : "hidden md:flex",
            )}
          >
            <Search className="size-5" aria-hidden />
          </Link>

          <Link
            href="/history"
            className={cn(
              "hidden w-16 flex-col items-center gap-1 text-[10px] transition-colors md:flex",
              isActive("/history")
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            <HistoryIcon className="size-5" aria-hidden />
            Riwayat
          </Link>
          <Link
            href="/favorites"
            className={cn(
              "hidden w-16 flex-col items-center gap-1 text-[10px] transition-colors md:flex",
              isActive("/favorites")
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            <Heart className="size-5" aria-hidden />
            Favorit
          </Link>
        </div>
      </div>
    </header>
  );
}
