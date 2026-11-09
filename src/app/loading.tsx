import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container-page space-y-8 py-10">
      <Skeleton className="h-[420px] w-full" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-full" />
        ))}
      </div>
    </main>
  );
}
