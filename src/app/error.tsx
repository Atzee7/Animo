"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center py-20 text-center">
      <TriangleAlert className="mb-6 size-10 text-coral" aria-hidden />
      <h1 className="font-display text-3xl font-bold text-foreground">
        Ada yang gagal dimuat
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        Koneksi ke sumber data sedang bermasalah. Coba muat ulang halaman ini.
      </p>
      <Button className="mt-8" onClick={reset}>
        <RotateCcw className="size-4" aria-hidden />
        Coba lagi
      </Button>
    </main>
  );
}
