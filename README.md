# Palo Alto Website

Proyecto [Next.js](https://nextjs.org) con **pnpm**, React, Tailwind CSS, [Lucide React](https://lucide.dev) (iconos) y [React Icons](https://react-icons.github.io/react-icons/) (marcas: WhatsApp, redes sociales, contactos).

## Requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)

## Inicio rápido

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

1. Copia `.env.example` a `.env.local`.
2. Rellena las variables que uses (las que llevan `NEXT_PUBLIC_` están disponibles en el cliente).

**Despliegue en Vercel:**

- En el proyecto de Vercel: **Settings → Environment Variables**.
- Añade las mismas variables que en `.env.local` (Production, Preview, Development según necesites).

## Iconos

- **Lucide React:** `import { IconName } from 'lucide-react'`
- **React Icons (marcas):** `import { FaWhatsapp, FaInstagram } from 'react-icons/fa'` — ver [react-icons](https://react-icons.github.io/react-icons/icons/fa/) para más iconos de marcas.

## Build y deploy

```bash
pnpm build
pnpm start
```

Para Vercel: conecta el repositorio en [vercel.com](https://vercel.com); el build se detecta automáticamente.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
