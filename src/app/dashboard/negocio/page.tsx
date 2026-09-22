import { requireBusiness } from "@/lib/current-business";
import { updateBusinessAction } from "@/app/dashboard/negocio/actions";
import { BusinessForm } from "@/components/dashboard/business-form";
import { safeJsonParse } from "@/lib/utils";
import type { BusinessHours, BusinessSocials } from "@/lib/types";

export default async function NegocioSettingsPage() {
  const { business } = await requireBusiness();

  const hours = safeJsonParse<BusinessHours[]>(business.hours, []);
  const socials = safeJsonParse<BusinessSocials>(business.socials, {});

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Información del negocio</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Se refleja de inmediato en tu catálogo público:{" "}
          <span className="font-mono text-violet-600">/negocio/{business.slug}</span>
        </p>
      </div>
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <BusinessForm
          action={updateBusinessAction}
          submitLabel="Guardar cambios"
          initial={{
            name: business.name,
            description: business.description,
            whatsapp: business.whatsapp,
            address: business.address,
            city: business.city,
            logoUrl: business.logoUrl ?? "",
            hours,
            socials,
          }}
        />
      </div>
    </main>
  );
}
