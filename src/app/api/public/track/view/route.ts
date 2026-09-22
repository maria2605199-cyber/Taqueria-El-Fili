import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { businessId, productId } = body ?? {};
  if (!businessId || !productId) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({ where: { id: productId, businessId } });
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  await prisma.productView.create({ data: { businessId, productId } });
  return NextResponse.json({ ok: true });
}
