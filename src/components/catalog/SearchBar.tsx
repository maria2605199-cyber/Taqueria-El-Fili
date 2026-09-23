"use client";

import { useState } from "react";
import { Search, Sparkles, X, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "Quiero algo barato",
  "¿Qué tienes para 4 personas?",
  "Menos de $30",
  "¿Cuál es el más popular?",
];

export function SearchBar({
  onSearch,
  onClear,
  loading,
  active,
}: {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading: boolean;
  active: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  return (
    <div>
      <form onSubmit={submit} className="relative">
        <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Pregunta a la IA: "algo barato para 4 personas"'
          className="h-12 w-full rounded-2xl border border-ink-900/10 bg-white pl-11 pr-24 text-sm shadow-card outline-none placeholder:text-ink-900/35 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {active && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                onClear();
              }}
              className="rounded-full p-2 text-ink-900/40 hover:bg-ink-900/5"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Buscar
          </button>
        </div>
      </form>
      {!active && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                onSearch(s);
              }}
              className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs text-ink-900/60 transition hover:border-brand-300 hover:text-brand-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
