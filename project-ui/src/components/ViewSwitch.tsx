import { LayoutGrid, Rows3 } from "lucide-react";
import type { ViewMode } from "../model";

export function ViewSwitch({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex h-12 shrink-0 items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1" role="group" aria-label="Project view">
      <button
        type="button"
        aria-label="Cards view"
        aria-pressed={value === "cards"}
        onClick={() => onChange("cards")}
        className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition ${value === "cards" ? "bg-orange-500 text-zinc-950" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"}`}
      >
        <LayoutGrid className="size-3.5" />
        <span>Cards</span>
      </button>
      <button
        type="button"
        aria-label="Compact view"
        aria-pressed={value === "compact"}
        onClick={() => onChange("compact")}
        className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition ${value === "compact" ? "bg-orange-500 text-zinc-950" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"}`}
      >
        <Rows3 className="size-3.5" />
        <span>Compact</span>
      </button>
    </div>
  );
}
