"use client";

import { useActionState, useState } from "react";
import { Input, Textarea, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { DIAS_SEMANA, type BusinessHours, type BusinessSocials } from "@/lib/types";
import type { BusinessFormState } from "@/app/dashboard/negocio/actions";

interface Props {
  action: (state: BusinessFormState, formData: FormData) => Promise<BusinessFormState>;
  submitLabel: string;
  initial?: {
    name: string;
    description: string;
    whatsapp: string;
    address: string;
    city: string;
    logoUrl: string;
    hours: BusinessHours[];
    socials: BusinessSocials;
  };
}

const defaultHours: BusinessHours[] = DIAS_SEMANA.map((day) => ({
  day,
  open: "09:00",
  close: "20:00",
  closed: day === "Domingo",
}));

export function BusinessForm({ action, submitLabel, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [hours, setHours] = useState<BusinessHours[]>(initial?.hours ?? defaultHours);

  function updateHour(index: number, patch: Partial<BusinessHours>) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="hours" value={JSON.stringify(hours)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Nombre del negocio</FieldLabel>
          <Input name="name" defaultValue={initial?.name} placeholder="Taquería El Fili" required />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel hint="se muestra debajo del nombre en el catálogo">Descripción corta</FieldLabel>
          <Textarea
            name="description"
            defaultValue={initial?.description}
            placeholder="Tacos y antojitos mexicanos hechos al momento."
            rows={2}
            required
          />
        </div>
        <div>
          <FieldLabel hint="incluye código de país, ej. 521234567890">WhatsApp</FieldLabel>
          <Input name="whatsapp" defaultValue={initial?.whatsapp} placeholder="521234567890" required />
        </div>
        <div>
          <FieldLabel hint="opcional, URL de imagen">Logo</FieldLabel>
          <Input name="logoUrl" defaultValue={initial?.logoUrl} placeholder="https://..." />
        </div>
        <div>
          <FieldLabel>Dirección</FieldLabel>
          <Input name="address" defaultValue={initial?.address} placeholder="Av. Siempre Viva 123" required />
        </div>
        <div>
          <FieldLabel>Ciudad</FieldLabel>
          <Input name="city" defaultValue={initial?.city} placeholder="Guadalajara, Jal." required />
        </div>
      </div>

      <div>
        <FieldLabel>Redes sociales (opcional)</FieldLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input name="instagram" defaultValue={initial?.socials.instagram} placeholder="Instagram (usuario)" />
          <Input name="facebook" defaultValue={initial?.socials.facebook} placeholder="Facebook (usuario/página)" />
          <Input name="tiktok" defaultValue={initial?.socials.tiktok} placeholder="TikTok (usuario)" />
        </div>
      </div>

      <div>
        <FieldLabel>Horarios</FieldLabel>
        <div className="space-y-2 rounded-xl border border-border-soft p-3">
          {hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-[80px_1fr_1fr_auto] items-center gap-2 text-sm">
              <span className="font-medium">{h.day}</span>
              <input
                type="time"
                value={h.open}
                disabled={h.closed}
                onChange={(e) => updateHour(i, { open: e.target.value })}
                className="rounded-lg border border-border-soft bg-surface px-2 py-1.5 disabled:opacity-40"
              />
              <input
                type="time"
                value={h.close}
                disabled={h.closed}
                onChange={(e) => updateHour(i, { close: e.target.value })}
                className="rounded-lg border border-border-soft bg-surface px-2 py-1.5 disabled:opacity-40"
              />
              <label className="flex items-center gap-1.5 text-xs text-foreground/60">
                <input
                  type="checkbox"
                  checked={!!h.closed}
                  onChange={(e) => updateHour(i, { closed: e.target.checked })}
                />
                Cerrado
              </label>
            </div>
          ))}
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
          Cambios guardados correctamente.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
