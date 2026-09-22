import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";
import { searchCatalog } from "@/lib/ai/search";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const businessId = body?.businessId as string | undefined;
  const query = (body?.query as string | undefined)?.slice(0, 300) ?? "";

  if (!businessId) {
    return NextResponse.json({ error: "businessId requerido" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { businessId, active: true },
    include: { category: true },
  });
  const catalog = products.map(toProductDTO);

  const result = await searchCatalog(query, catalog);

  await prisma.aIQueryLog.create({
    data: { businessId, query, mode: "search", resultCount: result.products.length },
  });

  return NextResponse.json(result);
}
