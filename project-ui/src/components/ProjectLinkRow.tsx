import { useState } from "react";
import { Check, Clipboard, ExternalLink, Link2 } from "lucide-react";
import { getDisplayLink, getFaviconUrl, getLinkKind, normaliseLink, type LinkKind } from "../model";
import { GhostButton } from "./GhostButton";
import { LinkKindBadge } from "./LinkKindBadge";

export function ProjectLinkRow({
  link,
  copied,
  hasPassword,
  onCopy,
}: {
  link: string;
  copied: boolean;
  hasPassword?: boolean;
  onCopy: () => void;
}) {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const kind: LinkKind = getLinkKind(link);
  const fullLink = normaliseLink(link);
  const displayLink = getDisplayLink(link);
  const faviconUrl = getFaviconUrl(link);
  const copyLabel = copied ? <><Check className="size-3.5" /> Copied ✓</> : <><Clipboard className="size-3.5" /> Copy</>;

  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-2.5">
      <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/[0.07] bg-white/5 text-zinc-400">
        {faviconUrl && !faviconFailed ? (
          <img src={faviconUrl} alt="" className="size-4 rounded-sm" onError={() => setFaviconFailed(true)} />
        ) : (
          <Link2 className="size-4" />
        )}
      </span>
      <button
        type="button"
        title={`${fullLink} — click to copy`}
        onClick={onCopy}
        className="min-w-0 flex-1 cursor-copy truncate text-left text-xs font-medium text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 sm:text-sm"
      >
        {displayLink}
      </button>
      <LinkKindBadge kind={kind} />
      <GhostButton className="hidden h-8 shrink-0 rounded-xl px-3 text-zinc-300 hover:bg-[var(--card-soft)] hover:text-[var(--card-accent)] sm:inline-flex" onClick={onCopy}>
        {copyLabel}
      </GhostButton>
      <a
        href={fullLink}
        target="_blank"
        rel="noreferrer"
        title={`${hasPassword ? "Copies the password, then opens " : "Open "}${fullLink}`}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3 text-sm font-semibold text-zinc-950 hover:bg-orange-400"
      >
        <ExternalLink className="size-4" /> Open
      </a>
    </div>
  );
}
