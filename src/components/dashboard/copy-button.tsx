"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard no disponible; el usuario puede seleccionar el texto manualmente
    }
  }

  return (
    <button
      onClick={copy}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium hover:bg-border-soft/60"
    >
      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
