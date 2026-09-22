import { headers } from "next/headers";
import { requireBusiness } from "@/lib/current-business";
import { Download, Smartphone } from "lucide-react";
import { CopyButton } from "@/components/dashboard/copy-button";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export default async function QrNfcPage() {
  const { business } = await requireBusiness();
  const baseUrl = await getBaseUrl();
  const catalogUrl = `${baseUrl}/negocio/${business.slug}`;
  const qrUrl = `/api/qr?url=${encodeURIComponent(catalogUrl)}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Código QR y NFC</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Comparte tu catálogo sin que tus clientes necesiten crear una cuenta.
        </p>
      </div>

      <div className="glass-card mb-6 rounded-2xl p-6 shadow-xl">
        <h2 className="mb-1 font-semibold">Enlace único de tu negocio</h2>
        <p className="mb-4 text-sm text-foreground/60">
          Este es el enlace permanente de tu catálogo público.
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-soft bg-surface-muted px-4 py-3">
          <code className="flex-1 truncate text-sm">{catalogUrl}</code>
          <CopyButton value={catalogUrl} />
        </div>
      </div>

      <div className="glass-card mb-6 flex flex-col items-center gap-4 rounded-2xl p-6 text-center shadow-xl sm:flex-row sm:text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`Código QR del catálogo de ${business.name}`}
          width={200}
          height={200}
          className="rounded-xl border border-border-soft"
        />
        <div>
          <h2 className="mb-1 font-semibold">Código QR</h2>
          <p className="mb-4 text-sm text-foreground/60">
            Imprímelo en tu menú, mesas, empaques o escaparate. Al escanearlo se abre directamente
            tu catálogo.
          </p>
          <a
            href={qrUrl}
            download={`qr-${business.slug}.png`}
            className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-sm font-medium hover:bg-border-soft/60"
          >
            <Download size={16} /> Descargar QR
          </a>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <div className="mb-3 flex items-center gap-2">
          <Smartphone size={20} className="text-violet-600" />
          <h2 className="font-semibold">Configurar etiqueta NFC</h2>
        </div>
        <p className="mb-4 text-sm text-foreground/60">
          Para que tus clientes abran el catálogo acercando el teléfono, programa una etiqueta NFC
          (disponibles en tiendas de electrónica o en línea) con el siguiente enlace usando una app
          como &quot;NFC Tools&quot; (Android/iOS):
        </p>
        <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-foreground/70">
          <li>Descarga una app de escritura NFC en tu teléfono.</li>
          <li>Crea un nuevo registro de tipo &quot;URL / enlace&quot;.</li>
          <li>Pega el enlace de abajo y escribe la etiqueta acercándola a tu teléfono.</li>
          <li>Coloca la etiqueta en tu mostrador, mesa o empaque.</li>
        </ol>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-soft bg-surface-muted px-4 py-3">
          <code className="flex-1 truncate text-sm">{catalogUrl}</code>
          <CopyButton value={catalogUrl} />
        </div>
      </div>
    </main>
  );
}
