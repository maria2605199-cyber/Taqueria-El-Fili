import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const HOURS = [
  { day: "Lunes", open: "10:00", close: "22:00" },
  { day: "Martes", open: "10:00", close: "22:00" },
  { day: "Miércoles", open: "10:00", close: "22:00" },
  { day: "Jueves", open: "10:00", close: "22:00" },
  { day: "Viernes", open: "10:00", close: "23:30" },
  { day: "Sábado", open: "11:00", close: "23:30" },
  { day: "Domingo", open: "12:00", close: "20:00", closed: false },
];

const SOCIALS = { instagram: "taqueriaelfili", facebook: "taqueriaelfili", tiktok: "taqueriaelfili" };

// Usamos SVGs locales en /public/demo en vez de un servicio externo de
// imágenes: así la demo funciona sin depender de un tercero y nunca
// genera errores de red. Un negocio real sube su propia fotografía por URL.
const CATEGORY_IMAGE: Record<string, string> = {
  Tacos: "/demo/tacos.svg",
  Tortas: "/demo/tortas.svg",
  Bebidas: "/demo/bebidas.svg",
  Postres: "/demo/postres.svg",
};

async function main() {
  console.log("Sembrando datos de demostración...");

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const owner = await prisma.user.upsert({
    where: { email: "demo@taqueriaelfili.com" },
    update: {},
    create: {
      name: "Fili (dueño demo)",
      email: "demo@taqueriaelfili.com",
      passwordHash,
    },
  });

  const businessData = {
    name: "Taquería El Fili",
    description: "Tacos, tortas y antojitos mexicanos hechos al momento, con más de 20 años de tradición.",
    logoUrl: "/demo/logo.svg",
    whatsapp: "5215512345678",
    address: "Av. Revolución 245, Col. Centro",
    city: "Guadalajara, Jalisco",
    hours: JSON.stringify(HOURS),
    socials: JSON.stringify(SOCIALS),
    plan: "PRO" as const,
  };

  const business = await prisma.business.upsert({
    where: { slug: "taqueria-el-fili" },
    update: businessData,
    create: { ownerId: owner.id, slug: "taqueria-el-fili", ...businessData },
  });

  const categoryNames = ["Tacos", "Tortas", "Bebidas", "Postres"];
  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { businessId_name: { businessId: business.id, name } },
      update: {},
      create: { businessId: business.id, name },
    });
    categories[name] = category.id;
  }

  await prisma.analyticsEvent.deleteMany({ where: { businessId: business.id } });
  await prisma.product.deleteMany({ where: { businessId: business.id } });

  const products = [
    {
      name: "Taco al pastor",
      price: 18,
      category: "Tacos",
      featured: true,
      shortDescription: "El clásico: cerdo marinado, piña, cebolla y cilantro.",
      description:
        "Nuestro taco insignia: carne de cerdo marinada en adobo de chiles y especias, cocinada en trompo, servida con piña asada, cebolla y cilantro frescos sobre tortilla de maíz recién hecha.",
      tags: ["popular", "picante", "clasico"],
      variants: [{ name: "Cantidad", options: ["1 taco", "Orden de 4", "Orden de 8"] }],
      faqs: [
        { q: "¿Es muy picante?", a: "El adobo tiene un picor moderado; puedes pedirlo sin salsa si prefieres." },
        { q: "¿Tienen opción sin piña?", a: "Sí, puedes pedirlo sin piña al hacer tu pedido por WhatsApp." },
      ],
      viewCount: 128,
      whatsappClicks: 34,
    },
    {
      name: "Taco de bistec",
      price: 20,
      category: "Tacos",
      featured: true,
      shortDescription: "Bistec de res a la plancha con cebolla asada.",
      description: "Bistec de res finamente picado, cocinado a la plancha con cebolla, acompañado de cilantro y limón.",
      tags: ["res", "popular"],
      variants: [{ name: "Cantidad", options: ["1 taco", "Orden de 4"] }],
      faqs: [{ q: "¿Con queso?", a: "Puedes agregar queso extra por un costo adicional." }],
      viewCount: 96,
      whatsappClicks: 21,
    },
    {
      name: "Taco de canasta",
      price: 15,
      category: "Tacos",
      featured: false,
      shortDescription: "Suave y jugoso, al estilo tradicional de canasta.",
      description: "Tacos de canasta rellenos de papa con chorizo, frijol o mole, cocidos al vapor para lograr su textura característica.",
      tags: ["economico", "tradicional"],
      variants: [{ name: "Relleno", options: ["Papa con chorizo", "Frijol", "Mole"] }],
      faqs: [],
      viewCount: 54,
      whatsappClicks: 9,
    },
    {
      name: "Torta ahogada",
      price: 65,
      category: "Tortas",
      featured: true,
      shortDescription: "Especialidad tapatía bañada en salsa de chile de árbol.",
      description: "Birote relleno de carnitas, bañado en salsa de jitomate y salsa picante de chile de árbol al gusto. Un clásico de Guadalajara.",
      tags: ["picante", "especialidad", "para compartir"],
      variants: [{ name: "Picor", options: ["Suave", "Media", "Bien ahogada"] }],
      faqs: [{ q: "¿Qué tan picante es?", a: "Tú eliges el nivel de salsa; puede ser desde suave hasta muy picante." }],
      viewCount: 87,
      whatsappClicks: 25,
    },
    {
      name: "Torta de milanesa",
      price: 55,
      category: "Tortas",
      featured: false,
      shortDescription: "Milanesa de pollo empanizada con todos los ingredientes.",
      description: "Pechuga de pollo empanizada, con aguacate, jitomate, cebolla, frijoles refritos y mayonesa en pan telera tostado.",
      tags: ["clasico"],
      variants: [{ name: "Proteína", options: ["Pollo", "Res"] }],
      faqs: [],
      viewCount: 41,
      whatsappClicks: 7,
    },
    {
      name: "Quesadilla de flor de calabaza",
      price: 25,
      category: "Tacos",
      featured: false,
      shortDescription: "Con queso oaxaca y flor de calabaza salteada.",
      description: "Tortilla hecha a mano rellena de queso oaxaca fundido y flor de calabaza salteada con epazote.",
      tags: ["vegetariano"],
      variants: [],
      faqs: [{ q: "¿Es apta para vegetarianos?", a: "Sí, no lleva ningún tipo de carne." }],
      viewCount: 33,
      whatsappClicks: 5,
    },
    {
      name: "Agua de horchata",
      price: 20,
      category: "Bebidas",
      featured: false,
      shortDescription: "Refrescante agua de horchata preparada al momento.",
      description: "Agua fresca de horchata con canela, preparada diariamente en la taquería.",
      tags: ["refrescante", "economico"],
      variants: [{ name: "Tamaño", options: ["Chica", "Grande", "Litro"] }],
      faqs: [],
      viewCount: 29,
      whatsappClicks: 3,
    },
    {
      name: "Refresco de vidrio",
      price: 22,
      category: "Bebidas",
      featured: false,
      shortDescription: "Refrescos de vidrio bien fríos.",
      description: "Variedad de refrescos en presentación de vidrio, servidos bien fríos.",
      tags: ["economico"],
      variants: [{ name: "Sabor", options: ["Cola", "Toronja", "Manzana"] }],
      faqs: [],
      viewCount: 18,
      whatsappClicks: 2,
    },
    {
      name: "Flan napolitano",
      price: 35,
      category: "Postres",
      featured: false,
      shortDescription: "Cremoso flan casero bañado en caramelo.",
      description: "Postre tradicional mexicano preparado en casa, con textura suave y bañado en caramelo.",
      tags: ["dulce", "casero"],
      variants: [],
      faqs: [],
      viewCount: 22,
      whatsappClicks: 4,
    },
    {
      name: "Churros con cajeta",
      price: 40,
      category: "Postres",
      featured: true,
      shortDescription: "Churros crujientes bañados en cajeta.",
      description: "Churros recién hechos, espolvoreados con azúcar y canela, bañados con cajeta artesanal.",
      tags: ["dulce", "popular", "para compartir"],
      variants: [{ name: "Cantidad", options: ["4 piezas", "8 piezas"] }],
      faqs: [],
      viewCount: 61,
      whatsappClicks: 14,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: categories[p.category],
        name: p.name,
        price: p.price,
        featured: p.featured,
        available: true,
        shortDescription: p.shortDescription,
        description: p.description,
        tags: JSON.stringify(p.tags),
        variants: JSON.stringify(p.variants),
        faqs: JSON.stringify(p.faqs),
        imageUrl: CATEGORY_IMAGE[p.category],
        viewCount: p.viewCount,
        whatsappClicks: p.whatsappClicks,
      },
    });
  }

  const sampleQueries = [
    "quiero algo barato",
    "que tienes para una cena de 4 personas",
    "muestrame productos menores de 30 pesos",
    "cual es el producto mas vendido",
    "busco algo para regalarle a mi esposa",
    "tienen algo picante",
  ];

  for (let i = 0; i < 25; i++) {
    await prisma.analyticsEvent.create({
      data: {
        businessId: business.id,
        type: "CATALOG_VIEW",
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 6),
      },
    });
  }

  for (const query of sampleQueries) {
    await prisma.analyticsEvent.create({
      data: { businessId: business.id, type: "AI_QUERY", query },
    });
  }

  console.log("Listo. Cuenta demo: demo@taqueriaelfili.com / demo1234");
  console.log(`Catálogo público: /negocio/${business.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
