import { SiteHeader } from "@/components/layout/site-header";

export default function WatchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader showMobileSearch />
      <main className="flex-1">{children}</main>
    </div>
  );
}
