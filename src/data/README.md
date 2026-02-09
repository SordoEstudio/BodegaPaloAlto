# Datos por sección (JSON)

Cada archivo JSON contiene la información de un **componente o sección**. El mismo contrato de datos se usará cuando el contenido venga de la **API del CMS**.

## Estructura

- **`es/`** y **`en/`** – contenido por idioma.
- **`es/welcome.json`**, **`en/welcome.json`** – página de bienvenida (verificación de edad).
- **`es/header.json`**, **`en/header.json`** – cabecera (logo, navegación, shop, idiomas).
- **`es/footer.json`**, **`en/footer.json`** – pie (logo, dirección, redes, disclaimer, desarrollado por).
- **`es/home/`**, **`en/home/`** – secciones de la home:
  - `hero.json` – Hero principal (título, subtítulo, CTAs, imagen).
  - `carousel-lineas.json` – 6 líneas (Benito A., Palo Alto, Yllum, Amadores, Cumbres del Plata, Efigenia).
  - `banner-1.json`, `banner-2.json` – Banners (imagen, título, enlace).
  - `productos-destacados.json` – Productos destacados.
  - `contacto.json` – Dirección, redes, etc.

## Uso

La capa de datos está en **`src/lib/data.ts`**: expone `getWelcomeData(locale)`, `getHomeHeroData(locale)`, etc. Las páginas obtienen los datos ahí (o en el futuro desde `fetch(API_CMS + '/sections/...')` manteniendo los mismos tipos en **`src/types/sections.ts`**).

## Imágenes

Las URLs en los JSON (`imageSrc`) apuntan a rutas públicas (ej. `/1.jpg`, `/lineas/benito-a.jpg`). Esas imágenes deben existir en **`public/`** o llegar vía CMS. Al conectar el CMS, `imageSrc` serán las URLs que devuelva la API.
