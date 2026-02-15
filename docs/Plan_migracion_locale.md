# Plan de migración a rutas con [locale]

Objetivo: unificar todas las páginas bajo un segmento dinámico `[locale]` (es | en), sin duplicar archivos por idioma, manteniendo **español como versión original/default**.

---

## Estado actual

- **Español:** `/`, `/contacto`, `/bodega`, `/destileria` (páginas en raíz o en carpetas sin prefijo).
- **Inglés:** `/en`, `/en/contacto`, `/en/bodega`, `/en/destileria` (todo bajo `app/en/`).
- **Bienvenida:** `/bienvenida` (única, idioma por query `?locale=`).
- Hay **duplicación** de páginas: `app/contacto/page.tsx` y `app/en/contacto/page.tsx`, etc.

---

## Estado objetivo

- **Rutas:** Todas las páginas bajo `[locale]`:
  - `/es` (home español)
  - `/es/contacto`, `/es/bodega`, `/es/destileria`
  - `/en` (home inglés)
  - `/en/contacto`, `/en/bodega`, `/en/destileria`
- **Raíz `/`:** Redirige a `/es` (español como original).
- **Bienvenida:** `/es/bienvenida` y `/en/bienvenida` (o mantener `/bienvenida` y redirigir según contexto; ver paso 6).
- **Una sola página por ruta lógica:** cada `app/[locale]/contacto/page.tsx` usa `params.locale` para pedir datos.

---

## Paso 1: Constantes y tipo de locale

**Archivo:** `src/lib/i18n.ts` (nuevo)

- Definir `LOCALES = ['es', 'en'] as const` y tipo `Locale = (typeof LOCALES)[number]`.
- Definir `DEFAULT_LOCALE: Locale = 'es'`.
- Exportar función `isValidLocale(locale: string): locale is Locale`.
- Opcional: `getLocaleFromPathname(pathname: string): Locale` (primer segmento si es 'es'|'en', sino default).

Así todo el código usa la misma fuente de verdad para idiomas.

---

## Paso 2: Layout raíz y redirección de `/`

- **Mantener** `app/layout.tsx` como está (fuentes, LayoutClient, metadata base). Luego se podrá hacer que `lang` del `<html>` dependa del locale (paso 7).
- **Crear** `app/page.tsx` que haga **redirect permanente** a `/es`:
  - `redirect('/es', 307)` desde el servidor (o 308 Permanent).
  - Así la “versión original” en español queda en `/es` y `/` siempre lleva ahí.

---

## Paso 3: Estructura de carpetas bajo `[locale]`

Crear la siguiente estructura y **mover** (no duplicar) el contenido de las páginas actuales:

```
app/
  [locale]/
    layout.tsx       ← nuevo: valida locale, pone lang en html (o lo hace el root)
    page.tsx         ← contenido actual de app/page.tsx (home)
    contacto/
      page.tsx       ← contenido actual de app/contacto/page.tsx
    bodega/
      page.tsx       ← contenido actual de app/bodega/page.tsx
    destileria/
      page.tsx       ← contenido actual de app/destileria/page.tsx
    bienvenida/
      page.tsx       ← contenido actual de app/bienvenida/page.tsx
```

- En **cada** `page.tsx` bajo `[locale]`, recibir `params: { locale: string }` y:
  - Validar con `isValidLocale(params.locale)`; si no es válido, redirigir a `/${DEFAULT_LOCALE}` o a la ruta equivalente en español.
  - Llamar a los getters con el locale: `getContactPageData(params.locale)`, `getDestileriaData(params.locale)`, etc.
- **Eliminar** después de la migración:
  - `app/contacto/`, `app/bodega/`, `app/destileria/`
  - `app/en/` (toda la carpeta)

---

## Paso 4: Layout de `[locale]`

**Archivo:** `app/[locale]/layout.tsx`

- Recibir `params: { locale: string }` y `children`.
- Si `!isValidLocale(params.locale)` → `notFound()` o `redirect('/es')`.
- Por ahora solo `return children`. Opcional: envolver en un div o pasar locale por context si más adelante lo necesitáis.
- El `<html lang>` puede quedarse en el root layout y actualizarse en el paso 7 vía segmento; o podéis poner aquí un wrapper que no incluya `<html>` (los layouts anidados no redefinen html/body).

---

## Paso 5: Actualizar middleware (age gate)

**Archivo:** `src/middleware.ts`

- **Matcher:** Incluir todas las rutas que requieran verificación de edad, **excluyendo** bienvenida y estáticos:
  - Ejemplo: `matcher: ['/((?!bienvenida|api|_next|favicon).*)']` o más explícito `['/es', '/es/:path*', '/en', '/en/:path*']` (y ya no usar `/` si redirigís a `/es` desde `app/page.tsx`).
- **Lógica:**
  - Si la ruta es alguna de `/es/bienvenida` o `/en/bienvenida` (o `/bienvenida` si se mantiene) → `NextResponse.next()`.
  - Si no hay cookie `ageVerified`:
    - Extraer “locale” de la URL: primer segmento si es `es` o `en`, sino `'es'`.
    - Redirigir a `/${locale}/bienvenida` (ej. `/es/bienvenida` o `/en/bienvenida`).
  - Si hay cookie → `NextResponse.next()`.
- Así se conserva el idioma al mandar a bienvenida y al volver.

---

## Paso 6: Bienvenida

- **Opción A (recomendada):** Mover a `app/[locale]/bienvenida/page.tsx`.
  - Datos: `getWelcomeData(params.locale)`.
  - Tras “Sí, soy mayor”: `router.push(\`/${params.locale}\`)` (home del mismo idioma). Necesitás pasar `locale` al componente (ej. desde la página al `WelcomeContent`).
- **Opción B:** Dejar bienvenida en `app/bienvenida/` (una sola ruta).
  - Middleware sin locale redirige a `/bienvenida`; en la página leés `?locale=es|en` o lo inferís (ej. desde Referer). Tras confirmar, `router.push(locale === 'en' ? '/en' : '/es')`.
- Recomendación: **Opción A** para que todo quede bajo `[locale]` y el middleware pueda redirigir a `/${locale}/bienvenida`.

---

## Paso 7: Header y Footer (links con locale)

- **Datos (header/footer):**
  - En `src/data/es/header.json`: que todas las URLs de navegación y logo usen prefijo `/es`:
    - `link_logo.url`: `"/es"`
    - `lista_nav`: `link_url` como `"/es/bodega"`, `"/es/destileria"`, `"/es/contacto"`, etc.
  - En `src/data/en/header.json`: ya tienen `/en/...`; revisar que estén completas (`/en`, `/en/bodega`, `/en/contacto`, `/en/destileria`).
- **Componente Header (y Footer si tiene links):**
  - Actualizar `getLocaleFromPathname`: si el primer segmento es `es` o `en`, ese es el locale; si es `/` (ya no debería ocurrir si todo pasa por `/es` o `/en`) → `'es'`.
  - Actualizar `getLocalizedPath(pathname, newLocale)` para que siempre devuelva `/${newLocale}${pathWithoutLocale}`:
    - Extraer “path without locale”: quitar el primer segmento si es `es` o `en`, resto es el path (ej. `/contacto` o `` para home).
    - Devolver `/${newLocale}${pathWithoutLocale}` (ej. `pathWithoutLocale === ''` → `/es` o `/en`).
  - Así el selector de idioma sigue llevando a la misma “página” en el otro idioma.

---

## Paso 8: Atributo `lang` del documento

- El `<html lang="...">` debe reflejar el idioma actual.
- Opciones:
  - **A)** Root layout sigue con `lang="es"` y en `LayoutClient` (o en un layout que tenga acceso al pathname) usar `usePathname()` + `getLocaleFromPathname` y aplicar `document.documentElement.lang = locale` en un `useEffect` (solo cliente).
---

## Paso 9: Metadata por página y por locale

- En cada `app/[locale]/.../page.tsx` que exporte `metadata`, usar el locale para títulos/descripciones (ya tenés datos por idioma en JSON o en los getters).
- Opcional: `generateMetadata({ params })` con `params.locale` para devolver `title` y `description` según idioma.

---

## Paso 10: Limpieza y pruebas

- Eliminar `app/contacto/`, `app/bodega/`, `app/destileria/` (raíz).
- Eliminar toda la carpeta `app/en/`.
- Eliminar el `app/bienvenida/` si se movió a `[locale]/bienvenida`.
- Ajustar `LayoutClient`: la condición `pathname === "/bienvenida"` pasar a ser “pathname termina en `/bienvenida`” o `pathname.includes('/bienvenida')` para no mostrar header/footer en `/es/bienvenida` y `/en/bienvenida`.
- Probar:
  - `/` → redirect a `/es`.
  - `/es`, `/es/contacto`, `/es/bodega`, `/es/destileria` (español).
  - `/en`, `/en/contacto`, etc. (inglés).
  - Cambio de idioma en el header (misma ruta lógica, otro locale).
  - Sin cookie → redirect a `/es/bienvenida` (o `/en/bienvenida` si se entró por `/en`).
  - Tras confirmar edad → vuelta a `/es` o `/en` según corresponda.

---

## Orden sugerido de implementación

1. Paso 1 (i18n.ts).
2. Paso 2 (redirect `/` → `/es`).
3. Paso 3 y 4 (crear `[locale]` y layout, mover home, contacto, bodega, destileria, bienvenida).
4. Paso 5 (middleware).
5. Paso 6 (bienvenida bajo [locale] y redirect post-confirm).
6. Paso 7 (header/footer JSON y getLocalizedPath).
7. Paso 8 (lang en html).
8. Paso 9 (metadata).
9. Paso 10 (eliminar carpetas viejas y pruebas).

---

## Resumen

- **Español como original:** `/` redirige a `/es`; todo el contenido en español vive bajo `/es/...`.
- **Un solo archivo por ruta:** cada página bajo `app/[locale]/...` usa `params.locale` para los datos.
- **Idioma siempre en la URL:** mismo patrón en header/footer y middleware; no depender de cookies para el idioma.
- **Buenas prácticas:** locale centralizado, validación en layout, `lang` correcto y metadata por idioma.
