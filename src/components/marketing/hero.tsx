import { LinkButton } from "@/components/ui/button";
import { Sparkles, Star, MessageCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full gradient-bg opacity-20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:pt-24 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600">
            <Sparkles size={14} /> Con inteligencia artificial integrada
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            El catálogo digital{" "}
            <span className="gradient-text">inteligente</span> para tu negocio
          </h1>
          <p className="mt-5 max-w-lg text-base text-foreground/60 sm:text-lg">
            Sube tus productos, deja que la IA los presente y responda preguntas de tus clientes,
            y comparte tu catálogo con un QR o una etiqueta NFC. Sin apps, sin fricción.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/register" size="lg">
              Crear mi catálogo gratis
            </LinkButton>
            <LinkButton href="/negocio/taqueria-el-fili" variant="secondary" size="lg">
              Ver catálogo demo
            </LinkButton>
          </div>
          <p className="mt-4 text-xs text-foreground/40">
            Sin tarjeta de crédito · Listo en menos de 10 minutos
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="animate-float glass-card rounded-3xl p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl gradient-bg" />
              <div>
                <p className="font-semibold">Taquería El Fili</p>
                <p className="text-xs text-foreground/50">Tacos y antojitos</p>
              </div>
            </div>
            <div className="mb-4 rounded-2xl border border-border-soft p-3">
              <div className="mb-2 h-24 rounded-xl bg-surface-muted" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taco al pastor</span>
                <span className="text-sm font-semibold text-violet-600">$18</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                <Star size={12} className="fill-current" /> Destacado
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-2 text-xs text-violet-700">
              <Sparkles size={14} /> &quot;Quiero algo barato para 2 personas&quot;
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700">
              <MessageCircle size={14} /> Consultar por WhatsApp
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
