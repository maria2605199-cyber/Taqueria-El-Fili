import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBusinessSession } from "@/lib/tenant";
import { generateProductDraft } from "@/lib/ai/productGenerator";
import { hasFeature } from "@/lib/plans";

export async function POST(req: Request) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!hasFeature(session.user.plan as any, "aiProductGenerator")) {
    return NextResponse.json({ error: "Esta función requiere el plan Pro o Premium." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const name = (body?.name as string | undefined)?.trim();
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Escribe el nombre del producto" }, { status: 400 });
  }

  const categories = await prisma.category.findMany({
    where: { businessId: session.user.businessId },
    select: { name: true },
  });

  const draft = await generateProductDraft(
    name,
    categories.map((c) => c.name)
  );

  return NextResponse.json(draft);
}
