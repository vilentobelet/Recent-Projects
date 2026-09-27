export function ProjectTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span key={tag} className="rounded-md border border-[var(--card-border)] bg-[var(--card-soft)] px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.07em] text-[var(--card-accent)]">
          {tag}
        </span>
      ))}
    </div>
  );
}
