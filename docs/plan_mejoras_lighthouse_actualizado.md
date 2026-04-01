# Plan de mejoras Lighthouse (actualizado)

## Base analizada

Archivo: `docs/lighthouse.json`  
Rutas auditadas:

- `/es/bodega` (Performance 83, Accessibility 100, SEO 100)
- `/es/destileria` (Performance 86, Accessibility 96, SEO 100)
- `/es/contacto` (Performance 87, Accessibility 100, SEO 100)

## Hallazgos prioritarios (resumen)

1. **CLS alto** en `bodega` (0.328) y `destileria` (0.275), y aún mejorable en `contacto` (0.145).
2. **JavaScript no utilizado** alto en todas las rutas (220-245 KiB estimados).
3. **Optimización de imágenes** pendiente, con mayor impacto en `contacto` (274 KiB).
4. **LCP discovery / LCP breakdown** con oportunidades en las 3 rutas.
5. **target-size** pendiente en `destileria`.

---

## Objetivos de la siguiente iteración

- Performance: llevar `bodega` y `destileria` a **90+**, `contacto` a **90+**.
- CLS: bajar a **<= 0.10** en rutas clave.
- LCP: estabilizar por debajo de **1.2s** en `contacto`.
- Reducir `unused-javascript` real del bundle propio en **120+ KiB**.

---

## Plan por prioridad e impacto

## Prioridad 1 (impacto muy alto)

### A) Reducir CLS en bloques críticos

**Rutas:** `/es/bodega`, `/es/destileria`, `/es/contacto`  
**Motivo:** es la principal métrica que está empujando Performance hacia abajo.

#### Acciones

- Revisar secciones con overlays, fondos y contenido CMS para asegurar altura reservada y estructura estable.
- En carruseles y bloques con texto dinámico:
  - fijar alturas mínimas por breakpoint,
  - evitar aparición tardía de controles que cambien layout.
- En imágenes con `fill`, validar que el contenedor padre tenga dimensiones definidas siempre.

#### Archivos candidatos

- `src/components/bodega/BodegaQuienesSomos.tsx`
- `src/components/bodega/BodegaFincasSection.tsx`
- `src/components/destileria/DestileriaTextHighlight.tsx`
- `src/components/contact/ContactPageSection.tsx`
- `src/components/promo/PromoCarousel.tsx`

#### Criterio de aceptación

- CLS <= 0.10 en `bodega` y `destileria`, <= 0.10 en `contacto`.

---

### B) Optimización de imagen principal de contacto

**Ruta:** `/es/contacto`  
**Motivo:** `image-delivery-insight` con ahorro estimado alto (~274 KiB) y LCP de 1.5s.

#### Acciones

- Generar variantes de imagen por breakpoint (mobile/tablet/desktop) y asegurar compresión agresiva.
- Ajustar `sizes` reales según ancho efectivo del contenedor.
- Revisar si el recurso LCP de contacto es esa imagen y priorizar su entrega temprana.

#### Archivos candidatos

- `src/components/contact/ContactPageSection.tsx`
- origen de assets en CMS/Blob (contenido de imagen)

#### Criterio de aceptación

- Reducción significativa del peso transferido de la imagen principal.
- LCP de `/es/contacto` por debajo de 1.2s (mediana de 3 corridas).

---

## Prioridad 2 (impacto alto)

### C) Reducir JS no utilizado y legacy JS en rutas CMS

**Rutas:** todas las auditadas  
**Motivo:** `unused-javascript` persiste entre 220 y 245 KiB.

#### Acciones

- Profundizar code splitting por componente, cargando piezas pesadas sólo cuando entran al viewport.
- Revisar librerías de íconos/utilidades para evitar importar paquetes completos.
- Auditar chunks de `_next/static/chunks/*.js` con mayor desperdicio y mover lógica al servidor cuando aplique.

#### Archivos candidatos

- `src/lib/cms-home-map.tsx`
- `src/lib/cms-bodega-map.tsx`
- `src/lib/cms-destileria-map.tsx`
- `src/portable-dynamic-cms/components/DynamicLayout.tsx`
- `src/components/layout/*`

#### Criterio de aceptación

- Mejora visible en `unused-javascript` en assets propios (excluyendo extensiones).

---

### D) Corregir target-size en destilería

**Ruta:** `/es/destileria`  
**Motivo:** único punto que baja Accessibility a 96.

#### Acciones

- Verificar bullets/controles interactivos señalados por Lighthouse.
- Asegurar área clickeable mínima de 44x44 y separación suficiente.

#### Archivos candidatos

- `src/components/promo/PromoCarousel.tsx`
- `src/components/destileria/DestileriaManifesto.tsx`
- `src/components/home/HomeCarouselLineas.tsx` (si se reutiliza control)

#### Criterio de aceptación

- Accessibility >= 100 en `/es/destileria` con fallo `target-size` resuelto.

---

## Prioridad 3 (impacto medio)

### E) Mejorar LCP request discovery y breakdown

**Rutas:** todas  
**Motivo:** los insights indican descubrimiento tardío del recurso LCP.

#### Acciones

- Confirmar que el recurso LCP no dependa de JS de baja prioridad.
- Evitar lazy-load en el elemento hero crítico.
- Revisar prioridades de carga en fuentes y recursos above-the-fold.

#### Criterio de aceptación

- Menos advertencias de `lcp-discovery-insight` y mejor estabilidad de LCP.

---

## Notas de interpretación del reporte

- El reporte original puede incluir scripts de extensiones del navegador (`chrome-extension://...`) en `unused-javascript`.
- Para comparar mejoras reales:
  - usar incógnito sin extensiones,
  - ejecutar 3 corridas por ruta,
  - comparar mediana.

---

## Checklist de ejecución

- [ ] Medición base limpia (incógnito sin extensiones, 3 corridas por ruta).
- [ ] Corrección de CLS en secciones críticas.
- [ ] Optimización de imagen/LCP en `contacto`.
- [ ] Reducción de JS no utilizado en rutas CMS.
- [ ] Fix de `target-size` en `destileria`.
- [ ] Re-medición final y tabla comparativa.
