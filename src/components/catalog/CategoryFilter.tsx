"use client";

import type { CategoryDTO } from "@/types";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: CategoryDTO[];
  active: string | null;
  onChange: (categoryId: string | null) => void;
}) {
  return (
    <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition",
          active === null ? "bg-ink-900 text-white" : "bg-ink-900/5 text-ink-900/60 hover:bg-ink-900/10"
        )}
      >
        Todos
      </button>
      <button
        onClick={() => onChange("featured")}
        className={cn(
          "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition",
          active === "featured" ? "bg-brand-500 text-white" : "bg-brand-500/10 text-brand-700 hover:bg-brand-500/20"
        )}
      >
        ⭐ Destacados
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition",
            active === c.id ? "bg-ink-900 text-white" : "bg-ink-900/5 text-ink-900/60 hover:bg-ink-900/10"
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
