import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";
import { runAssistant } from "@/lib/ai/assistant";
import type { ChatMessage } from "@/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const businessId = body?.businessId as string | undefined;
  const history = (body?.history as ChatMessage[] | undefined)?.slice(-16) ?? [];

  if (!businessId || history.length === 0) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { businessId, active: true },
    include: { category: true },
  });
  const catalog = products.map(toProductDTO);

  const { reply, products: recommended } = await runAssistant(business.name, history, catalog);

  const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  await prisma.aIQueryLog.create({
    data: { businessId, query: lastUserMessage, mode: "assistant", resultCount: recommended.length },
  });

  return NextResponse.json({ reply, products: recommended });
}
