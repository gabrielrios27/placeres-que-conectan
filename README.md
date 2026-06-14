# 🫒 Placeres que Conectan

Sitio web del negocio familiar **Placeres que Conectan — Delicias Regionales San Juan**
(aceite de oliva, aceitunas, aceto y dulces). Landing de una sola página con una
**calculadora de paquetes** y checkout por **WhatsApp**.

Construido con **Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion + lucide-react**.
Sin APIs externas, sin claves, sin geolocalización: todo corre en el navegador.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist listo para deploy
npm run preview  # sirve el build
```

## Procesar las fotos de producto (opcional, ya hecho)

Las fotos crudas van en `imagenes/` (renombradas según el producto). Para regenerar
los PNG sin fondo en `public/productos/`:

```bash
pip install rembg pillow onnxruntime
python scripts/procesar_imagenes.py
```

## Cómo actualizar precios / productos

Todo el catálogo y los precios viven en un solo archivo:
**`src/data/productos.ts`**. Editás el número de `precio` y listo.

- Para sumar la foto de un producto que hoy usa placeholder: dejá el PNG en
  `public/productos/` con el mismo nombre que figura en `imagen` (ej.
  `aceite-oliva-5000.png`). El componente lo detecta solo.

## Tema dinámico

El color del sitio cambia solo según **hora del día** (luminosidad) y **estación**
(acentos + partículas, hemisferio sur). Hay un **toggle** claro / oscuro / auto en el
header. Las 16 paletas exactas están en `src/lib/temas.ts`.

## Deploy

Listo para **Netlify** (incluye `netlify.toml`) o **Vercel**:
conectá el repo y deploy. Carpeta de publicación: `dist`.

## Datos de contacto

- WhatsApp: `https://wa.me/5492644456612` (264 445 6612)
- Instagram: [@saboresqueconectansj](https://instagram.com/saboresqueconectansj)
