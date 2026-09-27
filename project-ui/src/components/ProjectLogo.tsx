import { Layers3 } from "lucide-react";

export function ProjectLogo({ src, size = "md" }: { src?: string; size?: "sm" | "md" }) {
  const box = size === "md" ? "size-10" : "size-9";
  return (
    <span className={`grid ${box} shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-soft)] text-[var(--card-accent)]`}>
      {src ? <img src={src} alt="" className="size-full object-cover" /> : <Layers3 className="size-4" />}
    </span>
  );
}
