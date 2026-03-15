# API pública de productos (consumo desde el sitio del cliente)

Documentación breve de los endpoints de productos que consume el **front del sitio del cliente** (no el CMS de administración). El cliente se identifica por **dominio** (header `Host`, `Origin` o `Referer`). El dominio desde el que se llama a la API **debe estar** en la lista **`domains[]`** del cliente en el CMS; si no, la API responde **403** con `code: "DOMAIN_NOT_ALLOWED"`.

**Base:** `GET https://<tu-dominio>/api/public/v1/...`

---

## 1. Listado de productos

**`GET /api/public/v1/products`**

Devuelve productos **publicados** del cliente identificado por dominio, con paginación y filtros opcionales.

### Query params

| Parámetro     | Tipo   | Por defecto | Descripción                                                                                                      |
| ------------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `locale`      | string | —           | Idioma del contenido (`es`, `en`, etc.). Si el cliente es mono-idioma, se ignora y se usa su locale por defecto. |
| `page`        | number | `1`         | Página.                                                                                                          |
| `limit`       | number | `20`        | Ítems por página (máx. 100).                                                                                     |
| `category`    | string | —           | ID de categoría (ObjectId); filtra por productos de esa categoría.                                               |
| `productType` | string | —           | Tipo de producto (ej. `wine`); filtra por tipo.                                                                  |
| `status`      | string | `published` | Estado; en la práctica el front suele usar `published`.                                                          |

### Respuesta 200

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "string",
        "slug": "string",
        "visible": true,
        "is_for_sale": false,
        "productType": "string | null",
        "locale": {
          "title": "string",
          "summary": "string",
          "description": "string",
          "seo": { "meta_title": "string", "meta_description": "string" }
        },
        "categories": ["ObjectId"],
        "tags": ["string"],
        "images": [{ "url": "string", "order": number, "alt": "string" }],
        "attachments": [{ "label": "string", "attachment_type": "url|image|file", "external_url?": "string", "media_id?": "string", "file_url?": "string" }],
        "attributes": { "key": "value" },
        "status": "string",
        "order": number,
        "featured": boolean,
        "price": number,
        "priceWholesale": number | undefined,
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

- **Listado:** los ítems en `products` traen `locale` ya resuelto al idioma pedido (o por defecto). En listado, `categories` son IDs; en el detalle por slug se devuelven poblados con `_id` y `name`.
- **Orden:** `order` ascendente, luego `createdAt` descendente.

### Errores

- **403** `DOMAIN_NOT_ALLOWED`: el dominio del request (p. ej. el sitio donde está el front) no está en `domains[]` del cliente. Solución: en el CMS, en el cliente, añadir ese dominio en la configuración de dominios.
- **500:** mensaje en `message`. Cliente no identificado o error de servidor.

---

## 2. Producto por slug

**`GET /api/public/v1/products/[slug]`**

Devuelve un único producto **publicado** por su `slug` (y cliente por dominio).

### Query params

| Parámetro    | Tipo   | Descripción                                                                 |
| ------------ | ------ | --------------------------------------------------------------------------- |
| `locale`     | string | Mismo criterio que en el listado.                                          |
| `clientSlug` | string | **Opcional.** En desarrollo (localhost) o cuando el host es el API: slug del cliente para identificar a qué cliente pertenecen los productos. En producción desde el dominio del sitio no suele hacer falta (se identifica por dominio). |

### Ejemplo de URL correcta (desarrollo con proxy)

Con `useProxy: true` y base `http://localhost:3000`:

```
GET http://localhost:3000/api/public/v1/products/paloalto-cabernet-sauvignon-reserva?locale=es&clientSlug=bodega-palo-alto
```

- **Path:** el `slug` del producto en la URL (si puede tener caracteres especiales, usar `encodeURIComponent(slug)`).
- **Query:** `locale` y, en localhost/desarrollo, `clientSlug` para que el backend sepa el cliente.

### Respuesta 200

```json
{
  "success": true,
  "data": {
    "_id": "string",
    "slug": "string",
    "visible": boolean,
    "is_for_sale": boolean,
    "productType": "string | null",
    "locale": { "title": "string", "summary": "string", "description": "string", "seo": {} },
    "categories": [{ "_id": "string", "name": "string" }],
    "tags": ["string"],
    "images": [{ "url": "string", "order": number, "alt": "string" }],
    "attachments": [{ "label": "string", "attachment_type": "url|image|file", "external_url?": "string", "media_id?": "string", "file_url?": "string" }],
    "attributes": {},
    "status": "string",
    "order": number,
    "featured": boolean,
    "price": number,
    "priceWholesale": number | undefined,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

- **Detalle:** `categories` viene poblado con `_id` y `name`. El resto de campos coincide con un ítem del listado.

### Errores

- **403** `DOMAIN_NOT_ALLOWED`: mismo criterio que en el listado (dominio no en `domains[]`).
- **404:** producto no encontrado o no publicado; `{ "success": false, "message": "Producto no encontrado" }`.
- **500:** error interno; mensaje en `message`.

---

## 3. Configuración de atributos (opcional)

**`GET /api/public/v1/product-attribute-config`**

Devuelve la configuración de **atributos** del cliente (solo lectura), útil para etiquetas en ficha de producto o filtros por tipo.

### Query params

| Parámetro     | Tipo   | Descripción                                    |
| ------------- | ------ | ---------------------------------------------- |
| `productType` | string | Opcional. Filtra configs por tipo de producto. |

### Respuesta 200

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "productType": "string | null",
      "attributes": [
        {
          "key": "string",
          "label": { "es": "string", "en": "string" },
          "type": "text|number|select|multiselect|...",
          "options": ["string"],
          "visible": boolean,
          "filterable": boolean,
          "required": boolean
        }
      ]
    }
  ]
}
```

Cada elemento de `data` es una config (por tipo de producto); `attributes` son las definiciones para mostrar o filtrar en el front.

---

## Resumen para el front

| Acción              | Método y ruta                                                  | Uso típico                         |
| ------------------- | -------------------------------------------------------------- | ---------------------------------- |
| Listar productos    | `GET /api/public/v1/products?locale=es&page=1&limit=20`        | Catálogo, grid, paginación.        |
| Filtros opcionales  | `&category=<id>&productType=wine`                              | Filtros por categoría y tipo.      |
| Detalle de producto | `GET /api/public/v1/products/<slug>?locale=es`                 | Ficha de producto.                 |
| Labels de atributos | `GET /api/public/v1/product-attribute-config?productType=wine` | Etiquetas y filtros por atributos. |

Todas las peticiones se hacen **desde el dominio del sitio del cliente**; el backend identifica el cliente por ese dominio y devuelve solo sus productos publicados.
