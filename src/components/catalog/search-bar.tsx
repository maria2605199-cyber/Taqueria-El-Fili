"use client";

import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading: boolean;
  active: boolean;
}

const SUGGESTIONS = [
  "Quiero algo barato",
  "¿Qué me recomiendas para 4 personas?",
  "Muéstrame lo más vendido",
];

export function SearchBar({ onSearch, onClear, loading, active }: Props) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  function clear() {
    setValue("");
    onClear();
  }

  return (
    <div>
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Pregunta lo que sea: "algo barato", "para 4 personas"...'
          className="w-full rounded-full border border-border-soft bg-surface py-3.5 pl-11 pr-24 text-sm shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
          {active && (
            <button
              type="button"
              onClick={clear}
              className="rounded-full p-2 text-foreground/40 hover:bg-surface-muted"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="gradient-bg rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Buscar"}
          </button>
        </div>
      </form>
      {!active && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                onSearch(s);
              }}
              className="rounded-full border border-border-soft px-3 py-1 text-xs text-foreground/60 hover:bg-surface-muted"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
