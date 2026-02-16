# Plan de implementación: Layout dinámico desde CMS

Rama: **feature/dynamic-layout-cms**.  
Referencia: **portable-dynamic-cms** (INSTRUCTIVO_IA.md, MANUAL_JSON_COMPONENTES_CMS_FORMULARIO_DINAMICO.md).

---

## 1. Resumen del sistema portable-dynamic-cms

- **Client config:** `GET /api/public/v1/client-config?host=<hostname>` → branding, features, SEO (schema Zod en `client-config.ts`).
- **CMS components:** `GET /api/public/v1/cms-components` → lista de componentes con `type`, `page`, `data`, `isVisible`, `_orden`, etc.
- **DynamicLayout:** componente cliente que filtra por `pageType` (ej. "Inicio"), ordena por `_orden`/`order`, y para cada ítem resuelve un componente React vía `cmsTypeToLayoutName` + `componentMap`, inyectando props desde `data` y `_configuracion`.
- El proyecto **no** copia componentes de UI del CMS; define su propio `componentMap` con componentes existentes (HomeHero, HomeBanner, etc.).

---

## 2. Análisis del proyecto actual (Palo Alto Website)

### 2.1 Estructura de rutas

| Ruta | Contenido actual | Fuente de datos |
|------|------------------|-----------------|
| `/` | Redirect a `/${DEFAULT_LOCALE}` | — |
| `/[locale]` | Home | getHomeHeroData, getHomeCarouselLineasData, getHomeBanner1/2, getHomeProductosDestacadosData |
| `/[locale]/bodega` | Quiénes somos, Equipo, Fincas | getBodegaData |
| `/[locale]/destileria` | Hero, StorySplits, TextHighlights, MissionVision, Manifesto | getDestileriaData |
| `/[locale]/contacto` | ContactSplit + ContactPageSection | getContactPageData |
| `/[locale]/bienvenida` | Verificación de edad | getWelcomeData |

Todas las páginas son **Server Components** que cargan datos desde **JSON locales** (`src/data/es/*`, `src/data/en/*`) vía `src/lib/data.ts`.

### 2.2 Componentes por página (candidatos a CMS)

**Home (`[locale]/page.tsx`):**

- `HomeHero` — hero con slides, logo, título, subtítulo.
- `HomeCarouselLineas` — líneas (Benito A., Palo Alto, Yllum, etc.).
- `HomeBanner` (x2) — banners con imagen de fondo y CTA.
- `HomeProductosDestacados` — productos destacados.

**Resto de páginas:** por ahora se dejan con datos estáticos (JSON); en una fase posterior se puede plantear Bodega/Destilería/Contacto como páginas dinámicas si el CMS lo soporta.

### 2.3 Convención de datos actual

- Textos: `txt_*`, `txt_*_optional`.
- Imágenes: `img_*_optional`, `imageSrc`, `backgroundImage`.
- Listas: `lista_*` (ej. `lista_slides`, `lista_equipo`).
- Config oculta: `_configuracion` en varios JSON.

Esto está alineado con el manual de componentes CMS (prefijos `txt_`, `img_`, `lista_*`, `_configuracion`).

---

## 3. Decisiones de diseño

### 3.1 Alcance inicial

- **Solo Home** usará layout dinámico vía CMS.
- Si no hay API o falla la petición, **fallback** al comportamiento actual (getHomeHeroData, etc. por locale).
- **Locale:** el CMS puede devolver componentes por página; se usará `page_filter` o convención de `page` (ej. "Inicio" para ES, "Home" para EN) o un único set de componentes y traducir en front con `locale` en props).

### 3.2 Backend

- **Opción A (recomendada para prueba):** Mock de API en Next.js (route handlers `app/api/public/v1/client-config/route.ts` y `app/api/public/v1/cms-components/route.ts`) que lean JSON estáticos o reenvíen a los mismos datos que usa hoy la home.
- **Opción B:** Backend externo (Ecosistema_Comercial/cms_backend u otro) que exponga los dos endpoints; configurar `NEXT_PUBLIC_API_URL`.

### 3.3 Client config

- El schema actual en `portable-dynamic-cms` está pensado para portales (propiedades, mapas, etc.). Para Palo Alto conviene **simplificar o extender**:
  - **branding:** primaryColor, secondaryColor (palo-alto), logo, favicon.
  - **features:** contactForm, analytics, cookieConsent; el resto en false o por defecto.
- Ajustar `client-config.ts` (o crear un schema extendido) y `default-config.ts` con colores y nombres por defecto de Bodega Palo Alto.

### 3.4 Mapeo CMS → componentes del proyecto

| type (CMS) | layoutName | Componente React |
|------------|------------|-------------------|
| `hero_home` / `home_hero` | home-hero | HomeHero |
| `carousel_lineas` / `home_carousel_lineas` | home-carousel-lineas | HomeCarouselLineas |
| `banner` / `home_banner` | home-banner | HomeBanner |
| `productos_destacados` / `home_productos_destacados` | home-productos-destacados | HomeProductosDestacados |

Cada componente debe aceptar al menos: `data`, `loading?`, `error?`, y opcionalmente props de `_configuracion`. Si `data` tiene la misma forma que los JSON actuales (slides, logoImage, lista_slides, etc.), se pueden reutilizar sin cambios; si no, wrappers ligeros que adapten `data` al formato esperado.

---

## 4. Plan de tareas (orden sugerido)

### Fase 1: Integrar la carpeta y dependencias

1. **Copiar** la carpeta `portable-dynamic-cms` dentro del proyecto (por ejemplo `src/portable-dynamic-cms`).
2. **Instalar** `zod` si no está (`pnpm add zod`).
3. **Alias:** configurar en `tsconfig.json` / next.config el alias `@/portable-dynamic-cms` (o la ruta elegida) para imports limpios.
4. **Ajustar imports** dentro de `portable-dynamic-cms` si usan `@/` (deben apuntar a rutas relativas dentro de la carpeta o al alias del proyecto).

### Fase 2: Configuración y client config

5. **Variables de entorno:**  
   - `NEXT_PUBLIC_API_URL` (base del backend o de los route handlers mock).  
   - Opcional: `NEXT_PUBLIC_CLIENT_SLUG` para fallback a JSON local en desarrollo.
6. **Schema ClientConfig:** adaptar `client-config.ts` a Palo Alto (branding mínimo; features reducidas o por defecto).
7. **default-config.ts:** valores por defecto (nombre "Bodega Palo Alto", colores palo-alto, etc.).
8. **client-config-loader.ts:** en fallback local, apuntar la ruta de JSON a algo como `public/data/client-configs/palo-alto.json` (crear ese JSON si se usa).

### Fase 3: APIs mock (para probar sin backend real)

9. **GET /api/public/v1/client-config:** route handler que devuelva un JSON válido según el schema (o lea de `public/data/client-configs/palo-alto.json`).
10. **GET /api/public/v1/cms-components:** route handler que devuelva `{ success: true, data: { components: [...], client: { id, name, slug } } }`.  
    - Los `components` pueden generarse a partir de los JSON actuales de home (hero, carousel, banner1, banner2, productos destacados) con `type`, `page: "Inicio"`, `data` igual al contenido actual, `_orden` (1, 2, 3, 4, 5), `isVisible: true`, `status: "published"`.

### Fase 4: Layout raíz y provider

11. **Layout raíz** (`app/layout.tsx`):  
    - Obtener hostname con `headers().get("host")`.  
    - Llamar a `getClientConfig(hostname)`.  
    - Envolver la app con `ClientConfigProvider` pasando `initialConfig={config}`.  
    - Si `getClientConfig` falla o no hay API, usar `getDefaultConfig()` para no romper la app.

### Fase 5: Mapeo y página Home con DynamicLayout

12. **Definir** `cmsTypeToLayoutName` y `componentMap` en un módulo (ej. `src/lib/cms-layout-map.ts`) para la home: tipos CMS → nombres de layout → HomeHero, HomeCarouselLineas, HomeBanner, HomeProductosDestacados.
13. **Adaptar props:** asegurar que `getComponentProps` (por defecto o personalizado) pase a cada componente un objeto que coincida con lo que hoy reciben (ej. `data` con la estructura del JSON actual). Si el CMS devuelve otro formato, un adapter en `getComponentProps` que transforme `cmsComponent.data` al formato esperado por cada componente.
14. **Locale:** pasar `locale` al contexto o a la petición de cms-components (ej. query `?page_filter=Inicio&locale=es` si el backend lo soporta), o usar un único `pageType` y que los componentes reciban `locale` desde la página para seleccionar textos/idioma.
15. **Página Home dinámica:**  
    - Crear una variante de `app/[locale]/page.tsx` que use `DynamicLayout` con `pageType="Inicio"` (o "Home" si se distingue por idioma), `cmsTypeToLayoutName`, `componentMap`.  
    - Mantener **fallback:** si no hay config o no hay componentes (o API falla), renderizar la home estática actual (getHomeHeroData, etc.). Esto puede hacerse con un flag de env (ej. `NEXT_PUBLIC_USE_CMS_LAYOUT=true`) o detectando si `components.length === 0` tras la carga.
16. **LoadingComponent / EmptyComponent:** opcional; si se usa DynamicLayout siempre, definir un loading y un mensaje cuando no haya componentes para "Inicio".

### Fase 6: Pruebas y documentación

17. Probar con APIs mock: home renderiza los mismos bloques que ahora pero ordenados/configurados por la respuesta del CMS.
18. Probar fallback (API caída o sin componentes): home estática sin errores.
19. Documentar en el repo: qué endpoints espera el layout dinámico, cómo generar los JSON de componentes para el CMS (según MANUAL_JSON_COMPONENTES_CMS_FORMULARIO_DINAMICO.md) y cómo extender el mapeo a otras páginas en el futuro.

---

## 5. Checklist de implementación (resumen)

- [ ] Rama `feature/dynamic-layout-cms` creada.
- [ ] Carpeta `portable-dynamic-cms` copiada e integrada (alias, zod).
- [ ] Schema y default de client-config adaptados a Palo Alto.
- [ ] Variables de entorno documentadas y opcionalmente usadas para fallback local.
- [ ] Route handlers mock: client-config y cms-components.
- [ ] Layout raíz: getClientConfig + ClientConfigProvider.
- [ ] cmsTypeToLayoutName y componentMap definidos para Home.
- [ ] getComponentProps (o default) compatible con HomeHero, HomeCarouselLineas, HomeBanner, HomeProductosDestacados.
- [ ] Página Home usa DynamicLayout con fallback a home estática.
- [ ] Locale considerado (query o pageType por idioma).
- [ ] Pruebas con mock y con API desactivada/fallback.

---

## 6. Estructura de `data` de componentes CMS (referencia)

Para que el formulario dinámico del CMS y el front coincidan, cada tipo de componente debe tener un `data` con prefijos estándar (ver MANUAL_JSON_COMPONENTES_CMS_FORMULARIO_DINAMICO.md). Ejemplo para hero de home:

- `lista_slides`: array de `{ img_src, txt_alt }`.
- `logoImage`, `txt_titulo`, `txt_subtitulo` (o `txt_titulo_optional`).
- `_orden`: número.
- `_configuracion`: objeto libre (variant, etc.) no mostrado en el form.

Los JSON actuales en `src/data/es/home/hero.json`, `carousel-lineas.json`, `banner-1.json`, `banner-2.json`, `productos-destacados.json` sirven como base para definir los documentos de ejemplo en el CMS y para el mock de `cms-components`.
