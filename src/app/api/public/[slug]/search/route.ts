import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runSmartSearch } from "@/lib/ai";
import { toProductForAI } from "@/lib/ai/adapt";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return NextResponse.json({ error: "Negocio no encontrado." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const query = (body?.query as string | undefined)?.trim();
  if (!query) return NextResponse.json({ error: "Escribe algo para buscar." }, { status: 400 });

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    include: { category: true },
  });

  const result = await runSmartSearch(products.map(toProductForAI), query);

  await prisma.analyticsEvent.create({
    data: { businessId: business.id, type: "AI_QUERY", query },
  });

  const matched = result.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return NextResponse.json({
    message: result.message,
    products: matched.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      shortDescription: p.shortDescription,
      imageUrl: p.imageUrl,
      available: p.available,
      categoryName: p.category?.name ?? null,
    })),
  });
}
