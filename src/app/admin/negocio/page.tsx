import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toBusinessDTO } from "@/lib/mappers";
import { BusinessForm } from "@/components/admin/BusinessForm";

export default async function BusinessSettingsPage() {
  const session = await getServerSession(authOptions);
  const business = await prisma.business.findUnique({ where: { id: session!.user.businessId } });
  if (!business) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Mi negocio</h1>
        <p className="mt-1 text-sm text-ink-900/55">Esta información aparece en tu catálogo público.</p>
      </div>
      <BusinessForm business={toBusinessDTO(business)} />
    </div>
  );
}
