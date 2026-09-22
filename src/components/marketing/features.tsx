import {
  Search,
  Bot,
  ImageIcon,
  QrCode,
  MessageCircle,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Buscador inteligente",
    description: 'Tus clientes preguntan en lenguaje natural: "algo barato" o "para 4 personas".',
  },
  {
    icon: Bot,
    title: "Asistente de IA",
    description: "Recomienda productos reales de tu catálogo, sin inventar precios ni datos.",
  },
  {
    icon: Sparkles,
    title: "Redacción automática",
    description: "Escribe solo el nombre del producto y la IA genera la descripción completa.",
  },
  {
    icon: ImageIcon,
    title: "Fotografía con IA",
    description: "Mejora iluminación, quita el fondo y da una presentación profesional.",
  },
  {
    icon: QrCode,
    title: "QR y NFC",
    description: "Un enlace único por negocio, con código QR y etiquetas NFC listas para usar.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp integrado",
    description: "Cada producto abre WhatsApp con un mensaje automático y personalizado.",
  },
  {
    icon: LayoutDashboard,
    title: "Panel de administración",
    description: "Agrega, edita y organiza productos, categorías y estadísticas en un solo lugar.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-negocio seguro",
    description: "Cada negocio tiene su propio catálogo y datos, completamente aislados.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Todo lo que necesita tu negocio</h2>
        <p className="mt-3 text-foreground/60">
          Una plataforma completa, pensada para restaurantes, tiendas, cafeterías, barberías y
          boutiques.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="glass-card rounded-2xl p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl gradient-bg text-white">
              <f.icon size={20} />
            </div>
            <h3 className="mb-1.5 font-semibold">{f.title}</h3>
            <p className="text-sm text-foreground/60">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
