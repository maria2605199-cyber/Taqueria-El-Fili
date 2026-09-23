import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBusinessSession } from "@/lib/tenant";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const category = await prisma.category.findFirst({
    where: { id: params.id, businessId: session.user.businessId },
  });
  if (!category) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });

  await prisma.category.delete({ where: { id: category.id } });
  return NextResponse.json({ ok: true });
}
