import type { LinkKind } from "../model";

const KIND_CLASS: Record<LinkKind, string> = {
  Figma: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  Prototype: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  Site: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

export function LinkKindBadge({ kind }: { kind: LinkKind }) {
  return (
    <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.07em] ${KIND_CLASS[kind]}`}>
      {kind}
    </span>
  );
}
