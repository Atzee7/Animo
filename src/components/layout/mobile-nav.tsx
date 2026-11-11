"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Heart,
  History as HistoryIcon,
  Home,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const leftItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Compass },
];

const rightItems: NavItem[] = [
  { href: "/history", label: "Riwayat", icon: HistoryIcon },
  { href: "/favorites", label: "Favorit", icon: Heart },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function DockItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="group relative flex flex-col items-center justify-center gap-1 py-2"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0.5 inset-y-1.5 rounded-pill border transition-colors duration-300 motion-reduce:transition-none",
          active
            ? "border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "border-transparent group-hover:border-white/10 group-hover:bg-white/[0.05]",
        )}
      />
      <Icon
        aria-hidden
        strokeWidth={active ? 2.2 : 1.9}
        className={cn(
          "relative size-5 transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none",
          active ? "-translate-y-px text-foreground" : "text-muted",
        )}
      />
      <span
        className={cn(
          "relative whitespace-nowrap text-[10px] font-semibold tracking-wide transition-colors duration-300 motion-reduce:transition-none",
          active ? "text-foreground" : "text-muted",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

function SearchButton({ active }: { active: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-end pb-2">
      <Link
        href="/search"
        aria-label="Cari anime"
        aria-current={active ? "page" : undefined}
        className={cn(
          "absolute left-1/2 top-0 flex size-14 -translate-x-1/2 -translate-y-[35%] items-center justify-center rounded-full shadow-[0_14px_30px_-10px_rgba(0,0,0,0.9)] ring-4 ring-background/45 transition-[background-color,color,transform,box-shadow] duration-300 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none",
          active
            ? "bg-brand text-brand-ink"
            : "bg-gradient-to-b from-white to-[#dfe5e8] text-background",
        )}
      >
        <Search className="size-6" strokeWidth={2.2} aria-hidden />
      </Link>
      <span
        className={cn(
          "relative text-[10px] font-semibold tracking-wide transition-colors duration-300 motion-reduce:transition-none",
          active ? "text-foreground" : "text-muted",
        )}
      >
        Cari
      </span>
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi seluler"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)_+_0.75rem)] md:hidden"
    >
      <div className="relative mx-auto grid h-[68px] max-w-md grid-cols-5 items-stretch rounded-pill border border-white/10 bg-surface/55 px-2 shadow-[0_20px_45px_-18px_rgba(0,0,0,0.85)] backdrop-blur-2xl backdrop-saturate-150">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-b from-white/[0.07] via-transparent to-white/[0.02]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        {leftItems.map((item) => (
          <DockItem
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
          />
        ))}

        <SearchButton active={isActive(pathname, "/search")} />

        {rightItems.map((item) => (
          <DockItem
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
          />
        ))}
      </div>
    </nav>
  );
}
