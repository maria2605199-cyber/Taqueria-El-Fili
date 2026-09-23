import Link from "next/link";
import {
  Sparkles,
  QrCode,
  MessageCircle,
  BarChart3,
  Wand2,
  Nfc,
  ArrowRight,
  Check,
  Store,
} from "lucide-react";
import { PLAN_PRICING } from "@/lib/plans";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Buscador con IA",
    desc: '"Muéstrame algo para 4 personas menor a $300" — la IA entiende y responde con productos reales de tu catálogo.',
  },
  {
    icon: MessageCircle,
    title: "Asistente conversacional",
    desc: "Un asistente flotante que conversa con tus clientes y solo recomienda lo que realmente tienes disponible.",
  },
  {
    icon: Wand2,
    title: "Crea productos con IA",
    desc: "Escribe solo el nombre. La IA genera descripción, características, etiquetas y preguntas frecuentes.",
  },
  {
    icon: QrCode,
    title: "QR único por negocio",
    desc: "Cada negocio obtiene un enlace y código QR propio, listo para imprimir en mesas, vitrinas o tarjetas.",
  },
  {
    icon: Nfc,
    title: "Etiquetas NFC",
    desc: "Programa una etiqueta NFC con tu enlace: tus clientes acercan el teléfono y abren tu catálogo al instante.",
  },
  {
    icon: BarChart3,
    title: "Estadísticas en vivo",
    desc: "Consultas a la IA, productos más vistos y clics a WhatsApp — todo medido para que tomes mejores decisiones.",
  },
];

const FLOW = [
  "Crea tu cuenta",
  "Crea tu negocio",
  "Agrega productos",
  "La IA genera descripciones",
  "Publica tu catálogo",
  "Genera tu QR",
  "Programa tu NFC",
  "Comparte y vende",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-ink-950 text-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            Catálogo Inteligente IA
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="hover:text-white">Funciones</a>
            <a href="#como-funciona" className="hover:text-white">Cómo funciona</a>
            <a href="#precios" className="hover:text-white">Precios</a>
            <a href="#demo" className="hover:text-white">Demo</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-white/70 hover:text-white sm:block">
              Iniciar sesión
            </Link>
            <Link href="/register">
              <Button size="sm">Empezar gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-grid-glow px-5 pb-24 pt-20 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            Catálogos digitales potenciados con IA
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl animate-fade-up [animation-delay:80ms]">
            El catálogo digital
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-teal-300 bg-clip-text text-transparent"> inteligente </span>
            para tu negocio
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-white/60 animate-fade-up [animation-delay:140ms]">
            Sube tus productos, deja que la IA los presente y responda a tus clientes, y comparte tu catálogo con un QR o una etiqueta NFC. Sin apps que instalar, sin fricciones.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up [animation-delay:200ms]">
            <Link href="/register">
              <Button size="lg" className="group">
                Crear mi catálogo gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/taqueria-el-fili">
              <Button size="lg" variant="outline" className="border-white/15 text-white hover:bg-white/10">
                <Store className="h-4 w-4" />
                Ver catálogo demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl animate-fade-up [animation-delay:260ms]">
          <div className="glass-dark rounded-3xl p-2 shadow-2xl">
            <div className="rounded-2xl bg-gradient-to-br from-ink-800 to-ink-900 p-8 sm:p-12">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {["Tacos", "Especialidades", "Bebidas", "Postres"].map((c, i) => (
                  <div
                    key={c}
                    className="animate-float rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/70"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 bg-ink-900 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Todo lo que necesita tu negocio</h2>
            <p className="mt-4 text-white/60">
              Una plataforma SaaS completa: catálogo, IA, estadísticas y automatización, lista para restaurantes, tiendas, cafeterías, barberías y boutiques.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-brand-500/30 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 transition group-hover:bg-brand-500/25">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="border-t border-white/5 px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">De cero a vendiendo en minutos</h2>
            <p className="mt-4 text-white/60">Así de simple es el flujo para el dueño del negocio.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FLOW.map((step, i) => (
              <div key={step} className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-300">
                  {i + 1}
                </div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="border-t border-white/5 bg-ink-900 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Planes para cada etapa</h2>
            <p className="mt-4 text-white/60">Empieza gratis y crece con IA avanzada cuando lo necesites.</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {(Object.keys(PLAN_PRICING) as Array<keyof typeof PLAN_PRICING>).map((key) => {
              const plan = PLAN_PRICING[key];
              const featured = key === "PRO";
              return (
                <div
                  key={key}
                  className={`relative rounded-3xl border p-8 ${
                    featured
                      ? "border-brand-500/50 bg-gradient-to-b from-brand-500/10 to-transparent shadow-glow"
                      : "border-white/8 bg-white/[0.03]"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold">
                      Más popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold capitalize">{key.toLowerCase()}</h3>
                  <p className="mt-1 text-3xl font-bold">{plan.price}</p>
                  <p className="mt-2 text-sm text-white/55">{plan.tagline}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="mt-8 block">
                    <Button className="w-full" variant={featured ? "primary" : "outline"}>
                      Elegir {key.toLowerCase()}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section id="demo" className="border-t border-white/5 px-5 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/15 to-transparent p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Explora un catálogo real</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Visita la demo de Taquería El Fili y prueba el buscador con IA, el asistente conversacional y el botón de WhatsApp.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/taqueria-el-fili">
              <Button size="lg">
                <Store className="h-4 w-4" />
                Abrir catálogo demo
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white/15 text-white hover:bg-white/10">
                Crear mi negocio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-5 py-10 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Catálogo Inteligente IA — Plataforma SaaS multi-negocio.
      </footer>
    </main>
  );
}
