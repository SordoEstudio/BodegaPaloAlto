 # Formularios — Guía de integración para el frontend

Esta guía describe cómo consumir la API pública de formularios desde cualquier frontend (React, Vue, HTML estático, etc.).

---

## Contexto de multi-cliente

El backend es multi-cliente. Los endpoints públicos identifican al cliente por **dominio** (cabecera `Host`): todas las llamadas devuelven datos del cliente cuyo dominio coincide con el que hace la petición.

No se requiere autenticación ni token. El origen del request es suficiente para identificar el cliente.

---

## Base URL

```
https://<tu-dominio>/api/public/v1/forms
```

En desarrollo local con el CMS corriendo:

```
http://localhost:3000/api/public/v1/forms
```

---

## Endpoints

### 1. Obtener schema del formulario

```
GET /api/public/v1/forms/{slug}
```

Devuelve la definición del formulario (campos, etiquetas, tipos) que el frontend necesita para renderizarlo dinámicamente. Solo se exponen formularios con `status: "published"`.

**Parámetros de ruta:**

| Parámetro | Tipo   | Descripción                              |
|-----------|--------|------------------------------------------|
| `slug`    | string | Identificador único del formulario       |

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "_id": "663f9a4c1a2b3c4d5e6f7a8b",
    "slug": "contacto",
    "name": { "es": "Formulario de contacto", "en": "Contact form" },
    "description": { "es": "Escribinos y te respondemos a la brevedad." },
    "fields": [
      {
        "id": "nombre",
        "type": "text",
        "label": { "es": "Nombre completo", "en": "Full name" },
        "placeholder": { "es": "Ej: Juan García" },
        "required": true,
        "order": 1,
        "width": "full"
      },
      {
        "id": "email",
        "type": "email",
        "label": { "es": "Correo electrónico", "en": "Email" },
        "required": true,
        "order": 2,
        "width": "half"
      },
      {
        "id": "area",
        "type": "select",
        "label": { "es": "Área de consulta" },
        "required": false,
        "order": 3,
        "width": "half",
        "options": [
          { "value": "ventas", "label": { "es": "Ventas", "en": "Sales" } },
          { "value": "soporte", "label": { "es": "Soporte", "en": "Support" } }
        ]
      },
      {
        "id": "mensaje",
        "type": "textarea",
        "label": { "es": "Mensaje" },
        "required": true,
        "order": 4,
        "width": "full"
      }
    ],
    "settings": {
      "success_message": {
        "es": "Gracias por tu mensaje. Te contactaremos pronto.",
        "en": "Thank you. We'll be in touch soon."
      }
    }
  }
}
```

---

### 2. Enviar respuesta

```
POST /api/public/v1/forms/{slug}/submit
Content-Type: application/json
```

Guarda las respuestas del usuario en la base de datos.

**Body (JSON):**

```json
{
  "nombre": "Juan García",
  "email": "juan@ejemplo.com",
  "area": "soporte",
  "mensaje": "Necesito ayuda con...",
  "_hp": ""
}
```

> **Importante:** el campo `_hp` (honeypot) debe incluirse siempre con valor vacío. Nunca mostrarlo al usuario. Si llega con valor, el backend lo detecta como bot y descarta silenciosamente el envío.

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "data": {
    "message": "Gracias por tu mensaje. Te contactaremos pronto."
  }
}
```

El `message` corresponde al `settings.success_message` del idioma por defecto (`es`). El frontend puede mostrarlo directamente al usuario.

---

## Tipos de campo

| `type`        | Control de UI sugerido             | Valor enviado                  |
|---------------|------------------------------------|--------------------------------|
| `text`        | `<input type="text">`              | string                         |
| `textarea`    | `<textarea>`                       | string                         |
| `email`       | `<input type="email">`             | string                         |
| `phone`       | `<input type="tel">`               | string                         |
| `number`      | `<input type="number">`            | string o número                |
| `date`        | `<input type="date">`              | string `YYYY-MM-DD`            |
| `select`      | `<select>`                         | string (valor de la opción)    |
| `multiselect` | checkboxes o `<select multiple>`   | array de strings               |
| `radio`       | `<input type="radio">`             | string (valor de la opción)    |
| `checkbox`    | `<input type="checkbox">`          | boolean o `"true"` / `"false"` |

Para campos con `options` (select, multiselect, radio), el valor a enviar es el campo `value` de la opción elegida, no su `label`.

El campo `width` (`"full"` o `"half"`) es una sugerencia de layout para el frontend. No afecta la lógica de envío.

---

## Errores

| Código | Causa                                                    |
|--------|----------------------------------------------------------|
| `403`  | Dominio no registrado o cliente inactivo                 |
| `404`  | Formulario no encontrado o no publicado                  |
| `422`  | Campos requeridos vacíos (ver `details` en la respuesta) |
| `429`  | Rate limit: máximo 5 envíos por IP por minuto            |
| `500`  | Error interno del servidor                               |

**Ejemplo de respuesta 422:**

```json
{
  "success": false,
  "error": "Datos incompletos",
  "details": [
    "El campo \"Nombre completo\" es obligatorio",
    "El campo \"Mensaje\" es obligatorio"
  ]
}
```

El array `details` puede usarse para mostrar errores campo por campo. Relacionar cada mensaje con el `label.es` del campo correspondiente.

---

## CORS

Los endpoints aceptan requests desde cualquier origen registrado como dominio del cliente. El preflight `OPTIONS` está habilitado.

Si hacés requests desde un dominio diferente al del cliente (ej. un front en localhost apuntando a un CMS en producción), el request será rechazado con 403 porque el dominio no coincide con ningún cliente registrado.

---

## Ejemplo de implementación (React)

```jsx
import { useEffect, useState } from 'react';

const API_BASE = 'https://tu-dominio.com/api/public/v1/forms';

export function DynamicForm({ slug, locale = 'es' }) {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  useEffect(() => {
    fetch(`${API_BASE}/${slug}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setForm(res.data);
          // Inicializar valores
          const initial = {};
          for (const field of res.data.fields) {
            initial[field.id] = field.type === 'multiselect' ? [] : '';
          }
          setValues(initial);
        }
      });
  }, [slug]);

  const handleChange = (fieldId, value) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleMultiselect = (fieldId, optionValue, checked) => {
    setValues((prev) => {
      const current = prev[fieldId] ?? [];
      return {
        ...prev,
        [fieldId]: checked
          ? [...current, optionValue]
          : current.filter((v) => v !== optionValue),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors([]);

    const body = { ...values, _hp: '' }; // honeypot siempre vacío

    try {
      const res = await fetch(`${API_BASE}/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
      } else {
        setErrors(data.details ?? [data.error]);
        setStatus('error');
      }
    } catch {
      setErrors(['Error de red. Intentá de nuevo.']);
      setStatus('error');
    }
  };

  if (!form) return <p>Cargando...</p>;

  if (status === 'success') {
    return <p>{form.settings.success_message?.[locale] ?? form.settings.success_message?.es}</p>;
  }

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={handleSubmit}>
      {sortedFields.map((field) => (
        <FieldControl
          key={field.id}
          field={field}
          value={values[field.id]}
          locale={locale}
          onChange={handleChange}
          onMultiselect={handleMultiselect}
        />
      ))}

      {/* Honeypot — ocultar con CSS, no con display:none (algunos bots lo detectan) */}
      <input
        type="text"
        name="_hp"
        value=""
        onChange={() => {}}
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        tabIndex={-1}
        autoComplete="off"
      />

      {errors.length > 0 && (
        <ul>
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}

function FieldControl({ field, value, locale, onChange, onMultiselect }) {
  const label = field.label?.[locale] ?? field.label?.es ?? field.id;
  const placeholder = field.placeholder?.[locale] ?? field.placeholder?.es ?? '';

  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label>{label}{field.required && ' *'}</label>
          <textarea
            value={value}
            placeholder={placeholder}
            required={field.required}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label>{label}{field.required && ' *'}</label>
          <select value={value} required={field.required} onChange={(e) => onChange(field.id, e.target.value)}>
            <option value="">Seleccionar...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label?.[locale] ?? opt.label?.es}
              </option>
            ))}
          </select>
        </div>
      );

    case 'multiselect':
      return (
        <div>
          <label>{label}{field.required && ' *'}</label>
          {field.options?.map((opt) => (
            <label key={opt.value}>
              <input
                type="checkbox"
                checked={(value ?? []).includes(opt.value)}
                onChange={(e) => onMultiselect(field.id, opt.value, e.target.checked)}
              />
              {opt.label?.[locale] ?? opt.label?.es}
            </label>
          ))}
        </div>
      );

    case 'radio':
      return (
        <div>
          <label>{label}{field.required && ' *'}</label>
          {field.options?.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                required={field.required}
                onChange={(e) => onChange(field.id, e.target.value)}
              />
              {opt.label?.[locale] ?? opt.label?.es}
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div>
          <label>
            <input
              type="checkbox"
              checked={!!value}
              required={field.required}
              onChange={(e) => onChange(field.id, e.target.checked)}
            />
            {label}
          </label>
        </div>
      );

    default:
      // text, email, phone, number, date
      return (
        <div>
          <label>{label}{field.required && ' *'}</label>
          <input
            type={field.type === 'phone' ? 'tel' : field.type}
            value={value}
            placeholder={placeholder}
            required={field.required}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </div>
      );
  }
}
```

---

## Internacionalización

Los campos `name`, `description`, `label`, `placeholder` y `success_message` son objetos con claves de idioma (`es`, `en`, etc.):

```json
{ "es": "Nombre completo", "en": "Full name" }
```

Siempre existe `es`. Los demás idiomas son opcionales. Si el idioma solicitado no existe, usá `es` como fallback:

```js
const label = field.label?.[locale] ?? field.label?.es ?? field.id;
```

---

## Notas de seguridad

- El backend valida todos los campos requeridos. La validación en el frontend es complementaria (mejor UX), no reemplaza la del servidor.
- El backend filtra las claves del body: solo acepta los `id` definidos en `fields`. No es posible inyectar campos arbitrarios.
- El backend sanitiza todos los strings eliminando etiquetas HTML.
- No exponer ni loguear el campo `_hp` en el cliente.
