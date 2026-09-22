"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4">
      <div
        className={cn(
          "max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl animate-fade-up sm:max-w-lg sm:rounded-3xl sm:p-6",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-ink-900">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-2 text-ink-900/50 hover:bg-ink-900/5 hover:text-ink-900"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
