# Plan de implementacion Lighthouse por componente/archivo

## Objetivo

Subir el puntaje de **Performance** (actual ~83-87 en paginas auditadas) sin degradar UX, priorizando:

1. **CLS** (layout shift) alto en bodega/destileria.
2. **JS no utilizado** y carga de JS no critico.
3. **Optimizacion de imagenes** (impacto fuerte en contacto).
4. Ajustes puntuales de **accesibilidad** (target-size).

---

## Prioridad 1 (Impacto muy alto)

### 0) Skeletons de layout para reducir saltos percibidos (implementacion secuencial)

**Impacto esperado:** Alto en UX percibida y apoyo a CLS (si replica dimensiones reales).  
**Metricas objetivo:** reducir saltos visuales durante carga CMS y mantener estructura estable en first paint.

#### Archivos/componentes objetivo

- `src/components/contact/ContactPageWithCMS.tsx`
- `src/components/contact/ContactPageSkeleton.tsx` (nuevo)
- `src/components/home/HomePageWithCMS.tsx`
- `src/components/ui/PageSkeleton.tsx` (reuso)

#### Secuencia de implementacion

1. **Contacto:** reemplazar loading textual por skeleton de 2 columnas (formulario + datos), con altura equivalente al bloque real.
2. **Home/CMS:** usar `LoadingComponent` en `DynamicLayout` para renderizar skeleton estructural en vez de texto.
3. **Ajuste fino:** verificar que skeleton y contenido final mantengan alto/ancho similares para evitar CLS al hidratar.

#### Tareas concretas

- Definir skeletons con `min-height`, bloques y `aspect-ratio` iguales a las secciones reales.
- Evitar skeletons genericos que no reflejen layout final (pueden aumentar CLS al reemplazarse).
- Mostrar skeleton solo en esperas reales de datos CMS.

#### Criterio de aceptacion

- Durante carga CMS no aparece layout shift visible.
- Transicion skeleton → contenido final sin cambios bruscos de alto.

---

### 1) CLS y estabilidad visual en hero, bloques con imagen y carruseles

**Impacto esperado:** Alto (mejora directa en metricas de Performance y UX percibida).  
**Metricas objetivo:** CLS < 0.1 en `/es/bodega` y `/es/destileria`.

#### Archivos/componentes objetivo

- `src/components/bodega/BodegaQuienesSomos.tsx`
- `src/components/bodega/BodegaFincasSection.tsx`
- `src/components/destileria/DestileriaTextHighlight.tsx`
- `src/components/home/HomeBanner.tsx`
- `src/components/home/HomeCarouselLineas.tsx`
- `src/components/promo/PromoCarousel.tsx`
- `src/components/home/HomePageWithCMS.tsx` (orquestacion de secciones)

#### Tareas concretas

- Asegurar dimensiones reservadas para medios:
  - En `next/image`, definir `sizes` realistas y contenedores con `aspect-ratio` fijo.
  - Evitar contenedores que crecen al hidratarse.
- Revisar elementos que cambian altura al cargar textos/fuentes:
  - Aplicar fallback de tipografia compatible.
  - Verificar que no aparezcan saltos por variacion de line-height.
- Carruseles:
  - Fijar altura del viewport del slider en todos los breakpoints.
  - Evitar que paginadores/flechas empujen contenido al montarse.
- Hero/LCP:
  - Si la imagen principal es above-the-fold, usar `priority` y evitar `loading="lazy"` para esa imagen.

#### Criterio de aceptacion

- CLS por pagina <= 0.1 en pruebas Lighthouse (incognito, sin extensiones).
- No hay saltos visibles al cargar ni al iniciar carruseles.

---

### 2) Reducir JavaScript no utilizado y diferir JS no critico

**Impacto esperado:** Alto (reduce TBT, mejora Speed Index e Interactive).  
**Metricas objetivo:** bajar `unused-javascript` en al menos 120-180 KiB reales del bundle propio.

#### Archivos/componentes objetivo

- `src/components/home/HomePageWithCMS.tsx`
- `src/components/contact/ContactPageWithCMS.tsx`
- `src/portable-dynamic-cms/components/DynamicLayout.tsx`
- `src/lib/cms-home-map.tsx`
- `src/lib/cms-bodega-map.tsx`
- `src/lib/cms-destileria-map.tsx`
- `src/lib/data.ts`

#### Tareas concretas

- Aplicar `dynamic import` en componentes no above-the-fold:
  - Carruseles, bloques secundarios y widgets visuales.
- Separar logica pesada de cliente:
  - Mover transformaciones de datos a server components donde sea posible.
- Revisar librerias de UI/animacion:
  - Cargar solo en paginas que las usan.
  - Evitar importar utilidades globales en layout base si no son necesarias.
- Medir bundles:
  - Comparar tamaño por ruta antes/despues (`next build` + analisis de chunks).

#### Criterio de aceptacion

- Lighthouse reduce alertas de `unused-javascript` para assets propios.
- No hay regresiones funcionales en navegacion ni CMS dinamico.

---

## Prioridad 2 (Impacto alto)

### 3) Optimizacion de imagen de fondo en contacto y assets pesados

**Impacto esperado:** Alto en `/es/contacto` (LCP/Speed Index).  
**Metricas objetivo:** bajar ahorro potencial de `image-delivery-insight` (~274 KiB detectados).

#### Archivos/componentes objetivo

- `src/components/contact/ContactPageSection.tsx`
- `src/components/contact/ContactPageWithCMS.tsx`

#### Tareas concretas

- Reemplazar `background-image` CSS pesada por `next/image` cuando sea viable (mejor control de formatos y tamaños).
- Si debe seguir como background:
  - Publicar variantes por breakpoint (mobile/tablet/desktop).
  - Convertir a WebP/AVIF con compresion agresiva para mobile.
- Ajustar punto focal y `sizes` para evitar descargar imagen sobredimensionada.

#### Criterio de aceptacion

- Disminuye significativamente el peso transferido de la imagen principal de contacto.
- Mejora de Speed Index/LCP en `/es/contacto`.

---

### 4) Accesibilidad target-size en controles del carrusel

**Impacto esperado:** Medio-alto (sube Accessibility y mejora uso tactil).  
**Metricas objetivo:** resolver fallo `target-size` en `/es/destileria`.

#### Archivos/componentes objetivo

- `src/components/home/HomeCarouselLineas.tsx`
- `src/components/promo/PromoCarousel.tsx`
- `src/components/destileria/DestileriaManifesto.tsx` (si usa los mismos controles)

#### Tareas concretas

- Aumentar area clickeable de bullets/flechas a minimo 44x44 px.
- Mantener separacion suficiente entre controles contiguos.
- Preservar estetica usando pseudo-elementos o wrappers con hit area mayor.

#### Criterio de aceptacion

- Lighthouse Accessibility sin error de `target-size`.

---

## Prioridad 3 (Impacto medio)

### 5) Fuentes y discovery de recurso LCP

**Impacto esperado:** Medio (estabilidad y percepcion de carga).  
**Metricas objetivo:** eliminar hallazgos recurrentes de `lcp-discovery-insight`.

#### Archivos/componentes objetivo

- `src/app/layout.tsx` (o layout por locale si aplica)
- `src/app/[locale]/...` (plantillas de paginas principales)
- componentes hero de cada pagina critica

#### Tareas concretas

- Preload de fuentes criticas y ajuste de fallback.
- Confirmar que el recurso LCP se descubre temprano:
  - sin depender de JS tardio.
  - sin lazy-load en elemento principal.

#### Criterio de aceptacion

- Mejora consistente en LCP y menos advertencias de discovery.

---

## Fase de ejecucion recomendada (orden)

1. **Fase A (rapida, 1 dia):** skeletons por layout (contacto y home CMS) + verificacion de estabilidad visual.
2. **Fase B (1-2 dias):** target-size + ajustes de alturas fijas en carruseles + hero `priority`.
3. **Fase C (2-3 dias):** optimizacion de imagen de contacto y bloques con mayor ahorro de bytes.
4. **Fase D (2-4 dias):** code splitting por ruta/componente en CMS dinamico.
5. **Fase E (1 dia):** fuentes, preload y afinado final de CLS/LCP.

---

## Protocolo de medicion (obligatorio)

- Ejecutar Lighthouse por ruta critica:
  - `/es/bodega`
  - `/es/destileria`
  - `/es/contacto`
- Correr en:
  - ventana incognito,
  - sin extensiones,
  - 3 corridas por ruta y tomar mediana.
- Registrar antes/despues en tabla:
  - Performance
  - CLS
  - LCP
  - Speed Index
  - Total Blocking Time

---

## Riesgos y notas

- Parte del `unused-javascript` reportado proviene de extensiones de navegador en el informe original; no usar ese ruido como base de decision.
- Cualquier cambio de imagen/fuente debe validarse visualmente en mobile para no afectar branding.
- En componentes CMS dinamicos, preferir cambios incrementales con feature flags por seccion si hay riesgo de regresion.

---

## Estado de implementacion (actual)

- [x] Skeleton de carga en contacto (`ContactPageSkeleton`) y reutilizacion en `loading.tsx`.
- [x] Skeleton de carga en home CMS usando `LoadingComponent` en `DynamicLayout`.
- [x] Controles del carrusel ajustados a area clickeable minima (44x44) para `target-size`.
- [x] Optimizacion de imagenes en `PromoCarousel` (lazy/eager segun prioridad + quality + sizes).
- [x] Optimizacion de fondo de contacto con `next/image` y parametros de compresion.
- [x] Code splitting por pagina en mapas CMS (`home`, `bodega`, `destileria`) con `next/dynamic`.
- [ ] Re-medir Lighthouse en rutas criticas y registrar mediana antes/despues.
