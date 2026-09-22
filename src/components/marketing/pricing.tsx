import Link from "next/link";
import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { PLAN_INFO } from "@/lib/types";
import { cn } from "@/lib/utils";

const plans = [
  { key: "BASICO" as const, highlight: false },
  { key: "PRO" as const, highlight: true },
  { key: "PREMIUM" as const, highlight: false },
];

export function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Planes para cada etapa de tu negocio</h2>
        <p className="mt-3 text-foreground/60">
          Empieza gratis con lo esencial y desbloquea IA y analítica avanzada cuando lo necesites.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map(({ key, highlight }) => {
          const plan = PLAN_INFO[key];
          return (
            <div
              key={key}
              className={cn(
                "relative rounded-3xl p-8 shadow-sm",
                highlight ? "gradient-bg text-white shadow-xl" : "glass-card"
              )}
            >
              {highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700">
                  Más popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.label}</h3>
              <p className="mt-2 text-3xl font-bold">
                ${plan.price}
                <span className={cn("text-sm font-normal", highlight ? "text-white/70" : "text-foreground/50")}>
                  {" "}
                  /mes
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className={cn("mt-0.5 shrink-0", highlight ? "text-white" : "text-violet-600")} />
                    <span className={highlight ? "text-white/90" : "text-foreground/70"}>{f}</span>
                  </li>
                ))}
              </ul>
              {highlight ? (
                <Link
                  href="/register"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-white/90"
                >
                  Elegir {plan.label}
                </Link>
              ) : (
                <LinkButton href="/register" variant="primary" className="mt-8 w-full">
                  Elegir {plan.label}
                </LinkButton>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
