FUNCIONALIDAD
  [ ] Todas las páginas cargan sin errores en producción (smoke test)
  [ ] Formulario de contacto envía y recibe confirmación
  [ ] Verificacion de edad (/bienvenida) funciona y redirige correctamente
  [ ] Filtros de productos: aplicar, limpiar, combinaciones
  [ ] Detalle de producto: imágenes, info técnica, navegación de vuelta
  [ ] Cambio de idioma ES/EN en todas las páginas
  [ ] Links del footer funcionan
  [ ] Menú mobile: apertura, cierre, navegación

  RENDIMIENTO
  [ ] next build sin errores ni warnings críticos
  [ ] Lighthouse > 80 en Performance, SEO, Accessibility
  [ ] LCP < 2.5s en conexión 4G simulada
  [ ] Imágenes hero tienen priority prop
  [ ] No hay imágenes sin dimensiones definidas (CLS)

  SEO
  [ ] <title> y <meta description> únicos en cada página
  [ ] robots.txt existe y permite crawlers
  [ ] sitemap.xml generado con rutas bilingues
  [ ] Open Graph tags en páginas de producto (ya implementado en generateMetadata)
  [ ] <html lang="es|en"> dinámico según locale

  ACCESIBILIDAD
  [ ] Navegación por teclado funciona en todo el sitio
  [ ] Contraste de texto cumple WCAG AA (4.5:1 mínimo)
  [ ] Todos los <img> tienen alt descriptivo
  [ ] Formulario tiene labels asociados a inputs
  [ ] No hay outline: none sin alternativa de foco visible

  SEGURIDAD
  [ ] Variables de entorno: ningún secret en NEXT_PUBLIC_*
  [ ] Headers HTTP de seguridad configurados (X-Frame-Options, etc.)
  [ ] Rate limiting en /api/public/v1/forms/*
  [ ] CORS configurado correctamente para dominios de producción
  [ ] NEXT_PUBLIC_USE_PROXY está correctamente configurado para prod

  INFRAESTRUCTURA / DEPLOY
  [ ] Variables de entorno de producción seteadas en Vercel
  [ ] Dominio personalizado configurado con SSL
  [ ] NEXT_PUBLIC_API_URL apunta al CMS de producción (no staging)
  [ ] Dominios permitidos en el CMS (domains[]) incluyen el dominio de prod
  [ ] Verificar logs de producción después del primer deploy

  CONTENIDO
  [ ] Texto en ES y EN revisado (sin traducciones faltantes ni claves vacías)
  [ ] Imágenes finales subidas al CMS (no imágenes de prueba)
  [ ] Datos de contacto correctos (email, teléfono, redes sociales)
  [ ] Política de privacidad actualizada y con fecha
  [ ] Links de redes sociales correctos