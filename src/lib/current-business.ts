import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Aísla los datos entre negocios (multi-tenant): siempre resuelve el
 * negocio a partir del usuario autenticado, nunca a partir de un id
 * recibido del cliente. Todas las mutaciones del panel deben pasar por
 * aquí (o por requireBusiness) antes de tocar la base de datos.
 */
export async function getCurrentBusiness() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.business.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export async function requireBusiness() {
  const session = await requireSession();
  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  if (!business) redirect("/dashboard/negocio/nuevo");
  return { session, business };
}

/**
 * Variante para API routes (no usa redirect(), que solo aplica a Server
 * Components/Actions). Devuelve null si no hay sesión o negocio, para que
 * la ruta responda 401 en vez de intentar una redirección HTTP rara.
 */
export async function getBusinessForApi() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  if (!business) return null;
  return { session, business };
}

/**
 * Verifica que un producto/categoría pertenezca al negocio del usuario
 * autenticado antes de permitir que el panel lo edite o borre. Evita que
 * un negocio manipule datos de otro negocio aunque adivine un id.
 */
export async function assertOwnsProduct(productId: string, businessId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, businessId },
  });
  if (!product) throw new Error("Producto no encontrado o no pertenece a este negocio.");
  return product;
}
