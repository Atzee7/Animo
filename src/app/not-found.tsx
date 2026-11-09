import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center py-20 text-center">
      <Compass className="mb-6 size-10 text-muted" aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-foreground">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Anime atau halaman yang kamu cari mungkin sudah dipindahkan. Coba kembali
        ke beranda untuk mulai menjelajah.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Kembali ke beranda
      </Link>
    </main>
  );
}
