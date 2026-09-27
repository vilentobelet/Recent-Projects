import { Check, Clipboard, Eye, EyeOff, KeyRound } from "lucide-react";
import { GhostButton } from "./GhostButton";

export function ProjectPasswordRow({
  password,
  visible,
  copied,
  layout = "card",
  onToggleVisible,
  onCopy,
}: {
  password: string;
  visible: boolean;
  copied: boolean;
  layout?: "card" | "compact";
  onToggleVisible: () => void;
  onCopy: () => void;
}) {
  const copyLabel = copied ? <><Check className="size-3.5" /> Copied ✓</> : <><Clipboard className="size-3.5" /> Copy</>;
  if (layout === "compact") {
    return (
      <div className="flex w-full min-w-0 items-center gap-1.5 rounded-xl border border-white/[0.07] bg-black/20 px-2 py-1.5 sm:w-auto">
        <KeyRound className="size-3.5 shrink-0 text-zinc-500" />
        <span className="min-w-16 truncate font-mono text-xs tracking-wider text-zinc-300">{visible ? password : "••••••••"}</span>
        <GhostButton className="size-7 rounded-lg text-zinc-500 hover:text-white" aria-label={visible ? "Hide password" : "Show password"} onClick={onToggleVisible}>
          {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </GhostButton>
        <GhostButton className="h-7 rounded-lg px-2 text-xs text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)]" onClick={onCopy}>
          {copyLabel}
        </GhostButton>
      </div>
    );
  }
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-zinc-400">
        <KeyRound className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">Password</p>
        <p className="truncate font-mono text-sm font-medium tracking-wider text-zinc-300">{visible ? password : "••••••••"}</p>
      </div>
      <GhostButton className="size-8 rounded-lg text-zinc-400 hover:text-white" aria-label={visible ? "Hide password" : "Show password"} onClick={onToggleVisible}>
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </GhostButton>
      <GhostButton className="h-8 rounded-xl px-3 text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)]" onClick={onCopy}>
        {copyLabel}
      </GhostButton>
    </div>
  );
}
