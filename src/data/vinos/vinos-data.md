# Datos de vinos - Estructura según modelo

Los datos han sido ajustados al modelo definido en `modelo.json`.

**Archivo de datos:** `vinos.json`

## Estructura del modelo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único (slug) |
| `linea` | string | Línea del vino (Benito A., Palo Alto, Yllum, etc.) |
| `varietal` | string[] | Array de variedades |
| `corte` | boolean | `true` si es blend/corte |
| `color` | string | tinto, blanco, rose |
| `crianza` | string | Gran Reserva, Reserva, Joven, Roble, Selección, etc. |
| `dosaje` | string | Para espumantes (Extra Brut, etc.) |
| `metodo_elaboracion` | string | Para espumantes (Champenoise, etc.) |
| `notas_de_cata` | object | `{ vista, nariz, boca }` |

## Líneas

- **Benito A.** – Gran Reserva (Ancellotta, Blend, Cabernet Franc)
- **Palo Alto** – Reserva, Joven, Roble (Cabernet Sauvignon, Chardonnay, Malbec, Pinot Noir, Satomi rosé, Sauvignon Blanc, Torrontés)
- **Yllum** – Gran Reserva, Reserva, Joven, Roble (Blend, Cabernet Sauvignon, Chardonnay, Malbec, Pinot Noir, Sauvignon Blanc, Torrontés)
- **Amadores** – Reserva (Cabernet Sauvignon, Chardonnay, Malbec, Pinot Noir)
- **Cumbres del Plata** – Selección (Cabernet Sauvignon, Malbec, Torrontés, Blanco, Tinto)
- **Efigenia** – Espumante Extra Brut (Pinot Noir / Chardonnay, método Champenoise)

## Ejemplo de ítem

```json
{
  "id": "paloalto-malbec-reserva",
  "linea": "Palo Alto",
  "varietal": ["Malbec"],
  "corte": false,
  "color": "tinto",
  "crianza": "Reserva",
  "dosaje": "",
  "metodo_elaboracion": "",
  "notas_de_cata": {
    "vista": "Se muestra con un color rojo cereza muy intenso...",
    "nariz": "Ofrece aromas a frutas rojas maduras como en mermelada...",
    "boca": "Se presenta como un vino que tiene una entrada agradable..."
  }
}
```
