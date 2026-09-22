# Catálogo Inteligente IA

Plataforma SaaS multi-negocio de catálogos digitales con IA: buscador inteligente, asistente conversacional, generación automática de fichas de producto, QR/NFC y estadísticas — construida con Next.js (App Router), TypeScript, Tailwind CSS y Prisma.

## Stack

- **Frontend/Backend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Base de datos:** Prisma ORM + SQLite en desarrollo (cambia `DATABASE_URL` a Postgres en producción sin tocar el código)
- **Auth:** NextAuth (credenciales + JWT), multi-tenant por `businessId`
- **IA:** capa de razonamiento local (determinista, sin dependencias) + integración opcional con OpenAI. Sin `OPENAI_API_KEY` configurada, el buscador y el asistente funcionan igual usando el motor local — nunca inventan productos, precios o disponibilidad.
- **QR:** generado en servidor con `qrcode`
- **WhatsApp:** enlaces `wa.me` con mensaje prellenado, sin SDK ni credenciales

## Primeros pasos

```bash
npm install
cp .env.example .env        # ajusta NEXTAUTH_SECRET
npm run db:push             # crea el esquema en SQLite
npm run db:seed             # datos de demostración (2 negocios)
npm run dev
```

Abre `http://localhost:3000`.

## Cuentas de demostración

| Negocio | URL del catálogo | Correo admin | Contraseña |
|---|---|---|---|
| Taquería El Fili (plan Premium) | `/taqueria-el-fili` | admin@elfili.com | elfili2024 |
| Barbería Moderna (plan Pro) | `/barberia-moderna` | admin@barberiamoderna.com | barberia2024 |

Cada negocio tiene su propio catálogo, productos, estadísticas y administrador — un negocio nunca puede ver ni modificar los datos de otro (aislamiento verificado en cada consulta a la base de datos por `businessId`).

## Estructura

```
prisma/schema.prisma        modelo de datos multi-tenant
src/app/page.tsx            landing page
src/app/login, /register    autenticación
src/app/[negocio]           catálogo público (SSR + cliente interactivo)
src/app/admin/*             panel administrador (protegido por middleware)
src/app/api/admin/*         API del panel (siempre valida sesión + businessId)
src/app/api/public/*        API pública del catálogo (búsqueda IA, asistente, tracking)
src/lib/ai/*                motor de búsqueda/asistente/generador, con fallback local
src/lib/plans.ts            tabla de features por plan (Básico / Pro / Premium)
src/components/catalog/*    UI del catálogo público
src/components/admin/*      UI del panel administrador
```

## Planes y features

La app ya está preparada para monetización por suscripción (`src/lib/plans.ts`): cada feature (asistente IA, buscador IA, generador de productos, estadísticas, IA de imágenes) se activa según `Business.plan`. Falta conectar un proveedor de pagos (Stripe u otro) para cobrar automáticamente — el campo `plan` puede actualizarse manualmente en base de datos mientras tanto.

## Notas de producción

- Cambia `DATABASE_URL` a Postgres/MySQL y define `NEXTAUTH_SECRET` fuerte.
- Las fotografías se guardan en `public/uploads` en desarrollo; en producción usa un bucket (S3, Cloudinary, etc.) — el endpoint `src/app/api/admin/upload/route.ts` es el único punto a modificar.
- La "IA de imágenes" (`/api/admin/ai/enhance-image`) está preparada en la arquitectura pero requiere conectar un proveedor real de generación/edición de imágenes; hoy devuelve la imagen original de forma transparente, sin fingir un resultado.
- Configura `OPENAI_API_KEY` para respuestas de IA más naturales; sin ella, el motor local determinista sigue funcionando al 100%.
