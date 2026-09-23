import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Every admin API route must call this first and use the returned
 * businessId to scope all Prisma queries (where: { businessId }). This is
 * the single choke point that guarantees one business can never read or
 * write another business's data.
 */
export async function requireBusinessSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return null;
  }
  return session;
}
