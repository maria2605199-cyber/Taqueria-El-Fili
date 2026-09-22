import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set(["PRODUCT_VIEW", "WHATSAPP_CLICK", "CATALOG_VIEW"]);

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Negocio no encontrado." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const type = body?.type as string | undefined;
  const productId = body?.productId as string | undefined;

  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "Tipo de evento inválido." }, { status: 400 });
  }

  let validProductId: string | undefined;
  if (productId) {
    const product = await prisma.product.findFirst({
      where: { id: productId, businessId: business.id },
    });
    if (product) {
      validProductId = product.id;
      if (type === "PRODUCT_VIEW") {
        await prisma.product.update({
          where: { id: product.id },
          data: { viewCount: { increment: 1 } },
        });
      } else if (type === "WHATSAPP_CLICK") {
        await prisma.product.update({
          where: { id: product.id },
          data: { whatsappClicks: { increment: 1 } },
        });
      }
    }
  }

  await prisma.analyticsEvent.create({
    data: {
      businessId: business.id,
      type: type as "PRODUCT_VIEW" | "WHATSAPP_CLICK" | "CATALOG_VIEW",
      productId: validProductId,
    },
  });

  return NextResponse.json({ ok: true });
}
