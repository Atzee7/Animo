export const siteConfig = {
  name: "ANIMO",
  tagline: "Streaming anime tanpa ribet",
  description:
    "Tonton anime favoritmu dengan pengalaman streaming yang ringan, cepat, dan bebas login. Riwayat dan favorit tersimpan di perangkatmu.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
  ],
} as const;
