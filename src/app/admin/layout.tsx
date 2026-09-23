import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    redirect("/login");
  }

  return (
    <AdminShell
      businessName={session.user.businessName}
      businessSlug={session.user.businessSlug}
      plan={session.user.plan as "BASICO" | "PRO" | "PREMIUM"}
    >
      {children}
    </AdminShell>
  );
}
