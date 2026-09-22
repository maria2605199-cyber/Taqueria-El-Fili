"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Plus, Trash2, Save } from "lucide-react";
import type { CategoryDTO, ProductDTO } from "@/types";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface FormState {
  name: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  shortDescription: string;
  description: string;
  features: string[];
  tags: string[];
  faqs: { q: string; a: string }[];
  variants: { name: string; options: string[] }[];
  imageUrl: string;
  available: boolean;
  featured: boolean;
  active: boolean;
}

function fromProduct(p?: ProductDTO): FormState {
  return {
    name: p?.name ?? "",
    categoryId: p?.categoryId ?? "",
    price: p ? String(p.price) : "",
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : "",
    shortDescription: p?.shortDescription ?? "",
    description: p?.description ?? "",
    features: p?.features ?? [],
    tags: p?.tags ?? [],
    faqs: p?.faqs ?? [],
    variants: p?.variants ?? [],
    imageUrl: p?.imageUrl ?? "",
    available: p?.available ?? true,
    featured: p?.featured ?? false,
    active: p?.active ?? true,
  };
}

export function ProductForm({
  product,
  categories,
  aiGeneratorEnabled,
  aiImageToolsEnabled,
}: {
  product?: ProductDTO;
  categories: CategoryDTO[];
  aiGeneratorEnabled: boolean;
  aiImageToolsEnabled: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(fromProduct(product));
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function generateWithAI() {
    if (!form.name.trim()) {
      setError("Escribe primero el nombre del producto");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm((f) => ({
        ...f,
        shortDescription: data.shortDescription,
        description: data.description,
        features: data.features,
        tags: data.tags,
        faqs: data.faqs,
      }));
    } catch (err: any) {
      setError(err.message || "No se pudo generar con IA");
    } finally {
      setGenerating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      categoryId: form.categoryId || null,
      price: parseFloat(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      shortDescription: form.shortDescription,
      description: form.description,
      features: form.features,
      tags: form.tags,
      faqs: form.faqs,
      variants: form.variants,
      imageUrl: form.imageUrl || null,
      images: form.imageUrl ? [form.imageUrl] : [],
      available: form.available,
      featured: form.featured,
      active: form.active,
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/productos");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-4 p-6">
        <div>
          <Label>Nombre del producto</Label>
          <div className="flex gap-2">
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej. Pizza mexicana" />
            {aiGeneratorEnabled && (
              <Button type="button" variant="secondary" onClick={generateWithAI} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generar con IA
              </Button>
            )}
          </div>
          {!aiGeneratorEnabled && (
            <p className="mt-1 text-xs text-ink-900/40">La generación automática con IA requiere el plan Pro o Premium.</p>
          )}
        </div>

        <ImageUpload value={form.imageUrl || null} onChange={(url) => set("imageUrl", url)} aiImageToolsEnabled={aiImageToolsEnabled} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Precio</Label>
            <Input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label>Precio anterior (opcional)</Label>
            <Input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder="0.00" />
          </div>
        </div>

        <div>
          <Label>Categoría</Label>
          <Select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Descripción corta</Label>
          <Input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Frase corta para la tarjeta del producto" />
        </div>

        <div>
          <Label>Descripción comercial</Label>
          <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Descripción completa del producto" />
        </div>
      </Card>

      <Card className="p-6">
        <ListEditor
          label="Características"
          items={form.features}
          onChange={(items) => set("features", items)}
          placeholder="Ej. Ingredientes frescos"
        />
      </Card>

      <Card className="p-6">
        <ListEditor label="Etiquetas" items={form.tags} onChange={(items) => set("tags", items)} placeholder="Ej. popular" />
      </Card>

      <Card className="p-6">
        <FaqEditor faqs={form.faqs} onChange={(faqs) => set("faqs", faqs)} />
      </Card>

      <Card className="p-6">
        <VariantEditor variants={form.variants} onChange={(variants) => set("variants", variants)} />
      </Card>

      <Card className="flex flex-wrap gap-6 p-6">
        <ToggleField label="Disponible" checked={form.available} onChange={(v) => set("available", v)} />
        <ToggleField label="Destacado" checked={form.featured} onChange={(v) => set("featured", v)} />
        <ToggleField label="Activo (visible en catálogo)" checked={form.active} onChange={(v) => set("active", v)} />
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-900/80">
      <span
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-500" : "bg-ink-900/15"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </label>
  );
}

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  function add() {
    if (!value.trim()) return;
    onChange([...items, value.trim()]);
    setValue("");
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 rounded-full bg-ink-900/5 px-3 py-1 text-xs text-ink-900/70">
              {item}
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
                <Trash2 className="h-3 w-3 text-ink-900/40 hover:text-red-500" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqEditor({
  faqs,
  onChange,
}: {
  faqs: { q: string; a: string }[];
  onChange: (faqs: { q: string; a: string }[]) => void;
}) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  function add() {
    if (!q.trim() || !a.trim()) return;
    onChange([...faqs, { q: q.trim(), a: a.trim() }]);
    setQ("");
    setA("");
  }

  return (
    <div>
      <Label>Preguntas frecuentes</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pregunta" />
        <div className="flex gap-2">
          <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="Respuesta" />
          <Button type="button" variant="outline" onClick={add}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {faqs.length > 0 && (
        <div className="mt-3 space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-lg bg-ink-900/[0.03] p-3 text-sm">
              <div>
                <p className="font-medium text-ink-900">{f.q}</p>
                <p className="text-ink-900/55">{f.a}</p>
              </div>
              <button type="button" onClick={() => onChange(faqs.filter((_, idx) => idx !== i))}>
                <Trash2 className="h-3.5 w-3.5 text-ink-900/40 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantEditor({
  variants,
  onChange,
}: {
  variants: { name: string; options: string[] }[];
  onChange: (variants: { name: string; options: string[] }[]) => void;
}) {
  const [name, setName] = useState("");
  const [options, setOptions] = useState("");

  function add() {
    if (!name.trim() || !options.trim()) return;
    onChange([...variants, { name: name.trim(), options: options.split(",").map((o) => o.trim()).filter(Boolean) }]);
    setName("");
    setOptions("");
  }

  return (
    <div>
      <Label>Variantes (ej. Tamaño, Sabor)</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la variante" />
        <div className="flex gap-2">
          <Input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Opciones separadas por coma" />
          <Button type="button" variant="outline" onClick={add}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {variants.length > 0 && (
        <div className="mt-3 space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-ink-900/[0.03] p-3 text-sm">
              <div>
                <p className="font-medium text-ink-900">{v.name}</p>
                <p className="text-ink-900/55">{v.options.join(", ")}</p>
              </div>
              <button type="button" onClick={() => onChange(variants.filter((_, idx) => idx !== i))}>
                <Trash2 className="h-3.5 w-3.5 text-ink-900/40 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
