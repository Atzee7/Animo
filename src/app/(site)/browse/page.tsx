import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = {
  title: "Jelajahi",
};

export default function BrowsePage() {
  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Katalog"
        title="Jelajahi anime"
        description="Halaman ini akan menampilkan katalog dari AniList dengan filter genre, musim, tahun, format, dan status. Grid dan pagination sudah disiapkan di data layer."
      />
      <EmptyState
        icon={<Compass className="size-8" aria-hidden />}
        title="Katalog segera hadir"
        description="Komponen grid, kartu anime, dan filter sudah tersedia. Tinggal menghubungkan halaman ini ke getBrowseAnime()."
      />
    </div>
  );
}
