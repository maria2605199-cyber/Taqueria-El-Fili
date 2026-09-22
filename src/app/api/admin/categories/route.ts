import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireBusinessSession } from "@/lib/tenant";
import { toCategoryDTO } from "@/lib/mappers";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { businessId: session.user.businessId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories.map(toCategoryDTO));
}

const schema = z.object({ name: z.string().min(2) });

export async function POST(req: Request) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name) || "categoria";
  let slug = baseSlug;
  let n = 1;
  while (await prisma.category.findFirst({ where: { businessId: session.user.businessId, slug } })) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  const category = await prisma.category.create({
    data: { name: parsed.data.name, slug, businessId: session.user.businessId },
  });

  return NextResponse.json(toCategoryDTO(category), { status: 201 });
}
