import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = {
  title: "Pencarian",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Pencarian"
        title={query ? `Hasil untuk “${query}”` : "Cari anime"}
        description="Gunakan kolom pencarian di header untuk mencari judul. Hasil akan muncul sebagai dropdown instan dengan debounce 400 ms."
      />
      <EmptyState
        icon={<Search className="size-8" aria-hidden />}
        title={query ? "Hasil pencarian belum dihubungkan" : "Mulai dari header"}
        description={
          query
            ? "Endpoint /api/search sudah aktif. Halaman hasil lengkap akan memakai searchAnime() dari AniList."
            : "Ketik minimal dua karakter di kolom pencarian header untuk melihat hasil instan."
        }
      />
    </div>
  );
}
