"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, ImageOff, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ImageUpload({
  value,
  onChange,
  aiImageToolsEnabled,
}: {
  value: string | null;
  onChange: (url: string) => void;
  aiImageToolsEnabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "No se pudo subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onEnhance(action: string) {
    if (!value) return;
    setEnhancing(true);
    setNote("");
    try {
      const res = await fetch("/api/admin/ai/enhance-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: value, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.url);
      setNote(data.message);
    } catch (err: any) {
      setError(err.message || "No se pudo procesar la imagen");
    } finally {
      setEnhancing(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-ink-900/10 bg-ink-900/5">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" sizes="96px" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-900/20">
              <ImageOff className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={onFileSelected} className="hidden" />
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? "Subiendo..." : "Subir fotografía"}
          </Button>
          {aiImageToolsEnabled && value && (
            <div className="flex flex-wrap gap-1.5">
              {["Mejorar iluminación", "Eliminar fondo", "Mejorar calidad", "Imagen promocional"].map((label) => (
                <button
                  key={label}
                  type="button"
                  disabled={enhancing}
                  onClick={() => onEnhance(label)}
                  className="flex items-center gap-1 rounded-full border border-brand-500/20 bg-brand-500/5 px-2.5 py-1 text-[11px] text-brand-700 hover:bg-brand-500/10 disabled:opacity-50"
                >
                  <Wand2 className="h-3 w-3" /> {label}
                </button>
              ))}
            </div>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {note && <p className="text-xs text-ink-900/45">{note}</p>}
        </div>
      </div>
    </div>
  );
}
