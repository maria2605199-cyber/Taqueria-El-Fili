# Catálogo Inteligente IA

Catálogo digital con inteligencia artificial para pequeños y medianos
negocios (restaurantes, tiendas, cafeterías, barberías, boutiques...).
Cada negocio administra su propio catálogo, productos, QR/NFC y
estadísticas, con datos completamente aislados entre negocios
(multi-tenant).

## Stack

- **Frontend/Backend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Base de datos:** Prisma + SQLite en desarrollo (cambia a Postgres/MySQL en producción solo editando `DATABASE_URL` y el `provider` en `prisma/schema.prisma`)
- **Autenticación:** NextAuth (credenciales, JWT)
- **IA:** motor local basado en reglas (búsqueda, asistente y redacción de productos) que solo usa datos reales del catálogo — nunca inventa precios ni disponibilidad. Si se configura `OPENAI_API_KEY`, se usa el modelo real como capa adicional, con el motor local como respaldo automático.
- **QR:** generado on-demand con la librería `qrcode`
- **WhatsApp:** enlaces `wa.me` con mensaje precompuesto por producto

## Primeros pasos

```bash
npm install
cp .env.example .env   # ajusta valores si hace falta
npm run db:push        # crea el esquema en SQLite
npm run db:seed        # crea el negocio demo "Taquería El Fili"
npm run dev
```

Abre `http://localhost:3000`.

- **Panel administrador demo:** `demo@taqueriaelfili.com` / `demo1234`
- **Catálogo público demo:** `/negocio/taqueria-el-fili`

## Estructura

- `src/app` — rutas (landing, auth, `/dashboard/*`, `/negocio/[slug]`, API routes)
- `src/components` — UI reutilizable (`ui/`, `catalog/`, `dashboard/`, `marketing/`)
- `src/lib` — Prisma client, autenticación, utilidades, motor de IA (`lib/ai`)
- `prisma/schema.prisma` — modelo de datos multi-tenant
- `prisma/seed.ts` — datos de demostración

## Seguridad y multi-tenant

- Toda consulta/mutación del panel se resuelve a partir del negocio del
  usuario autenticado (`lib/current-business.ts`), nunca de un id recibido
  del cliente.
- Las API keys (ej. `OPENAI_API_KEY`) solo se leen en el servidor.
- Las rutas `/dashboard/*` están protegidas por `src/proxy.ts`.
