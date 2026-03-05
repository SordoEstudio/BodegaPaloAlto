# Diseño: Carrusel de promociones (CMS)

Objetivo: componente de carrusel para **promociones**, separado del contenido editorial, editable desde el CMS. Un **componente carrusel por página** con **N slides**; cada slide puede ser tipo **solo imagen** (imagen + URL) o **imagen con texto** (todos los campos). Las validaciones y qué campos mostrar en el editor son responsabilidad del **CMS**. En front solo recibimos datos y renderizamos. Flechas e indicadores **solo visibles al hacer hover**.

---

## 1. Dos tipos de slide (conceptuales)

| Tipo | Descripción | Lo que recibe el front |
|------|-------------|------------------------|
| **solo_imagen** | Imagen ya diseñada (texto incluido en la imagen). Clic = ir a URL. Sin overlay. | `img_imagen`, `txt_alt_imagen`, `link_destino_optional` (url). |
| **imagen_con_texto** | Imagen de fondo (opcional) + título, subtítulo, detalle y botón (label + URL) editables. | Imagen opcional + todos los campos de texto y botón: `txt_titulo_optional`, `txt_subtitulo_optional`, `txt_detalle_optional`, `txt_label_boton_optional`, `link_boton_optional`. |

---

## 2. Validaciones en el CMS (no en front)

- Si el slide es **solo_imagen**: el CMS **no muestra** los campos de texto (título, subtítulo, detalle, botón). El editor solo ve imagen y URL.
- Si el slide es **imagen_con_texto**: el CMS muestra todos los campos; el editor rellena los que quiera.
- El front **recibe siempre la misma estructura** por slide (todos los campos opcionales). Para **solo_imagen** ignoramos título/subtítulo/detalle/botón; para **imagen_con_texto** usamos los que vengan. No validamos en front.

---

## 3. Modelo: un carrusel por página, N slides (de uno u otro tipo)

- **Un componente** tipo `carousel_promociones` por página.
- Ese componente tiene **lista_slides** con **N** ítems.
- Cada ítem tiene un **tipo** (`solo_imagen` | `imagen_con_texto`) y los datos correspondientes.
- En un mismo carrusel pueden mezclarse slides solo imagen y slides con texto.

---

## 4. Estructura de datos que recibe el front

Prefijos alineados con el resto del CMS: `txt_`, `img_`, `link_`, `lista_`.

```json
{
  "lista_slides": [
    {
      "tipo_slide": "solo_imagen",
      "img_imagen": "https://...",
      "txt_alt_imagen": "Promo verano",
      "link_destino_optional": { "url": "https://...", "label": "Ver más" }
    },
    {
      "tipo_slide": "imagen_con_texto",
      "img_imagen": "https://...",
      "txt_alt_imagen": "Oferta",
      "txt_titulo_optional": "Título",
      "txt_subtitulo_optional": "Subtítulo",
      "txt_detalle_optional": "Detalle opcional",
      "txt_label_boton_optional": "Ver oferta",
      "link_boton_optional": { "url": "https://...", "label": "Ver oferta" }
    }
  ],
  "_configuracion": {
    "autoplay": true,
    "intervalo_segundos": 5,
    "pertenece_destileria": false
  }
}
```

- **solo_imagen**: el front usa solo `img_imagen`, `txt_alt_imagen`, `link_destino_optional`. Si hay URL, todo el slide es clickeable.
- **imagen_con_texto**: el front usa imagen (opcional) + todos los campos de texto y botón que vengan; si no hay imagen, overlay sobre fondo sólido o color de marca.
- **`_configuracion.pertenece_destileria`** (o `es_destileria`): si es `true`, el carrusel usa estilos Magic Stone (destilería): botón `bg-magic-stone-primary` con texto blanco, tipografía `font-destileria-hero` en títulos, fondo sólido sin imagen `bg-magic-stone-bg`. Si es `false` o no está, se usan estilos Palo Alto (bodega).

---

## 5. UI del carrusel en front

- **Flechas** (anterior/siguiente): visibles **solo al hacer hover** sobre el carrusel.
- **Indicadores** (puntos por slide): visibles **solo al hacer hover** sobre el carrusel.
- Autoplay e intervalo se leen de `_configuracion`.

---

## 6. Resumen de decisiones

| Tema | Decisión |
|------|----------|
| Validaciones (qué campos mostrar) | En el **CMS**. Nosotros recibimos todos los campos; según `tipo_slide` usamos solo los que corresponden. |
| Estructura por slide | Cada slide tiene `tipo_slide` + imagen + URL (solo_imagen) o todos los campos (imagen_con_texto). |
| Cantidad de carruseles | **Un componente carrusel por página**, con **N** slides (de uno u otro tipo). |
| Flechas e indicadores | **Solo en hover**. |

---

## 7. Esquema del flujo

```
CMS:
  - Un componente "Carousel promociones" por página.
  - Por cada slide: elegir tipo (solo_imagen | imagen_con_texto).
  - Si solo_imagen: formulario muestra solo imagen + URL (validación/ocultar campos en CMS).
  - Si imagen_con_texto: formulario muestra imagen opcional + título, subtítulo, detalle, botón.

Front:
  - Recibe data con lista_slides (cada uno con tipo_slide y todos los campos opcionales).
  - Renderiza slide según tipo_slide: solo imagen + link o overlay con textos/botón.
  - Flechas e indicadores con opacity/visibility que pasan a visibles solo en :hover (o group-hover).
```

---

## 8. Próximos pasos (cuando se implemente)

1. Definir tipo en CMS: `carousel_promociones` (o `promo_carousel`).
2. En el CMS: formulario por slide según `tipo_slide` (mostrar/ocultar campos).
3. En front: componente React del carrusel, mapper `data` → props, estilos para flechas/indicadores solo en hover.
4. Registrar en `cms-layout-map` y asignar a la(s) página(s) que correspondan (un carrusel por página).
