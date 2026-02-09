# Informe de análisis: sitio original Bodega Palo Alto

**URL analizada:** https://bodegapaloalto.com.ar/es/  
**Fecha:** Febrero 2025  
**Objetivo:** Identificar qué conservar, qué optimizar y qué mejorar para el nuevo sitio en Next.js.

---

## 1. Resumen del sitio actual

- **Tecnología detectada:** PHP (CodeIgniter), sitio clásico con vistas server-side.
- **Idiomas:** Español (ESP) e inglés (ENG) con rutas `/es/` y `/en/`.
- **Estructura de navegación:** Bodega (Fincas, Nuestro equipo) · Vinos (Tranquilos, Espumantes) · Contacto · SHOP (subdominio).
- **Contenido principal:** Hero con imagen, frase institucional, carrusel “Nuestros vinos” con 6 líneas (Benito A., Palo Alto, Yllum, Amadores, Cumbres del Plata, Efigenia).
- **Tienda:** shop.bodegapaloalto.com.ar (e-commerce separado).
- **Footer:** Dirección (Videla Aranda 502, Cruz de Piedra, Maipú, Mendoza), redes (Facebook, Instagram), aviso “Prohibida la venta a menores de 18 años”, crédito Ticma IT Solutions.

---

## 2. Qué conviene conservar

| Elemento | Motivo |
|----------|--------|
| **Bilingüismo ESP/ENG** | Mercado local e internacional; mantener rutas `/es/` y `/en/`. |
| **Líneas de producto** | Las 6 líneas (Benito A., Palo Alto, Yllum, Amadores, Cumbres del Plata, Efigenia) son el núcleo del relato de marca. |
| **Frase institucional** | “La pasión por las tierras mendocinas y la nobleza de la vid…” refuerza identidad y origen. |
| **Estructura de menú** | Bodega → Fincas / Nuestro equipo; Vinos → Tranquilos / Espumantes; Contacto; SHOP. Clara y reconocible. |
| **Datos de contacto** | Dirección completa (Videla Aranda 502, Cruz de Piedra, Maipú, Mendoza, Argentina). |
| **Redes sociales** | Facebook e Instagram como canales de contacto y comunidad. |
| **Aviso legal** | “Prohibida la venta a menores de 18 años” necesario para cumplimiento normativo. |
| **Separación web + shop** | Mantener sitio institucional y tienda en subdominio si la tienda ya funciona bien; se puede unificar después con mismo diseño. |
| **Imágenes del carrusel** | Assets de producto (Benito A., Palo Alto, Yllum, etc.) reutilizables en el nuevo sitio. |

---

## 3. Problemas críticos a corregir

### 3.1 Errores PHP expuestos al usuario

En **https://bodegapaloalto.com.ar/es/vinos** se muestran errores de PHP en pantalla:

- `Undefined variable: row` (views/vinos.php, línea 25).
- `Trying to get property 'categoria' of non-object`.

**Impacto:** Mala experiencia de usuario, imagen poco profesional y posible filtración de información del stack (CodeIgniter, rutas de archivos).

**Acción en el nuevo sitio:**  
- Desarrollar en Next.js sin exponer errores técnicos.  
- Páginas de error controladas (404, 500) con mensajes amigables.  
- Variables y datos validados antes de renderizar; no depender de “objetos que pueden no existir”.

### 3.2 Experiencia en móvil y accesibilidad

- No se pudo validar en detalle desde el fetch, pero sitios de esta época suelen tener:
  - Menús poco táctiles.
  - Textos o botones pequeños.
  - Contraste y foco insuficientes.

**Acción:** Diseño mobile-first en el nuevo sitio, touch targets ≥ 44px, contraste WCAG 2.1 y navegación por teclado.

### 3.3 Formulario de contacto

- Solo se ve un botón “Enviar”; no hay detalle de campos (nombre, email, mensaje, consentimiento).
- Riesgo: sin validación o feedback claro, envíos pueden fallar o no guardarse.

**Acción:** Formulario con campos claros, validación en cliente y servidor, mensaje de éxito/error y, si aplica, copy de “Prohibida la venta a menores” junto al envío.

---

## 4. Optimizaciones recomendadas

### 4.1 Rendimiento

| Actual (estimado) | Propuesta |
|------------------|-----------|
| Imágenes sin optimización automática | Next.js `<Image>` con formatos modernos (WebP/AVIF), tamaños responsive y lazy loading. |
| Cargas full page | App Router, código por rutas, prefetch de enlaces. |
| Sin indicio de caché/CDN en análisis | Despliegue en Vercel (CDN global, caché por defecto). |

### 4.2 SEO

- **Títulos:** Mantener convención “Sección \| Bodega Palo Alto” (o “Bodega Palo Alto \| Sección”) y títulos únicos por página.
- **Meta descripciones:** Una por página (home, bodega, vinos, contacto, cada línea de vino).
- **URLs:** Conservar estructura legible (`/es/vinos/palo-alto/...`, `/es/contacto`) y migrar con redirects 301 si cambian.
- **Idioma:** Etiquetar `lang` y `hreflang` (es, en) en el nuevo sitio.
- **Datos estructurados:** Añadir JSON-LD (Organization, LocalBusiness, Product para vinos si aplica).

### 4.3 Contenido e información

- **Bodega / Fincas / Nuestro equipo:** Incluir estas secciones en el nuevo sitio con textos e imágenes; evita páginas vacías o “en construcción”.
- **Contacto:** Además del formulario, ofrecer enlace a WhatsApp (react-icons) y a redes; dirección clicable (Google Maps).
- **Vinos:** Listado estable por línea y tipo (tranquilos/espumantes), sin depender de variables no definidas; enlaces a fichas o a la tienda.

### 4.4 Diseño y UX

- **Carrusel:** Sustituir por grid o lista en móvil para evitar gestos poco accesibles; en desktop se puede mantener carrusel con controles claros (anterior/siguiente) y teclado.
- **Selector de idioma:** Mantener ESP/ENG visible (ej. header); considerar indicador de idioma actual.
- **SHOP:** Botón o enlace destacado a shop.bodegapaloalto.com.ar; mismo estilo visual que el resto del sitio para coherencia de marca.
- **Footer:** Mantener dirección, redes, aviso de venta a mayores y crédito; opcional: enlace a política de privacidad y términos.

### 4.5 Seguridad y mantenimiento

- No exponer stack ni rutas internas (resuelto con Next.js y manejo de errores).
- Formulario de contacto: sanitización y rate limiting en API/Server Actions.
- Variables de entorno para URLs de API, email de contacto, etc. (ya previsto en el proyecto con `.env.example` y Vercel).

---

## 5. Checklist para el nuevo sitio (Next.js)

- [ ] Home con hero, frase institucional y bloque “Nuestros vinos” (6 líneas).
- [ ] Navegación: Bodega (Fincas, Nuestro equipo), Vinos (Tranquilos, Espumantes), Contacto, SHOP.
- [ ] Rutas bilingües `/es/` y `/en/` con `lang` y `hreflang`.
- [ ] Páginas de vinos sin errores; datos validados y fallbacks si no hay contenido.
- [ ] Contacto: formulario completo, dirección, WhatsApp y redes (Lucide + react-icons).
- [ ] Footer: dirección, redes, “Prohibida la venta a menores de 18 años”, crédito.
- [ ] Imágenes optimizadas (Next/Image), mobile-first y accesibilidad básica (contraste, foco, teclado).
- [ ] Meta por página y JSON-LD (Organization/LocalBusiness).
- [ ] Variables de entorno para contacto y URLs; deploy en Vercel.

---

## 6. Referencias

- Sitio actual: [bodegapaloalto.com.ar/es/](https://bodegapaloalto.com.ar/es/)
- Tienda: [shop.bodegapaloalto.com.ar](https://shop.bodegapaloalto.com.ar/)
- Contenido y estructura navegada y obtenida vía fetch del sitio (febrero 2025).

Este informe sirve como base para priorizar contenido, diseño y mejoras en el nuevo proyecto Next.js (PaloAltoWebsite).
