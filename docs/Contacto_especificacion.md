# Página de Contacto — Especificación para desarrollo

## Contexto

Sitio institucional (Bodega Palo Alto / Destilería Magic Stone). Next.js App Router, Vercel. Mantener la estética y lineamientos del sitio (colores Palo Alto: primary `#c4996c`, secondary `#3b2319`, fondo `#faf9f7`; tipografía heading Cormorant, sans Ubuntu). Priorizar simple y funcional; sin librerías innecesarias.

---

## Estructura de la página

1. **Sección formulario de contacto**
   - Formulario con diseño limpio e institucional.
   - Imagen de fondo opcional con **parallax opcional** (mismo patrón que DestileriaTextHighlight: `backgroundImage` + `parallax?: boolean`).
   - Si no hay imagen, fondo claro (`bg-background`).

2. **Sección pantalla partida (split)**
   - **Mitad izquierda:** datos de contacto.
     - **Bodega Palo Alto:** Facebook, Instagram, ubicación (texto + link a Maps).
     - **Destilería Magic Stone:** Instagram.
   - **Mitad derecha:** mapa (iframe de Google Maps o link en botón).

---

## Formulario de contacto

### Campos

| Campo           | Tipo   | Obligatorio | Validación / notas                                      |
|-----------------|--------|-------------|---------------------------------------------------------|
| Nombre          | text   | Sí          | min 2 caracteres, trim                                 |
| Email           | email  | Sí          | formato válido                                         |
| Mensaje         | textarea | Sí        | min 10 caracteres                                      |
| Aceptación privacidad | checkbox | Sí    | required                                               |
| Teléfono        | tel    | No          | —                                                       |
| Tipo de consulta | select | No         | Opciones configurables en datos (ej. General, Bodega, Destilería) |
| **company** (honeypot) | text | —       | Oculto con CSS; si tiene valor no enviar (anti-spam)   |

### Envío

- **POST** ` /api/contact` (o ruta que exponga el backend).
- **Body JSON:**  
  `{ name, email, phone?, message, type?, locale, source_page?: "contacto", captcha_token?: "" }`
- No exponer secrets; no hardcodear claves de captcha. Captcha (Turnstile/reCAPTCHA) opcional en una segunda fase; por ahora honeypot suficiente si se prefiere mantener simple.

### Estados del formulario

- `idle` | `loading` | `success` | `error`
- Durante **loading:** botón deshabilitado, inputs deshabilitados, spinner en botón.
- En **success:** mensaje claro y reset del formulario.
- En **error:** mensaje genérico: *"Ocurrió un error. Por favor intentá nuevamente."* (sin detalle técnico del backend).

### Validación

- Validación en cliente antes de enviar (sin librería: funciones propias con trim, longitud mínima, regex email).
- No enviar si hay errores; mostrar mensajes por campo.
- Sanitizar: trim en todos los inputs.

### Accesibilidad

- Labels asociados a cada campo.
- `aria-invalid` en campos con error.
- `aria-live` para mensaje de estado (éxito/error).
- Navegación por teclado; botón deshabilitado durante loading.

### UX / estética

- Bordes sutiles, estados de foco visibles, hover en botón.
- Error en rojo accesible; éxito en verde sobrio.
- Responsive: layout vertical en móvil, inputs y botón full width.

---

## Datos de la página (JSON / tipo)

Estructura sugerida para datos (es/en):

- **Form:** título de sección, labels de campos, opciones de "tipo de consulta", texto del checkbox de privacidad, texto del botón, mensajes de éxito/error.
- **Form background (opcional):** `backgroundImage`, `backgroundImageAlt`, `parallax`.
- **Bodega:** `facebookUrl`, `instagramUrl`, `address`, `addressUrl` (link a Maps).
- **Destilería:** `instagramUrl`.
- **Mapa:** `mapEmbedUrl` (iframe src) o `mapLinkUrl` (fallback para abrir en nueva pestaña).
- **Títulos de bloques:** ej. "Bodega Palo Alto", "Destilería Magic Stone", "Ubicación" / "Location".

---

## Componentes sugeridos

- **ContactForm** (`/components/contact/ContactForm.tsx`): formulario controlado, estado `FormStatus`, honeypot, `handleSubmit` async, try/catch, timeout de red.
- **ContactPageContent** o sección split: mitad izquierda con dos bloques (Bodega + Destilería) con iconos (ej. react-icons: FaFacebookF, FaInstagram) y enlaces; mitad derecha con iframe del mapa o CTA al mapa.

---

## API route (Next.js)

- **POST** `/api/contact`
- Validar body (nombre, email, mensaje, checkbox); rechazar si honeypot viene con valor.
- Responder 200 con `{ success: true }` o 400 con mensaje genérico.
- Opcional: reenvío a backend externo vía `CONTACT_API_URL` en env; no exponer errores internos al cliente.

---

## Restricciones

- No usar `alert()`; no usar `any`.
- No exponer claves privadas ni mensajes detallados del backend.
- En caso de conflicto, priorizar lineamientos estéticos y funcionales del sitio sobre detalles del prompt genérico.
