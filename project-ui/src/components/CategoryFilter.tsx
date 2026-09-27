export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <nav aria-label="Project categories" className="flex gap-1.5 overflow-x-auto pb-1">
      {categories.map((category) => {
        const active = selected.toLocaleLowerCase() === category.toLocaleLowerCase();
        return (
          <button
            key={category}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
              active
                ? "border-orange-500 bg-orange-500 text-zinc-950"
                : "border-white/[0.09] bg-white/[0.025] text-zinc-500 hover:border-orange-500/30 hover:bg-orange-500/[0.06] hover:text-zinc-200"
            }`}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
