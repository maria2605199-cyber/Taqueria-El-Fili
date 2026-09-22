"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-foreground/60 hover:bg-surface-muted hover:text-foreground"
    >
      <LogOut size={16} /> Cerrar sesión
    </button>
  );
}
