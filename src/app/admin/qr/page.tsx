import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl, getCatalogUrl } from "@/lib/qr";
import { QRCodeCard } from "@/components/admin/QRCodeCard";

export default async function QRPage() {
  const session = await getServerSession(authOptions);
  const business = await prisma.business.findUnique({ where: { id: session!.user.businessId } });
  if (!business) return null;

  const catalogUrl = getCatalogUrl(business.slug);
  const qrDataUrl = await generateQrDataUrl(catalogUrl);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Código QR</h1>
        <p className="mt-1 text-sm text-ink-900/55">
          Imprime este código en mesas, vitrinas o tarjetas para que tus clientes abran tu catálogo al instante.
        </p>
      </div>
      <QRCodeCard qrDataUrl={qrDataUrl} catalogUrl={catalogUrl} businessName={business.name} />
    </div>
  );
}
