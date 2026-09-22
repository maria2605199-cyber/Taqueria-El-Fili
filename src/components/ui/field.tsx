import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-sm font-medium text-foreground/90">{children}</span>
      {hint && <span className="text-xs text-foreground/40">{hint}</span>}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border-soft bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
        className
      )}
      {...props}
    />
  );
}

export function Field({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
