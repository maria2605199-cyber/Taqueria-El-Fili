"use client";

import { useActionState, useState } from "react";
import { Input, Textarea, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import type { ProductFaq, ProductVariant } from "@/lib/types";
import type { ProductFormState } from "@/app/dashboard/productos/actions";

interface CategoryOption {
  id: string;
  name: string;
}

interface Props {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  categories: CategoryOption[];
  initial?: {
    name: string;
    price: number;
    shortDescription: string;
    description: string;
    categoryId: string | null;
    tags: string[];
    variants: ProductVariant[];
    faqs: ProductFaq[];
    imageUrl: string;
    available: boolean;
    featured: boolean;
  };
}

export function ProductForm({ action, submitLabel, categories, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const [name, setName] = useState(initial?.name ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<ProductFaq[]>(initial?.faqs ?? []);
  const [variants, setVariants] = useState<ProductVariant[]>(initial?.variants ?? []);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function generateWithAI() {
    if (!name.trim()) {
      setAiError("Escribe primero el nombre del producto.");
      return;
    }
    setAiError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/dashboard/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("No se pudo generar el contenido.");
      const data = await res.json();
      setShortDescription(data.shortDescription ?? "");
      setDescription(data.description ?? "");
      setTags(data.tags ?? []);
      setTagsInput((data.tags ?? []).join(", "));
      setFaqs(data.faqs ?? []);
      setSuggestedCategory(data.suggestedCategory ?? null);
    } catch {
      setAiError("Ocurrió un error generando el contenido. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  }

  function addVariant() {
    setVariants((v) => [...v, { name: "", options: [] }]);
  }
  function updateVariant(i: number, patch: Partial<ProductVariant> & { optionsText?: string }) {
    setVariants((v) =>
      v.map((variant, idx) => {
        if (idx !== i) return variant;
        const next = { ...variant, ...patch };
        if (patch.optionsText !== undefined) {
          next.options = patch.optionsText.split(",").map((o) => o.trim()).filter(Boolean);
        }
        return next;
      })
    );
  }
  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function addFaq() {
    setFaqs((f) => [...f, { q: "", a: "" }]);
  }
  function updateFaq(i: number, patch: Partial<ProductFaq>) {
    setFaqs((f) => f.map((faq, idx) => (idx === i ? { ...faq, ...patch } : faq)));
  }
  function removeFaq(i: number) {
    setFaqs((f) => f.filter((_, idx) => idx !== i));
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <FieldLabel>Nombre del producto</FieldLabel>
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pizza mexicana"
              required
            />
          </div>
          <Button type="button" variant="secondary" onClick={generateWithAI} disabled={generating}>
            <Sparkles size={16} className={generating ? "animate-spin" : ""} />
            {generating ? "Generando..." : "Generar con IA"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-foreground/50">
          Escribe solo el nombre y deja que la IA sugiera descripción, etiquetas y preguntas
          frecuentes. Podrás editar todo antes de publicar. Nunca se inventan precios ni
          disponibilidad.
        </p>
        {aiError && <p className="mt-2 text-xs text-red-600">{aiError}</p>}
        {suggestedCategory && (
          <p className="mt-2 text-xs text-violet-600">
            Categoría sugerida: <strong>{suggestedCategory}</strong> — selecciónala abajo si aplica.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Precio (MXN)</FieldLabel>
          <Input type="number" name="price" step="0.01" min={0} defaultValue={initial?.price} required />
        </div>
        <div>
          <FieldLabel>Categoría</FieldLabel>
          <select
            name="categoryId"
            defaultValue={initial?.categoryId ?? ""}
            className="w-full rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Descripción corta</FieldLabel>
          <Input
            name="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Se muestra en la tarjeta del producto"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Descripción comercial</FieldLabel>
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel hint="separadas por coma">Etiquetas</FieldLabel>
          <Input
            value={tagsInput}
            onChange={(e) => {
              setTagsInput(e.target.value);
              setTags(e.target.value.split(",").map((t) => t.trim()).filter(Boolean));
            }}
            placeholder="picante, popular, para compartir"
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel hint="URL de la fotografía (sube tu imagen a un servicio de hosting o usa una URL)">
            Fotografía
          </FieldLabel>
          <Input name="imageUrl" defaultValue={initial?.imageUrl} placeholder="https://..." />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <FieldLabel>Variantes (tamaños, sabores, tallas...)</FieldLabel>
          <button type="button" onClick={addVariant} className="text-xs font-medium text-violet-600 hover:underline flex items-center gap-1">
            <Plus size={14} /> Agregar variante
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={v.name}
                onChange={(e) => updateVariant(i, { name: e.target.value })}
                placeholder="Tamaño"
                className="w-1/3"
              />
              <Input
                value={v.options.join(", ")}
                onChange={(e) => updateVariant(i, { optionsText: e.target.value })}
                placeholder="Chico, Mediano, Grande"
              />
              <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <FieldLabel>Preguntas frecuentes</FieldLabel>
          <button type="button" onClick={addFaq} className="text-xs font-medium text-violet-600 hover:underline flex items-center gap-1">
            <Plus size={14} /> Agregar pregunta
          </button>
        </div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={f.q}
                onChange={(e) => updateFaq(i, { q: e.target.value })}
                placeholder="Pregunta"
                className="w-1/3"
              />
              <Input
                value={f.a}
                onChange={(e) => updateFaq(i, { a: e.target.value })}
                placeholder="Respuesta"
              />
              <button type="button" onClick={() => removeFaq(i)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="available" defaultChecked={initial?.available ?? true} />
          Disponible
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} />
          Producto destacado
        </label>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
