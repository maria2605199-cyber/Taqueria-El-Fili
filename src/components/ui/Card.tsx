import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-900/8 bg-white shadow-card",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "brand" | "success" | "danger" | "muted" }) {
  const variants = {
    default: "bg-ink-900/5 text-ink-900",
    brand: "bg-brand-500/10 text-brand-700",
    success: "bg-emerald-500/10 text-emerald-700",
    danger: "bg-red-500/10 text-red-700",
    muted: "bg-ink-900/5 text-ink-900/50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
