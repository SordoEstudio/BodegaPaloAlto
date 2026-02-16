# Componentes no usados (tree-shaking)

Estos archivos fueron movidos aquí porque **no tienen referencias** en el proyecto actual. Pueden eliminarse de forma segura cuando se confirme que no se van a reutilizar.

| Archivo | Motivo |
|---------|--------|
| `bodega/BodegaFinca.tsx` | Sustituido por DestileriaStorySplit en BodegaFincasSection |
| `bodega/BodegaFincasTabs.tsx` | Sustituido por selector de finca + DestileriaStorySplit |
| `destileria/DestileriaPromise.tsx` | Destilería usa DestileriaTextHighlight para la promesa |
| `GlassCard.tsx` | No importado en ningún lugar |

**Para eliminar:** borrar la carpeta `src/_unused_components/` cuando se decida no recuperar estos componentes.
