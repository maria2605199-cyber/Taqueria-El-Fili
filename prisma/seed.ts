import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertBusiness(input: {
  slug: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
  primaryColor: string;
  plan: "BASICO" | "PRO" | "PREMIUM";
  logoUrl: string;
  coverUrl: string;
  ownerEmail: string;
  ownerName: string;
  ownerPassword: string;
  categories: string[];
  products: Array<{
    name: string;
    category: string;
    price: number;
    compareAtPrice?: number;
    shortDescription: string;
    description: string;
    features: string[];
    tags: string[];
    faqs: { q: string; a: string }[];
    imageUrl: string;
    featured?: boolean;
    available?: boolean;
    variants?: { name: string; options: string[] }[];
  }>;
}) {
  const business = await prisma.business.upsert({
    where: { slug: input.slug },
    update: {},
    create: {
      slug: input.slug,
      name: input.name,
      description: input.description,
      phone: input.phone,
      address: input.address,
      hours: input.hours,
      instagram: input.instagram,
      facebook: input.facebook,
      primaryColor: input.primaryColor,
      plan: input.plan,
      logoUrl: input.logoUrl,
      coverUrl: input.coverUrl,
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(input.address)}`,
    },
  });

  const passwordHash = await bcrypt.hash(input.ownerPassword, 10);
  await prisma.user.upsert({
    where: { email: input.ownerEmail },
    update: {},
    create: {
      email: input.ownerEmail,
      name: input.ownerName,
      passwordHash,
      role: "OWNER",
      businessId: business.id,
    },
  });

  const categoryMap = new Map<string, string>();
  for (const name of input.categories) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const cat = await prisma.category.upsert({
      where: { businessId_slug: { businessId: business.id, slug } },
      update: {},
      create: { name, slug, businessId: business.id },
    });
    categoryMap.set(name, cat.id);
  }

  const existingProducts = await prisma.product.count({ where: { businessId: business.id } });
  if (existingProducts === 0) {
    for (const p of input.products) {
      await prisma.product.create({
        data: {
          businessId: business.id,
          categoryId: categoryMap.get(p.category),
          name: p.name,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          shortDescription: p.shortDescription,
          description: p.description,
          features: JSON.stringify(p.features),
          tags: JSON.stringify(p.tags),
          faqs: JSON.stringify(p.faqs),
          imageUrl: p.imageUrl,
          images: JSON.stringify([p.imageUrl]),
          variants: p.variants ? JSON.stringify(p.variants) : null,
          featured: p.featured ?? false,
          available: p.available ?? true,
          active: true,
        },
      });
    }
  }

  return business;
}

async function main() {
  await upsertBusiness({
    slug: "taqueria-el-fili",
    name: "Taquería El Fili",
    description: "Tacos y antojitos mexicanos desde 1998. Sabor de barrio, calidad premium.",
    phone: "5215512345678",
    address: "Av. Insurgentes Sur 1234, CDMX",
    hours: "Lun-Sáb 13:00-23:00, Dom 13:00-20:00",
    instagram: "https://instagram.com/taqueriaelfili",
    facebook: "https://facebook.com/taqueriaelfili",
    primaryColor: "#e11d48",
    plan: "PREMIUM",
    logoUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=ElFili&backgroundColor=e11d48",
    coverUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1600&q=80",
    ownerEmail: "admin@elfili.com",
    ownerName: "Fili Hernández",
    ownerPassword: "elfili2024",
    categories: ["Tacos", "Especialidades", "Bebidas", "Postres"],
    products: [
      {
        name: "Taco de Pastor",
        category: "Tacos",
        price: 25,
        shortDescription: "El clásico: cerdo marinado al trompo con piña.",
        description:
          "Nuestro taco insignia: cerdo marinado por 24 horas en adobo de chiles secos, cocinado lentamente al trompo y coronado con piña asada, cebolla y cilantro frescos.",
        features: ["Trompo tradicional", "Piña asada", "Tortilla hecha a mano"],
        tags: ["popular", "picante suave", "clásico"],
        faqs: [
          { q: "¿Es picante?", a: "Nivel de picor suave-medio, puedes pedirlo sin salsa." },
          { q: "¿Tiene cerdo?", a: "Sí, es carne de cerdo marinada." },
        ],
        imageUrl: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&q=80",
        featured: true,
        variants: [{ name: "Cantidad", options: ["1 taco", "Orden de 4", "Orden de 8"] }],
      },
      {
        name: "Taco de Suadero",
        category: "Tacos",
        price: 22,
        shortDescription: "Carne de res suave cocida a fuego lento.",
        description: "Suadero de res cocido por horas hasta quedar suave, dorado al comal y servido con salsa verde.",
        features: ["Carne de res", "Cocción lenta", "Salsa verde de la casa"],
        tags: ["económico", "carne de res"],
        faqs: [{ q: "¿Qué salsa lleva?", a: "Se sirve con salsa verde; puedes pedir roja o ambas." }],
        imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
        featured: false,
        variants: [{ name: "Cantidad", options: ["1 taco", "Orden de 4", "Orden de 8"] }],
      },
      {
        name: "Taco de Bistec",
        category: "Tacos",
        price: 24,
        shortDescription: "Bistec de res a la plancha con cebollitas.",
        description: "Bistec de res cortado finamente, cocinado a la plancha con cebollitas cambray asadas.",
        features: ["A la plancha", "Cebollitas asadas"],
        tags: ["carne de res"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800&q=80",
        variants: [{ name: "Cantidad", options: ["1 taco", "Orden de 4", "Orden de 8"] }],
      },
      {
        name: "Vampiro de Pastor",
        category: "Especialidades",
        price: 32,
        shortDescription: "Tortilla crujiente con queso gratinado y pastor.",
        description: "Tortilla de maíz frita hasta quedar crujiente, cubierta con queso gratinado y generosa porción de pastor.",
        features: ["Tortilla crujiente", "Queso gratinado", "Doble ración de pastor"],
        tags: ["para compartir", "queso"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80",
        featured: true,
      },
      {
        name: "Gringa de Pastor",
        category: "Especialidades",
        price: 45,
        compareAtPrice: 52,
        shortDescription: "Tortilla de harina, queso derretido y pastor.",
        description: "Dos tortillas de harina rellenas de queso Oaxaca derretido y pastor jugoso, doradas a la plancha.",
        features: ["Tortilla de harina", "Queso Oaxaca", "Ideal para 1-2 personas"],
        tags: ["popular", "para compartir"],
        faqs: [{ q: "¿Cuántas personas alcanza?", a: "Rinde para 1 persona con hambre o 2 como entrada." }],
        imageUrl: "https://images.unsplash.com/photo-1611250188496-e966043a0629?w=800&q=80",
        featured: true,
      },
      {
        name: "Quesadilla de Flor de Calabaza",
        category: "Especialidades",
        price: 38,
        shortDescription: "Quesadilla vegetariana con flor de calabaza y queso.",
        description: "Tortilla hecha a mano rellena de flor de calabaza salteada, epazote y queso Oaxaca derretido.",
        features: ["Vegetariano", "Hecha a mano", "Queso Oaxaca"],
        tags: ["vegetariano", "sin carne"],
        faqs: [{ q: "¿Es vegetariana?", a: "Sí, 100% vegetariana." }],
        imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
        available: true,
      },
      {
        name: "Agua de Jamaica",
        category: "Bebidas",
        price: 20,
        shortDescription: "Agua fresca de jamaica natural, 500ml.",
        description: "Preparada diariamente con flor de jamaica natural, endulzada al gusto.",
        features: ["Natural", "500ml", "Sin conservadores"],
        tags: ["bebida", "económico", "refrescante"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1620705207893-e75d1e3a1e2b?w=800&q=80",
      },
      {
        name: "Horchata",
        category: "Bebidas",
        price: 20,
        shortDescription: "Agua de horchata cremosa con canela.",
        description: "Receta tradicional con arroz, canela y un toque de vainilla.",
        features: ["Cremosa", "500ml"],
        tags: ["bebida", "económico"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&q=80",
      },
      {
        name: "Refresco",
        category: "Bebidas",
        price: 25,
        shortDescription: "Refresco de lata 355ml, varios sabores.",
        description: "Disponible en cola, naranja y toronja.",
        features: ["Lata 355ml"],
        tags: ["bebida", "económico"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80",
        variants: [{ name: "Sabor", options: ["Cola", "Naranja", "Toronja"] }],
      },
      {
        name: "Churros con Cajeta",
        category: "Postres",
        price: 35,
        shortDescription: "Churros crujientes bañados en cajeta.",
        description: "Churros recién hechos, espolvoreados con azúcar y canela, bañados en cajeta artesanal.",
        features: ["Recién hechos", "Cajeta artesanal"],
        tags: ["dulce", "para compartir"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1624371414361-e670edf4698d?w=800&q=80",
        featured: true,
      },
      {
        name: "Flan Napolitano",
        category: "Postres",
        price: 30,
        shortDescription: "Flan casero cremoso con caramelo.",
        description: "Receta familiar horneada diariamente, textura suave y cremosa con caramelo natural.",
        features: ["Casero", "Receta familiar"],
        tags: ["dulce"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
        available: false,
      },
      {
        name: "Torta de Pastor",
        category: "Especialidades",
        price: 55,
        shortDescription: "Torta grande de pastor con todos los ingredientes.",
        description: "Pan telera horneado con pastor, frijoles refritos, aguacate, queso, lechuga y jitomate.",
        features: ["Pan telera", "Ración generosa"],
        tags: ["comida completa"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=800&q=80",
      },
    ],
  });

  // Second demo tenant to prove multi-tenant data isolation in the UI/admin.
  await upsertBusiness({
    slug: "barberia-moderna",
    name: "Barbería Moderna",
    description: "Cortes, barba y estilo con técnica moderna y atención premium.",
    phone: "5215587654321",
    address: "Calle Reforma 88, CDMX",
    hours: "Mar-Dom 10:00-20:00",
    instagram: "https://instagram.com/barberiamoderna",
    facebook: "https://facebook.com/barberiamoderna",
    primaryColor: "#0ea5e9",
    plan: "PRO",
    logoUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Barberia&backgroundColor=0ea5e9",
    coverUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80",
    ownerEmail: "admin@barberiamoderna.com",
    ownerName: "Carlos Ruiz",
    ownerPassword: "barberia2024",
    categories: ["Cortes", "Barba", "Combos"],
    products: [
      {
        name: "Corte Clásico",
        category: "Cortes",
        price: 150,
        shortDescription: "Corte a tijera y máquina, acabado clásico.",
        description: "Corte personalizado con tijera y máquina, incluye lavado y peinado final.",
        features: ["Lavado incluido", "Peinado final"],
        tags: ["popular"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
        featured: true,
      },
      {
        name: "Arreglo de Barba",
        category: "Barba",
        price: 120,
        shortDescription: "Perfilado y arreglo de barba con navaja.",
        description: "Perfilado profesional con navaja, toalla caliente y aceite hidratante.",
        features: ["Navaja tradicional", "Toalla caliente"],
        tags: ["relajante"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
      },
      {
        name: "Combo Corte + Barba",
        category: "Combos",
        price: 240,
        compareAtPrice: 270,
        shortDescription: "El paquete completo: corte y barba.",
        description: "Nuestro servicio más completo: corte a tu estilo, arreglo de barba y bebida de cortesía.",
        features: ["Ahorra $30", "Bebida de cortesía"],
        tags: ["popular", "mejor precio"],
        faqs: [],
        imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
        featured: true,
      },
    ],
  });

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
