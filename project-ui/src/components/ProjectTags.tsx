export function ProjectTags({ tags, nowrap = false }: { tags: string[]; nowrap?: boolean }) {
  if (!tags.length) return null;
  return (
    <div className={`mt-2 flex gap-1 ${nowrap ? "flex-nowrap overflow-hidden" : "flex-wrap"}`}>
      {tags.map((tag) => (
        <span key={tag} className="shrink-0 rounded-md border border-[var(--card-border)] bg-[var(--card-soft)] px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-[var(--card-accent)]">
          {tag}
        </span>
      ))}
    </div>
  );
}
