import { getServerSession } from "next-auth";
import { Nfc, Smartphone, Copy } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCatalogUrl } from "@/lib/qr";
import { Card } from "@/components/ui/Card";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";

const STEPS = [
  "Consigue una etiqueta NFC (NTAG213/215/216) — se consiguen en línea por unos pesos cada una.",
  'Descarga una app gratuita para programar NFC, como "NFC Tools" (Android/iOS).',
  "Abre la app, elige 'Escribir' y selecciona el tipo de registro 'URL / URI'.",
  "Pega el enlace de tu catálogo (abajo) y guarda el registro en la etiqueta acercándola al teléfono.",
  "Pega la etiqueta en tu mostrador, mesa o empaque. Tus clientes solo acercan su teléfono para abrir el catálogo.",
];

export default async function NfcPage() {
  const session = await getServerSession(authOptions);
  const business = await prisma.business.findUnique({ where: { id: session!.user.businessId } });
  if (!business) return null;

  const catalogUrl = getCatalogUrl(business.slug);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Configurar NFC</h1>
        <p className="mt-1 text-sm text-ink-900/55">
          Programa una etiqueta NFC con tu enlace para que los clientes abran tu catálogo acercando el teléfono.
        </p>
      </div>

      <Card className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
            <Nfc className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">Enlace para tu etiqueta NFC</p>
            <p className="text-sm text-ink-900/60">{catalogUrl}</p>
          </div>
        </div>
        <CopyLinkButton text={catalogUrl} />
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2 text-ink-900">
          <Smartphone className="h-4 w-4" />
          <h2 className="font-semibold">Cómo programar tu etiqueta</h2>
        </div>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-900/70">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900/5 text-xs font-bold text-ink-900">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <p className="text-xs text-ink-900/40">
        Nota: la plataforma no programa la etiqueta física por ti — usa una app NFC en tu teléfono con el enlace de arriba. El mismo enlace también funciona como tu código QR.
      </p>
    </div>
  );
}
