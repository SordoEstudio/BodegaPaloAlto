# Plan de implementación: Página de productos (marketplace)

Documento de planificación para la implementación de la página de productos con formato marketplace, cards individuales, filtros dinámicos y página de detalle. Mantiene consistencia visual y funcional con el resto del sitio, buenas prácticas UX/UI, contraste accesible y soporte multiidioma.

---

## 1. Resumen

| Aspecto | Descripción |
|---------|-------------|
| **Rutas** | `/[locale]/productos` (listado), `/[locale]/productos/[slug]` (detalle) |
| **Fuente de datos** | API pública de productos (`usePublicProducts`, `GET /products/[slug]`) |
| **Formato** | Marketplace con grid de cards, filtros laterales/colapsables |
| **Clasificación por defecto** | Productos agrupados por **línea**; destacados primero |
| **i18n** | Contenido desde API con `locale`; UI con `ui-translations` |

---

## 2. Rutas y estructura de archivos

```
src/
├── app/[locale]/productos/
│   ├── page.tsx              # Listado (marketplace)
│   └── [slug]/
│       └── page.tsx          # Detalle de producto
├── components/products/
│   ├── ProductCard.tsx       # Card individual
│   ├── ProductGrid.tsx       # Grid de cards
│   ├── ProductFilters.tsx   # Filtros dinámicos
│   ├── ProductPagination.tsx # Paginación (solo si total > limit)
│   ├── ProductDetail.tsx     # Vista detalle
│   └── ProductDetailHero.tsx # Hero/imagen principal del detalle
├── lib/
│   └── product-utils.ts      # Helpers (filtros, blend, atributos)
└── hooks/
    └── usePublicProducts.ts  # (existente)
```

---

## 3. Página de listado (marketplace)

### 3.1 Layout general

- **Header**: mismo que resto del sitio (Header con nav, logo, idiomas).
- **Hero/Sección superior**: título "Nuestros productos" / "Our products", opcional subtítulo.
- **Área principal**: layout en dos columnas (desktop) o colapsable (mobile):
- **Columna izquierda (filtros)**: ~240px fija o colapsable en mobile; todas las opciones visibles.
- **Columna derecha**: grid de cards + paginación (solo si aplica).

### 3.1.1 Líneas y navegación desde Home

- **Clasificación por defecto**: presentar productos agrupados por **línea** (Benito A., Palo Alto, Yllum, etc.).
- **Destacados primero**: productos con `featured: true` al inicio de cada grupo o del listado.
- **Carousel de líneas (Home)**: en la hero de la home hay una sección (`home_carrousel_lineas`) con cards: cada línea tiene su logo e imagen. **Cada card debe enlazar a** `/[locale]/productos?linea=<slug-linea>` con el filtro de línea ya activo (ej. `/es/productos?linea=benito-a`).
- **Página `/productos` sin filtros**: muestra **todos** los productos (todas las líneas, todos los tipos).

### 3.2 ProductCard

- **Imagen**: `product.images[0]?.url` o placeholder con ratio 3/4 (como en HomeProductosDestacados).
- **Título**: `product.locale.title`.
- **Atributos destacados**: línea, varietal, crianza (desde `product.attributes`).
- **Hover**: ligera elevación y scale (1.02–1.05) en imagen.
- **Link**: `/[locale]/productos/[slug]`.
- **Colores**: `text-palo-alto-secondary`, `border-zinc-200`, `bg-white`, sombras suaves.
- **Contraste**: WCAG AA mínimo (texto sobre fondo claro).

### 3.3 Filtros dinámicos

- **Origen**: atributos únicos de `products` (attributes) + `productType` + `tags` + `categories`.
- **Campos filtrables**:
  - **`linea`** (Benito A., Palo Alto, Yllum, Amadores, Cumbres del Plata, Efigenia, etc.) — todas las opciones a la vista.
  - **`productType`**: 3 tipos — `espumantes`, `vinos`, `gin`.
  - **`color`** (tinto, blanco, rosé)
  - **`varietal`** (Malbec, Cabernet Sauvignon, etc.) — ver lógica Blend más abajo.
  - **`crianza`** (Gran Reserva, Reserva, Joven, etc.)
  - **`blend`**: viene como `true`/`false` en attributes (o `corte: "Sí"/"No"`). Se presenta como un tipo de varietal: "Blend" = vino con más de un varietal.
- **Lógica varietal + Blend**: al filtrar por varietal (ej. "Malbec"), mostrar:
  - vinos cuyo `varietal` sea exactamente "Malbec";
  - blends (`blend: true` o `corte: "Sí"`) cuyo `varietal` **contenga** "Malbec" (ej. "Malbec, Cabernet Franc, Cabernet Sauvignon").
- **Tags y categorías**: considerar uso para filtros secundarios o etiquetas en cards (según disponibilidad en API).
- **UI**: checkboxes o select múltiple; labels en i18n; todas las opciones visibles en el panel de filtros.
- **Comportamiento**: filtros en URL (`?linea=palo-alto&productType=vinos&color=tinto`) para compartir y SEO.
- **Mobile**: panel deslizable o acordeón.

### 3.4 Ordenamiento

- **Por el momento**: no implementar ordenamiento. El orden viene de la API (`order` ascendente, `createdAt` descendente) y los destacados primero en cliente.

### 3.5 Paginación

- **Datos**: `pagination` de la API (`page`, `limit`, `total`, `pages`).
- **Condición de visualización**: **solo mostrar paginación si `total > limit`** (ej. limit 50, llegan 20 productos → no mostrar paginación).
- **UI**: botones "Anterior" / "Siguiente" + números de página cuando aplique.
- **URL**: `?page=2`.

---

## 4. Página de detalle de producto

### 4.1 Layout

- **Hero**: imagen principal (primera de `images` o placeholder).
- **Contenido**: dos columnas (desktop) o apilado (mobile):
  - **Izquierda**: galería de imágenes (si hay más de una).
  - **Derecha**: título, atributos, descripción, bloque "Notas de cata" (vista, nariz, boca).

### 4.2 Datos a mostrar

- **Título**: `locale.title`.
- **Subtitle**: `locale.summary` o atributos (línea, varietal).
- **Descripción**: `locale.description` (párrafos).
- **Atributos**: `attributes` (linea, color, varietal, crianza, corte).
- **Notas de cata**: `attributes.vista`, `attributes.nariz`, `attributes.boca`.
- **Imágenes**: `images` con `order` y `alt`.
- **Attachments**: enlaces a PDFs, etc.

### 4.3 SEO

- **Metadata**: `locale.seo.meta_title`, `locale.seo.meta_description`.
- **Open Graph**: imagen principal, título, descripción.

---

## 5. Consistencia visual y UX/UI

### 5.1 Paleta y tipografía

- **Colores**: `--palo-alto-primary`, `--palo-alto-secondary`, `--background`, `--foreground`.
- **Tipografía**: `font-heading` para títulos, `font-sans` para cuerpo.
- **Referencia**: `HomeProductosDestacados`, `Header`, `Footer`.

### 5.2 Componentes reutilizables

- **Botones**: `rounded`, `bg-palo-alto-primary`, `text-palo-alto-secondary`, `hover:opacity-95`.
- **Cards**: `rounded-lg`, `border`, `shadow-sm`, `hover:shadow-md`.
- **Inputs**: `rounded`, `border`, focus ring visible.

### 5.3 Contraste y accesibilidad

- **Contraste**: texto sobre fondo ≥ 4.5:1 (WCAG AA).
- **Focus**: `focus:outline-none focus:ring-2 focus:ring-palo-alto-primary`.
- **Labels**: asociados a inputs; filtros con `aria-label`/`aria-labelledby`.
- **Imágenes**: `alt` siempre presente.

### 5.4 Responsive

- **Mobile first**: filtros colapsables, grid 1–2 columnas.
- **Tablet**: 2–3 columnas de cards.
- **Desktop**: 3–4 columnas, filtros fijos.

---

## 6. Internacionalización (i18n)

### 6.1 Contenido de productos

- **API**: `locale` en query (`?locale=es` | `?locale=en`).
- **Respuesta**: `product.locale` ya traducido por el backend.

### 6.2 UI de la página

- **Archivo**: `src/lib/ui-translations.ts`.
- **Claves a añadir** (ejemplo):

```ts
productos: {
  pageTitle: string;
  pageSubtitle: string;
  filters: {
    title: string;
    linea: string;
    productType: string;
    color: string;
    varietal: string;
    blend: string;
    crianza: string;
    clearAll: string;
  };
  productTypes: {
    vinos: string;
    espumantes: string;
    gin: string;
  };
  pagination: {
    previous: string;
    next: string;
    pageOf: string;
  };
  detail: {
    notasCata: string;
    vista: string;
    nariz: string;
    boca: string;
    atributos: string;
    descripcion: string;
    fichaTecnica: string;
  };
  empty: string;
  loading: string;
}
```

### 6.3 Rutas

- **Locale**: `/[locale]/productos` (es, en).
- **Links**: `Link` con `href={`/${locale}/productos`}` y `/${locale}/productos/${slug}`.

---

## 7. Integración con API

### 7.1 Listado

```tsx
const { products, pagination, loading, error } = usePublicProducts("bodega-palo-alto", {
  locale: locale,
  page: currentPage,
  limit: 50,
  productType: "wine" | "sparkling" | "gin", // mapear espumantes ↔ sparkling si la API usa otro valor
  // category, linea, etc. si la API lo soporta
});
```

- **Filtros**: aplicar en cliente o vía API según soporte (`productType`, `category`, `linea` en query).
- **Orden en cliente**: destacados primero (`featured: true`), luego orden de API (`order`, `createdAt`).
- **Normalización de slugs**: para URLs de filtro `?linea=benito-a`, normalizar "Benito A." → "benito-a" (helper en `product-utils.ts`).

### 7.2 Detalle

- **Fetch**: `GET /api/public/v1/products/[slug]?locale=es&clientSlug=bodega-palo-alto`.
- **Server component**: `fetch` en el page con `locale` del params.
- **Fallback**: 404 si no existe.

---

## 8. Checklist de implementación

### Fase 1: Estructura base

- [ ] Crear `app/[locale]/productos/page.tsx`.
- [ ] Crear `app/[locale]/productos/[slug]/page.tsx`.
- [ ] Añadir traducciones en `ui-translations.ts` (productos).
- [ ] Verificar que el link "Productos" del header apunte a `/[locale]/productos`.
- [ ] Actualizar links del carousel de líneas (Home): cada card debe enlazar a `/[locale]/productos?linea=<slug>` en lugar de `/vinos/...` o `/espumantes/...` (ajustar `carousel-lineas.json` o mapeo en `getCarouselLineasData`).

### Fase 2: Listado

- [ ] `ProductCard` con imagen, título, atributos.
- [ ] `ProductGrid` con grid responsive.
- [ ] Integrar `usePublicProducts` en la página.
- [ ] Estado de loading y error.
- [ ] Estado vacío.

### Fase 3: Filtros

- [ ] `ProductFilters` con datos dinámicos: linea, productType (vinos/espumantes/gin), color, varietal, blend, crianza.
- [ ] Lógica varietal+blend: al filtrar por varietal, incluir blends que contengan ese varietal.
- [ ] Sincronizar filtros con URL (query params).
- [ ] Considerar tags y categorías para filtros secundarios o etiquetas en cards.

### Fase 4: Paginación

- [ ] `ProductPagination` con `pagination` de la API.
- [ ] Mostrar solo si `total > limit`.
- [ ] Parámetro `page` en URL.

### Fase 5: Detalle

- [ ] Fetch de producto por slug.
- [ ] `ProductDetail` con layout hero + contenido.
- [ ] Galería de imágenes.
- [ ] Notas de cata (vista, nariz, boca).
- [ ] Metadata dinámica (SEO).

### Fase 6: Pulido

- [ ] Revisión de contraste (WCAG AA).
- [ ] Focus visible en navegación por teclado.
- [ ] Pruebas en mobile/tablet/desktop.
- [ ] Validar i18n (es/en).

---

## 9. Referencias

- **API**: `docs/API_PUBLICA_PRODUCTOS_FRONT.md`
- **Datos de ejemplo**: `src/data/vinos/productos-desde-api.json`
- **Componente similar**: `src/components/home/HomeProductosDestacados.tsx`
- **Carousel de líneas (Home)**: `src/components/home/HomeCarouselLineas.tsx`, datos en `src/data/es/home/carousel-lineas.json`, `src/data/en/home/carousel-lineas.json`, mapeo en `src/lib/data.ts` (`getCarouselLineasData`).
- **Estilos**: `src/app/globals.css`, variables `--palo-alto-*`
- **Traducciones**: `src/lib/ui-translations.ts`

---

## 10. Cambios y mejoras (implementados)

| Mejora | Estado |
|--------|--------|
| Líneas en header de página productos (cards con logo, como hero home) | ✅ `ProductosLineasSection` debajo del título |
| Check seleccionado: click deselecciona | ✅ Lógica `checked ? undefined : value` en todos los checkboxes |
| Links a líneas: header y carousel | ✅ Ambos usan `/[locale]/productos?linea=<slug>` |
| Link al detalle de producto | ✅ `/[locale]/productos/[slug]` |
| Cards: alto igual, sin expandir | ✅ `h-full`, `min-h-[88px]`, `flex flex-col` |
| Card: solo info relevante (línea, varietal/Blend, crianza) | ✅ Orden: linea → varietal o "Blend" → crianza |
| Blend como opción en select varietales | ✅ Select unificado con opción "Blend" |
| Filtro sticky antes del header | ✅ `sticky top-[5rem]` (debajo del header) |

Cambios y mejoras:
- Plantear las lineas de productos en el header de forma similar a la 
propuesta en el hero de la home.
- al hacer click en un check seleccionado debe desseleccionarse.
- revisar los links(o la direccion) a linea de productos en el header y en el 
carousel de lineas de la home.
- revisar la direccion o el link al detalle de producto.
- igualar el alto de las cards y no dejar que se expandan.
- no repetir informacion en la card de producto, en la card de producto debe 
mostrarse solo la informacion relevante. en este orden de importancia: linea, 
varietal/varietales (si es blend so mostrar "Blend"), y guarda.
- mostrar blend como opcion en el select de varietales,
- o mostrar mas de un varietal en el select
- la card flotante de filtro al hacer scroll hacia abajo debe "anclarse" un 
porquito antes del header.