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
    title: "Tentang",
    links: [
      { href: "/", label: "Tentang ANIMO" },
      { href: "https://anilist.co", label: "Sumber Data" },
      { href: "/", label: "Kontak" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page grid gap-10 py-8 md:grid-cols-[2.1fr_0.8fr_0.8fr_1.1fr_1fr] md:gap-8">
        <div>
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
          <div key={column.title} className="hidden md:block">
            <h3 className="text-xs font-semibold text-foreground">
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

        <div className="hidden md:block">
          <h3 className="text-xs font-semibold text-foreground">
            Data oleh AniList
          </h3>
          <p className="mt-3.5 max-w-[232px] text-[11px] leading-relaxed text-muted">
            ANIMO tidak meng-host video. Semua stream dialirkan dari sumber
            pihak ketiga.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-4 pb-24 text-[11px] text-subtle sm:flex-row sm:items-center sm:justify-between md:pb-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <p>Dibuat untuk penggunaan pribadi.</p>
        </div>
      </div>
    </footer>
  );
}
