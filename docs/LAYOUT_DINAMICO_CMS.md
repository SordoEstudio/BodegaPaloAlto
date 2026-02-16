# Layout dinámico CMS – Uso y extensión

## Resumen

El sitio puede mostrar la **Home** con bloques definidos por una API CMS (layout dinámico) o con el contenido estático de los JSON en `src/data/`. Se usa el módulo `src/portable-dynamic-cms/` y APIs mock en `app/api/public/v1/`.

## Cómo activar el layout dinámico en Home

1. Definir la variable de entorno:
   ```bash
   NEXT_PUBLIC_USE_CMS_LAYOUT=true
   ```
2. Con el dev server en marcha (`pnpm run dev`), la ruta `/es` o `/en` cargará los componentes desde `/api/public/v1/cms-components` y los mostrará en el orden definido por la API.

Si la variable **no** está definida o es distinta de `"true"`, la Home usa siempre el contenido estático (hero, carousel, banners, productos destacados desde `src/data/.../home/`).

## APIs mock

- **GET** `/api/public/v1/client-config?host=...`  
  Devuelve la configuración del cliente (marca, colores, SEO). Por defecto usa `getDefaultConfig()` (Bodega Palo Alto).

- **GET** `/api/public/v1/cms-components`  
  Devuelve `{ success, data: { components, client } }`. Los `components` tienen `type`, `page: "Inicio"`, `data` (contenido del bloque) y `_orden` / `isVisible`. El mock actual lee los JSON de `src/data/es/home/` (hero, carousel-lineas, banner-1, banner-2, productos-destacados).

## Cómo extender a otras páginas

1. **Mapeo de tipos CMS → componentes**
   - En `src/lib/cms-layout-map.tsx`:
     - Añadir entradas en `cmsTypeToLayoutName` (ej. `otra_seccion: "otra-seccion"`).
     - Añadir un wrapper en `componentMap` que reciba `DynamicLayoutComponentProps` y renderice tu componente con `props.data` tipado correctamente.
     - En `getHomeComponentProps` (o una función equivalente para la nueva página) mapear `cmsComponent.data` al tipo que espera tu componente (reutilizando mappers de `src/lib/data.ts` si aplica).

2. **Nueva página con DynamicLayout**
   - Crear un componente cliente que use `<DynamicLayout pageType="NombreDePagina" cmsTypeToLayoutName={...} componentMap={...} getComponentProps={...} />`.
   - En la página (Server Component), decidir por variable de entorno o por respuesta de API si renderizas ese cliente o el contenido estático, y pasar el contenido estático como fallback (children).

3. **Backend real**
   - Sustituir los route handlers en `app/api/public/v1/` por llamadas a tu backend (por ejemplo con `NEXT_PUBLIC_API_URL`). El módulo `portable-dynamic-cms` ya usa `getClientConfig(hostname, serverOrigin)` y `buildApiUrl()` para resolver la base de la API.

## Estructura relevante

| Ruta | Descripción |
|------|-------------|
| `src/portable-dynamic-cms/` | Módulo: tipos, config, hooks, `ClientConfigProvider`, `DynamicLayout`. |
| `src/lib/cms-layout-map.tsx` | Mapeo `cmsTypeToLayoutName`, `componentMap`, `getHomeComponentProps` para la Home. |
| `src/components/home/HomePageWithCMS.tsx` | Envuelve la Home: si `useCmsLayout` es true renderiza `DynamicLayout`, si no, los children (contenido estático). |
| `src/app/[locale]/page.tsx` | Home: usa `HomePageWithCMS` y pasa `useCmsLayout={NEXT_PUBLIC_USE_CMS_LAYOUT === "true"}`. |
| `src/app/layout.tsx` | Layout raíz: obtiene `host`, llama a `getClientConfig(host, serverOrigin)` y envuelve la app con `ClientConfigProvider`. |

## Verificación rápida

- Sin `NEXT_PUBLIC_USE_CMS_LAYOUT`: la Home se ve igual que antes (contenido estático).
- Con `NEXT_PUBLIC_USE_CMS_LAYOUT=true`: la Home se construye con los componentes devueltos por `/api/public/v1/cms-components` (mock con los mismos datos que los JSON de la home).
- Si la API de componentes falla o devuelve vacío para la página Inicio, la Home hace fallback al contenido estático (children).