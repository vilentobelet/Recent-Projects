import { Globe2 } from "lucide-react";

export function BoardHeader({
  productCount,
  loading,
}: {
  productCount: number;
  loading?: boolean;
}) {
  return (
    <header className="mb-6 sm:mb-7">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
        <span className="h-px w-7 bg-orange-500" />
        Product access board
      </div>
      <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-zinc-50 sm:text-4xl">Recent Projects.</h1>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Globe2 className="size-4" />
        {loading ? "Loading products…" : `${productCount} ${productCount === 1 ? "product" : "products"}`}
      </p>
    </header>
  );
}
