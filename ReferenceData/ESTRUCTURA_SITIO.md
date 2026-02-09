# Estructura del Sitio Web - Bodega Palo Alto

## Descripción General
Estructura planteada en base al sitio actual, con las mejoras y cambios planeados para la nueva versión del sitio web.

**Documentos de referencia:**  
- [Informe análisis sitio original](../docs/INFORME-SITIO-ORIGINAL-BODEGA-PALO-ALTO.md) — qué conservar, optimizar y corregir.

---

## Estrategia de datos (origen del contenido)

El sitio consumirá datos en dos fases:

1. **Fase inicial — JSON**  
   - Contenido e imágenes servidos desde archivos/datos JSON (local o estáticos).  
   - Permite desarrollar y maquetar toda la estructura y componentes sin depender del CMS.  
   - Útil para definir tipos, rutas y fallbacks.

2. **Fase producción — CMS propio**  
   - El **CMS ya está desarrollado y en funcionamiento**.  
   - **Imágenes:** se obtendrán desde el CMS (URLs de medios gestionados por el cliente).  
   - **Contenido editable:** textos, descripciones, metadatos, banners, etc. editables por el cliente desde el CMS.  
   - La capa de datos del front (servicios/API) debe abstraer el origen: mismo contrato de datos tanto para JSON como para CMS, cambiando solo el origen (JSON → API del CMS).

**Implicaciones:**
- Diseñar componentes que reciban contenido por props/context (no hardcodeado).  
- Definir tipos/interfaces compartidos entre datos JSON y respuestas del CMS.  
- Imágenes siempre vía URL (Next.js `Image` con `src` desde CMS o JSON).  
- No exponer errores técnicos; validar datos antes de renderizar y usar fallbacks si faltan (alineado con el informe del sitio actual).

---

## Consideraciones del informe del sitio actual

Tener en cuenta para el desarrollo:

- **Conservar:** bilingüismo ES/EN, 6 líneas de producto (Benito A., Palo Alto, Yllum, Amadores, Cumbres del Plata, Efigenia), frase institucional, datos de contacto (Videla Aranda 502, Cruz de Piedra, Maipú, Mendoza), redes (Facebook, Instagram), aviso “Prohibida la venta a menores de 18 años”, enlace a SHOP (subdominio).
- **Corregir:** sin errores expuestos al usuario; validación de datos y fallbacks; formularios con validación y feedback.
- **Optimizar:** imágenes con Next.js `Image`, SEO (meta, hreflang, JSON-LD), mobile-first, accesibilidad (contraste, teclado, touch targets). Contacto: incluir WhatsApp y dirección clicable (mapa).
- **Navegación:** Bodega (Fincas, Nuestro equipo) · Vinos (Tranquilos, Espumantes) · Contacto · SHOP.

---

## Header (Cabecera)

### Componentes:
- **Logo Palo Alto**: Logo principal de la marca
- **Destilería**: Enlace/sección a la destilería
- **Navbar**: Menú de navegación principal
- **Shop**: Enlace al carrito/tienda
- **Idioma**: Selector de idioma (ES/EN)

---

## Inicio (Home)

### Secciones:

1. **Hero**
   - Sección principal de bienvenida
   - Imagen/video destacado
   - Call-to-action principal

2. **Carrousel Líneas**
   - Carrusel de productos por líneas (contenido: JSON → CMS)
   - 6 líneas: Benito A., Palo Alto, Yllum, Amadores, Cumbres del Plata, Efigenia
   - En móvil valorar grid como alternativa al carrusel (accesibilidad, informe)
   - Navegación entre diferentes líneas de productos

3. **Banner**
   - Banner promocional/informativo

4. **Banner**
   - Segundo banner (promocional/informativo)

5. **Productos Destacados**
   - Grid/galería de productos destacados
   - Enlaces a páginas individuales de productos

6. **Contacto**
   - Formulario de contacto (campos claros, validación, feedback éxito/error)
   - Información de contacto; enlace WhatsApp y redes (Lucide + react-icons)

---

## Bodega

### Secciones:

1. **Equipo**
   - Información sobre el equipo de la bodega
   - Perfiles de miembros clave

2. **Finca 1**
   - Información sobre la primera finca
   - Ubicación, características, historia

3. **Finca 2**
   - Información sobre la segunda finca
   - Ubicación, características, historia

---

## Productos

### Secciones:

1. **Producto**
   - Listado/grid de productos
   - Vista general de todos los productos disponibles

2. **Filtros**
   - **Línea:** Benito A. / Palo Alto / Yllum / Amadores / Cumbres del Plata / Efigenia (espumantes) — 6 líneas según sitio actual.
   - Sistema de filtrado de productos
   - Por Tipo: Vino / Gin
   - Uva : Tinto, blanco, rosado
   - Tipo: Reserva, Roble, Joven, Reserva, Gran Reserva, Seleccion.
   - Varietal: Malbec, tanat, ancellotta, blenc, cavernet franc, Cabernet Sauvignon
    Chardonnay, Pinot Noir, Roble, Satomi, Sauvignon Blanc, Torrontes

3. **Categorías**
   - Navegación por categorías de productos
   - Organización de productos por tipo/línea

---

## Producto (Página Individual)

### Secciones:

1. **Galería**
   - Imágenes del producto
   - Vista ampliada
   - Zoom y navegación

2. **Información**
   - Descripción del producto
   - Características principales
   - Detalles de producción

3. **Ficha Técnica (PDF)**
   - Descarga de ficha técnica en formato PDF
   - Información detallada del producto

---

## Destilería

### Secciones:

1. **Historia**
   - Historia de la destilería
   - Orígenes y evolución

2. **Información**
   - Información general sobre la destilería
   - Procesos, métodos, filosofía

3. **Galería**
   - Imágenes de la destilería
   - Procesos de producción
   - Instalaciones

---

## Footer (Pie de Página)

### Componentes:

1. **Contactos**
   - Información de contacto (origen: JSON → CMS)
   - Dirección: Videla Aranda 502, Cruz de Piedra, Maipú, Mendoza, Argentina (enlace a mapa)
   - Teléfono, email, WhatsApp (react-icons para marcas)
   - Horarios de atención (si aplica)

2. **Redes Sociales**
   - Enlaces a redes sociales: Facebook, Instagram (según sitio actual; ampliable desde CMS)

3. **Form (Desplegable)**
   - Formulario de contacto desplegable
   - Acceso rápido desde el footer
   - Validación y mensaje de éxito/error; considerar aviso “Prohibida la venta a menores de 18 años” junto al envío

4. **Aviso legal**
   - “Prohibida la venta a menores de 18 años” (conservar según informe)
   - Crédito desarrollo (ej. Ticma) u otro según definición del cliente

---

## Notas de Implementación

- La estructura debe ser **responsive** y adaptable a diferentes dispositivos (mobile-first).
- Se mantiene la funcionalidad de **cambio de idioma (ES/EN)** en todas las secciones; rutas `/es/` y `/en/`, con `lang` y `hreflang` para SEO.
- El **shop** (subdominio) debe estar integrado y accesible desde cualquier página; mismo criterio visual que el sitio institucional.
- Las **fichas técnicas en PDF** deben estar disponibles para todos los productos (origen: JSON luego CMS).
- La navegación debe ser intuitiva y clara en todas las secciones.
- **Origen de datos:** primero JSON para desarrollo; en producción, imágenes y contenido editable desde el CMS propio. Los componentes deben consumir datos por props/API, sin contenido hardcodeado, para que el cliente pueda editar desde el CMS.

---

## Mejoras y Cambios Planeados

- Mejor organización del contenido
- Navegación más intuitiva
- Optimización de carga de imágenes (Next.js `Image`, origen CMS/JSON)
- Mejora en la experiencia de usuario (accesibilidad, formularios con validación, sin errores expuestos)
- Formularios más accesibles y funcionales (contacto con WhatsApp y redes en footer; aviso “Prohibida la venta a menores de 18 años”)
