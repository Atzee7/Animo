"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, History as HistoryIcon, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Compass },
  { href: "/history", label: "Riwayat", icon: HistoryIcon },
  { href: "/favorites", label: "Favorit", icon: Heart },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi seluler"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                active ? "text-brand" : "text-muted",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
