"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Badge } from "@/components/ui/Card";
import { PLAN_LABELS } from "@/lib/plans";

export function AdminShell({
  businessName,
  businessSlug,
  plan,
  children,
}: {
  businessName: string;
  businessSlug: string;
  plan: "BASICO" | "PRO" | "PREMIUM";
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-900/[0.02] md:flex">
      <div className="hidden md:block md:w-64 md:shrink-0">
        <div className="fixed h-screen w-64">
          <Sidebar businessName={businessName} businessSlug={businessSlug} />
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72">
            <Sidebar businessName={businessName} businessSlug={businessSlug} />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-900/8 bg-white/90 px-5 py-3.5 backdrop-blur md:justify-end">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-ink-900/5 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <Badge variant="brand">Plan {PLAN_LABELS[plan]}</Badge>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
