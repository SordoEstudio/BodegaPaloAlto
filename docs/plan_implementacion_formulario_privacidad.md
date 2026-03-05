# Plan de implementación — Formulario de contacto y privacidad (solo frontend)

Basado en `info_formulario_politicas.md`, adaptado a **proyecto solo frontend** y criterio: **cumplir lo legal sin complejizar** un formulario de contacto.

---

## Criterios adoptados

| Del instructivo | Decisión | Motivo |
|-----------------|----------|--------|
| **Captcha** (Turnstile/hCaptcha) | **No implementar** | Evitar complejidad; el honeypot ya ayuda contra spam básico. |
| **Rate limiting, logs, DELETE /api/contact** | **No (backend)** | Proyecto es solo frontend; queda del lado del backend real. |
| **Checkbox + enlace a política** | **Sí** | Requerido para consentimiento informado. |
| **Página de Política de Privacidad** | **Sí** | Necesaria para cumplimiento y enlace desde formulario/footer. |
| **Honeypot** | **Ya está** | `company` oculto en `ContactForm.tsx`; mantener. |
| **Validación frontend del consentimiento** | **Ya está** | `privacy` required + validación en `validate()`. |
| **Límite de tamaño del mensaje** | **Sí (opcional)** | `maxLength` en textarea; protección básica sin backend. |

---

## Estado actual (resumen)

- **Formulario** (`ContactForm.tsx`): checkbox de privacidad obligatorio, honeypot `company`, validación frontend, envío a `/api/contact`.
- **Textos del checkbox**: provienen del CMS (componente `formulario_contacto`, `data._labels.privacy`, `privacyPrefix`, `privacyLinkText`, `privacySuffix`) con enlace a la política.
- **Footer**: no tiene enlace a Política de Privacidad.
- **Página de política**: no existe (`/politica-de-privacidad`).

---

## Plan de tareas (solo frontend)

### 1. Crear página de Política de Privacidad

- **Ruta**: `/[locale]/politica-de-privacidad` (ej. `/es/politica-de-privacidad`, `/en/politica-de-privacidad`).
- **Contenido**: usar el texto de la sección 1 del doc (Política completa), con placeholders reemplazables por datos de la empresa (nombre, domicilio, email de contacto).
- **Implementación**:
  - Página estática (o con contenido desde JSON/i18n para ES/EN).
  - Metadata: `title` "Política de Privacidad" / "Privacy Policy", `description` acorde.
  - SEO: página indexable, misma estructura que el resto del sitio (locale, layout).
- **Ubicación sugerida**: `src/app/[locale]/politica-de-privacidad/page.tsx` y, si se usa i18n, datos en `src/data/es/` y `src/data/en/` (o un único JSON con secciones por idioma).

### 2. Enlace a la política en el formulario (checkbox)

- **Requisito legal**: que el texto del consentimiento enlace explícitamente a la política.
- **Opciones**:
  - **A)** Mantener el texto actual en los JSON y en el componente renderizar: texto corto + enlace “Política de Privacidad” a `/${locale}/politica-de-privacidad`. Ejemplo: “Acepto la [Política de Privacidad](enlace) y autorizo el tratamiento de mis datos personales conforme a lo establecido en la misma.”
  - **B)** En los JSON dejar dos cadenas: `privacyBeforeLink`, `privacyLinkText`, `privacyAfterLink` y en el componente armar la frase con `<Link>` en el medio.
- **Recomendación**: A con textos en JSON por idioma (ej. `labels.privacyPrefix`, `labels.privacyLinkText`, `labels.privacySuffix`) para no hardcodear en el componente.
- **Accesibilidad**: el `<label>` del checkbox debe seguir asociado al input y el enlace debe ser focusable y descriptivo (evitar “aquí”).

### 3. Enlace en el Footer

- Añadir en el pie de página un enlace visible: “Política de Privacidad” / “Privacy Policy” que apunte a `/${locale}/politica-de-privacidad`.
- Puede ir en la zona del disclaimer / desarrollado por, o en una línea de “Legales” si se prefiere.
- Si el footer se alimenta de JSON, añadir en `footer.json` (es/en) una entrada para el enlace de privacidad (label + url o path) y consumirla en `Footer.tsx`.

### 4. Validación frontend (revisión)

- **Consentimiento**: ya se valida `state.privacy` y se muestra error; no enviar si no está aceptado. Mantener.
- **Nombre/email/mensaje**: ya hay validación y mensajes de error. Mantener.
- No añadir lógica de backend (eso queda fuera del alcance frontend).

### 5. Límite de longitud del mensaje (recomendado)

- Añadir `maxLength` al `<textarea>` del mensaje (ej. 2000 o 3000 caracteres) para alinearse con “limitar tamaño de mensajes” del doc.
- Opcional: mostrar contador “X / 2000” para UX.
- Esto es solo frontend; el backend que reciba el formulario puede imponer su propio límite.

### 6. No implementar (por este plan)

- Captcha.
- Rate limiting, logs, almacenamiento de consentimiento, DELETE de contactos (backend).
- Cambios en `/api/contact` (tratado como recurso externo; quien lo implemente puede validar `privacy` y guardar consentimiento).

---

## Orden sugerido de implementación

1. **Página de política**  
   Crear ruta, contenido (ES/EN) y metadata.

2. **Enlace en el checkbox del formulario**  
   Ajustar textos en `contacto.json` (es/en) y en `ContactForm.tsx` para que el texto del consentimiento incluya el enlace a `/[locale]/politica-de-privacidad`.

3. **Enlace en el Footer**  
   Añadir “Política de Privacidad” en el footer (con dato en footer.json si aplica).

4. **Opcional: maxLength en mensaje**  
   Añadir `maxLength` al textarea y, si se desea, contador de caracteres.

---

## Checklist final (cumplimiento legal mínimo)

- [ ] Página “Política de Privacidad” publicada y accesible por URL estable.
- [ ] Checkbox obligatorio con texto que incluya enlace a esa política.
- [ ] Enlace a la política en el footer.
- [ ] Validación frontend que impida enviar sin aceptar la política.
- [ ] Honeypot mantenido (ya presente).
- [ ] Sin captcha (decisión de producto; el resto cubre lo esencial para un formulario de contacto simple).

---

## Nota sobre backend

El doc menciona verificación de `privacyConsent` en backend, almacenar consentimiento, rate limiting, etc. **Todo eso queda fuera de este plan** por ser proyecto frontend. Quien implemente el backend (p. ej. Vercel serverless o otro servicio) puede usar el instructivo original para esa parte.
