import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = {
  title: "Favorit",
};

export default function FavoritesPage() {
  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Koleksi"
        title="Favorit saya"
        description="Anime yang kamu simpan tersimpan di localStorage perangkat ini. Tidak ada akun, tidak ada database."
      />
      <EmptyState
        icon={<Heart className="size-8" aria-hidden />}
        title="Belum ada favorit"
        description="Tekan ikon hati pada kartu anime untuk menyimpannya. Halaman ini akan otomatis menampilkan daftar favoritmu."
      />
    </div>
  );
}
