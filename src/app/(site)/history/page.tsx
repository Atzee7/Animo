import { History as HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = {
  title: "Riwayat",
};

export default function HistoryPage() {
  return (
    <div className="container-page py-10">
      <PageIntro
        eyebrow="Koleksi"
        title="Riwayat tonton"
        description="Lanjutkan episode terakhir yang kamu tonton. Progres disimpan lokal di browser dan tidak dikirim ke server."
      />
      <EmptyState
        icon={<HistoryIcon className="size-8" aria-hidden />}
        title="Riwayat masih kosong"
        description="Mulai menonton satu episode, lalu kembali ke sini untuk melanjutkan dari detik terakhir."
      />
    </div>
  );
}
