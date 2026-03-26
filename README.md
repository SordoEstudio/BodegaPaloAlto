# Bodega Palo Alto — Sitio Web

Sitio web oficial de Bodega Palo Alto y Destilería Magic Stone (Mendoza, Argentina). Construido con **Next.js 16 + App Router**, React 19, Tailwind CSS 4 y contenido dinámico desde un CMS propio.

---

## Tabla de contenidos

- [Requisitos](#requisitos)
- [Inicio rápido](#inicio-rápido)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura CMS](#arquitectura-cms)
- [Internacionalización](#internacionalización)
- [Iconos](#iconos)
- [Build y deploy](#build-y-deploy)
- [Checklist pre-publicación](#checklist-pre-publicación)

---

## Requisitos

- **Node.js** 18 o superior
- **pnpm** (`npm install -g pnpm`)

---

## Inicio rápido

```bash
pnpm install
cp .env.example .env.local   # completar variables (ver sección siguiente)
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000). El servidor redirige automáticamente a `/es` (locale por defecto).

---

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar los valores.

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NEXT_PUBLIC_CLIENT_SLUG` | Sí | Identificador del cliente en el CMS (ej: `bodega-palo-alto`) |
| `NEXT_PUBLIC_API_URL` | Sí (prod) | URL base de la API del CMS en producción (ej: `https://cms.example.com/api/public/v1`) |
| `NEXT_PUBLIC_API_DEV` | No | URL de la API en desarrollo. Si se omite, usa proxy local (`/api/public/v1`) |
| `NEXT_PUBLIC_SITE_URL` | Sí (prod) | URL pública del sitio (ej: `https://bodegapaloalto.com`). Usada en sitemap y og:image |
| `NEXT_PUBLIC_USE_CMS_LAYOUT` | Sí | `true` para cargar contenido desde el CMS. `false` usa datos estáticos de fallback |
| `NEXT_PUBLIC_USE_PROXY` | No | `true` para que el detalle de producto use el proxy interno de Next.js en lugar de llamar directo a la API |
| `CONTACT_API_URL` | No | URL alternativa de la API de contacto (uso interno, server-side únicamente) |

### En Vercel

Ir a **Project → Settings → Environment Variables** y agregar las mismas variables (seleccionar los environments: Production, Preview y/o Development según corresponda).

> **Importante:** El dominio de producción debe estar en la lista `domains[]` de la configuración del cliente en el CMS, de lo contrario las llamadas a la API devolverán `403 DOMAIN_NOT_ALLOWED`.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── [locale]/              # Rutas localizadas (es/en)
│   │   ├── page.tsx           # Home
│   │   ├── bodega/            # Página Bodega
│   │   ├── destileria/        # Página Destilería
│   │   ├── productos/         # Listado de productos
│   │   │   └── [slug]/        # Detalle de producto
│   │   ├── contacto/          # Página de contacto
│   │   ├── bienvenida/        # Verificación de edad
│   │   └── politica-de-privacidad/
│   ├── api/public/v1/         # API Routes (proxy al CMS)
│   ├── robots.ts              # robots.txt generado
│   └── sitemap.ts             # sitemap.xml con hreflang
├── components/
│   ├── layout/                # Header, Footer, LayoutClient
│   ├── home/                  # Secciones de la home
│   ├── bodega/                # Secciones de Bodega
│   ├── destileria/            # Secciones de Destilería
│   ├── products/              # Listado, filtros, detalle, card
│   ├── contact/               # Formulario dinámico y sección de contacto
│   ├── promo/                 # Carrusel promocional
│   └── ui/                    # Componentes genéricos (PageSkeleton, Tooltip)
├── hooks/
│   └── usePublicProducts.ts   # Hook con cache en-memoria (2 min)
├── lib/
│   ├── data.ts                # Datos estáticos y mappers CMS
│   ├── i18n.ts                # Utilidades de locale
│   ├── ui-translations.ts     # Strings de UI por locale
│   ├── product-utils.ts       # Filtros y sort de productos
│   ├── cms-type-map.ts        # Mapeo CMS type → layout name (sin deps de componentes)
│   ├── cms-home-map.tsx       # Componentes y mappers del Home (tree-shaking por ruta)
│   ├── cms-bodega-map.tsx     # Componentes y mappers de Bodega
│   ├── cms-destileria-map.tsx # Componentes y mappers de Destilería
│   └── cms-layout-map.tsx     # Re-exporta los tres mapas (backward compat)
├── portable-dynamic-cms/      # Sistema CMS portátil
│   ├── config/                # api-config, client-config
│   ├── contexts/              # CMSComponentsProvider, ClientConfigProvider
│   ├── hooks/                 # useCMSComponents, useCMSCache, usePageCMS
│   └── types/                 # Tipos del CMS
└── types/
    └── sections.ts            # Tipos de datos para todas las secciones
```

---

## Arquitectura CMS

El sitio usa un sistema de **layout dinámico** que renderiza componentes basándose en la configuración del CMS:

1. **`CMSComponentsProvider`** (contexto global) carga los componentes del CMS al iniciar, con cache en `sessionStorage` (5 min TTL).
2. **`DynamicLayout`** recibe un `componentMap` y un `getComponentProps`, consulta el CMS y renderiza los componentes en el orden configurado.
3. Cada página usa su mapa específico (`cms-home-map`, `cms-bodega-map`, `cms-destileria-map`) para garantizar tree-shaking por ruta.
4. Si `NEXT_PUBLIC_USE_CMS_LAYOUT=false`, cada página renderiza contenido estático de fallback desde `lib/data.ts`.

### Cache de datos

| Capa | Estrategia | TTL |
|------|-----------|-----|
| CMS Components | `sessionStorage` | 5 min |
| Form schema | `sessionStorage` | sesión |
| Products list | Cache en-memoria (módulo) | 2 min |
| Product detail | `next: { revalidate: 60 }` | 60 s |
| APIs (CDN Vercel) | `s-maxage` + `stale-while-revalidate` | ver `next.config.ts` |

---

## Internacionalización

El sitio soporta **español (es)** e **inglés (en)** mediante rutas prefijadas:

- `/es/productos` → español (locale por defecto)
- `/en/productos` → inglés

El cambio de idioma mantiene la ruta actual. Los datos del CMS se solicitan con el parámetro `locale`.

Para agregar textos de UI en un nuevo idioma, editar `src/lib/ui-translations.ts` y `src/lib/data.ts`.

---

## Iconos

- **lucide-react** — iconos de utilidad: `import { MapPin, ShoppingBag } from 'lucide-react'`
- **react-icons/fa** — iconos de marca únicamente (Facebook, Instagram, WhatsApp): `import { FaFacebookF } from 'react-icons/fa'`

> Regla: usar `lucide-react` para todo icono que no sea una marca. Los iconos de marca sin equivalente en lucide usan `react-icons/fa`.

---

## Build y deploy

### Local

```bash
pnpm build    # compila para producción
pnpm start    # sirve el build
```

### Vercel (recomendado)

1. Conectar el repositorio en [vercel.com](https://vercel.com).
2. Configurar las variables de entorno en **Settings → Environment Variables**.
3. El build se detecta automáticamente (`next build`).
4. Asegurarse de que el dominio de Vercel esté en `domains[]` del cliente en el CMS.

### Headers de seguridad

Configurados en `next.config.ts`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`

---

## Checklist pre-publicación

### Funcionalidad
- [ ] Todas las páginas cargan sin errores en producción
- [ ] Formulario de contacto envía y muestra confirmación
- [ ] Verificación de edad (`/bienvenida`) redirige correctamente
- [ ] Filtros de productos: aplicar, limpiar, combinaciones
- [ ] Detalle de producto: imágenes, ficha técnica, navegación
- [ ] Cambio de idioma ES ↔ EN en todas las páginas
- [ ] Links del footer y redes sociales correctos
- [ ] Menú mobile: apertura, cierre con tap fuera, navegación

### Entorno y configuración
- [ ] Variables de entorno de producción seteadas en Vercel
- [ ] `NEXT_PUBLIC_USE_CMS_LAYOUT=true` en producción
- [ ] `NEXT_PUBLIC_API_URL` apunta al CMS de producción (no staging)
- [ ] `NEXT_PUBLIC_SITE_URL` con el dominio final (afecta sitemap y og)
- [ ] Dominio de producción en `domains[]` del cliente en el CMS
- [ ] `pnpm build` sin errores ni warnings críticos

### Rendimiento
- [ ] Lighthouse Performance > 80
- [ ] LCP < 2.5s en mobile 4G simulado
- [ ] Sin imágenes sin dimensiones definidas (CLS)

### SEO
- [ ] `<title>` y `<meta description>` únicos por página
- [ ] `/sitemap.xml` accesible y con rutas bilingues
- [ ] `/robots.txt` permite crawlers
- [ ] Open Graph tags en páginas de producto

### Accesibilidad
- [ ] Navegación por teclado funciona en todo el sitio
- [ ] Contraste de texto ≥ 4.5:1 (WCAG AA)
- [ ] Todos los `<img>` con `alt` descriptivo
- [ ] Formulario con `<label>` asociados a inputs

### Seguridad
- [ ] Ningún secret en variables `NEXT_PUBLIC_*`
- [ ] Rate limiting activo en `/api/public/v1/forms/*/submit`
- [ ] CORS configurado para el dominio de producción en el CMS

### Contenido
- [ ] Textos en ES y EN revisados (sin campos vacíos ni claves expuestas)
- [ ] Imágenes finales subidas al CMS (no placeholders de prueba)
- [ ] Datos de contacto correctos (email, teléfono, redes)
- [ ] Política de privacidad actualizada y con fecha vigente
