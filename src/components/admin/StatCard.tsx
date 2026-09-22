import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "brand" | "green" | "amber" | "sky";
}) {
  const accents: Record<string, string> = {
    brand: "bg-brand-500/10 text-brand-600",
    green: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    sky: "bg-sky-500/10 text-sky-600",
  };

  return (
    <Card className="p-5">
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", accents[accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-0.5 text-xs text-ink-900/50">{label}</p>
      {hint && <p className="mt-2 text-[11px] text-ink-900/35">{hint}</p>}
    </Card>
  );
}
