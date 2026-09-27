import { Sparkles } from "lucide-react";

export function FeaturedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border border-orange-500/30 bg-orange-500/15 px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-orange-300 ${compact ? "shrink-0" : ""}`}>
      <Sparkles className="size-2.5" />
      Featured
    </span>
  );
}
