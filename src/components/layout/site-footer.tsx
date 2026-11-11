import Link from "next/link";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Jelajahi",
    links: [
      { href: "/", label: "Home" },
      { href: "/browse", label: "Browse" },
      { href: "/browse?sort=START_DATE_DESC", label: "Episode Terbaru" },
      {
        href: "/browse?status=RELEASING&sort=POPULARITY_DESC",
        label: "Top Airing",
      },
    ],
  },
  {
    title: "Koleksi",
    links: [
      { href: "/favorites", label: "Favorit" },
      { href: "/history", label: "Riwayat" },
      { href: "/history", label: "Lanjutkan Menonton" },
    ],
  },
  {
    title: "Katalog",
    links: [
      { href: "/browse?sort=SCORE_DESC", label: "Skor Tertinggi" },
      { href: "/browse?status=RELEASING", label: "Sedang Tayang" },
      { href: "/browse?genre=Romance", label: "Romance" },
      { href: "/browse?genre=Action", label: "Action" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-[0.04em] text-brand"
          >
            ANIMO
          </Link>
          <p className="mt-3 max-w-[340px] text-xs leading-relaxed text-muted">
            Streaming anime tanpa akun. Riwayat dan favorit tersimpan di
            perangkatmu.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {column.title}
            </h3>
            <ul className="mt-3.5 space-y-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page py-4 pb-32 text-[11px] text-subtle md:pb-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
