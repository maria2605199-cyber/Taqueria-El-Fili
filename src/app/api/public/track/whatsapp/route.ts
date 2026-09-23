import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { businessId, productId, source } = body ?? {};
  if (!businessId || (source !== "product" && source !== "general")) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  if (productId) {
    const product = await prisma.product.findFirst({ where: { id: productId, businessId } });
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
  }

  await prisma.whatsAppClick.create({ data: { businessId, productId: productId || null, source } });
  return NextResponse.json({ ok: true });
}
