# 🫒 Placeres que Conectan — Especificación completa del sitio web

> **Documento maestro para Claude Code.**
> Este archivo describe, de punta a punta, la web que hay que construir para el negocio familiar
> **"Placeres que Conectan – Delicias Regionales San Juan"**. Está pensado para abrirse dentro de
> VS Code y entregarse a **Claude Code**, que debe construir el proyecto completo siguiendo estas
> instrucciones. Léelo entero antes de empezar a codear.

---

## 0. Cómo usar este documento (instrucciones para Claude Code)

1. Lee todo el documento.
2. Crea la estructura de carpetas de la sección **§14**.
3. **Primero procesa las imágenes** (sección **§6**): hay una carpeta `imagenes/` con las fotos
   crudas de los productos. Tenés que quitarles el fondo con Python (`rembg`) y dejarlas listas
   en `public/productos/`. Esto se hace **antes** de tocar el front.
4. Construí el front según **§2–§13** con el stack de **§1**.
5. Seguí el orden de build de **§15**.
6. Donde falte una foto de producto (lista en **§6.3**), generá un placeholder con la marca.

> **Idioma del sitio:** español (Argentina). Tono cálido, cercano, artesanal pero profesional.

---

## 1. Stack tecnológico

| Capa | Elección | Por qué |
|---|---|---|
| Build / dev | **Vite** | Rapidísimo, cero config, ideal para Claude Code |
| Framework | **React 18 + TypeScript** | Componentes, tipado, ecosistema de animación |
| Estilos | **Tailwind CSS** | Theming por variables CSS, mobile-first |
| Animaciones | **Framer Motion** | Entradas/salidas suaves, `layout`, `AnimatePresence` |
| Iconos | **lucide-react** | Set coherente y liviano |
| Tema dinámico | **Hora + estación** (sin API externa) | Se calcula en el navegador, gratis y sin riesgos (ver §9) |
| Deploy | **Netlify** o **Vercel** (plan gratis) | Deploy con un click desde el repo |
| Procesado de imágenes | **Python + rembg + Pillow** (local) | Quita fondos offline y gratis (ver §6) |

**Comandos base:**
```bash
npm create vite@latest placeres-que-conectan -- --template react-ts
cd placeres-que-conectan
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 2. Arquitectura del sitio — decisión: **página única + drawer**, NO modal

**Recomendación firme:** una **landing page de una sola página (SPA)** con scroll suave entre
secciones, y la calculadora de paquetes como **sección protagonista dentro de esa misma página**.
El resumen del paquete (el "carrito") va en un **panel deslizante (drawer)**:

- **En mobile:** un drawer que sube desde abajo / entra desde la derecha, con un botón flotante
  "Mi paquete (3)" siempre visible.
- **En desktop:** una **columna fija (sticky sidebar)** a la derecha de la calculadora, siempre
  visible mientras el usuario suma productos.

**Por qué NO un modal:** un modal tapa el catálogo y obliga a entrar/salir para ver qué llevás.
La esencia del pedido del cliente es *"voy viendo cómo se arma mi paquete mientras elijo"*, y eso
se logra con un panel persistente, no con una ventana que bloquea. Un drawer/sidebar mantiene
catálogo y paquete visibles al mismo tiempo → sensación de tienda profesional.

**Por qué NO una página aparte:** romper en dos rutas agrega fricción y recargas. Una sola página
fluida con anclas (`#calculadora`, `#como-comprar`, etc.) es más moderno y rápido.

### Secciones de la página (en orden de scroll)
1. **Header / Nav** fijo y translúcido (logo + links ancla + botón "Armar mi paquete").
2. **Hero** — logo grande, claim, animación de marca, CTA principal.
3. **Cómo comprar** — 3–4 pasos visuales del proceso (clave para que el cliente no se pierda, §8).
4. **Calculadora de paquetes** — el corazón del sitio (§7).
5. **Sobre nosotros** — breve, regional, San Juan.
6. **Footer** — WhatsApp, Instagram.

---

## 3. Identidad de marca

Colores tomados del logo (crema/pergamino + verde oliva + terracota + ámbar/ocre + marrón
oscuro), **modernizados** para más contraste, vida y sofisticación.

### 3.1 Paleta base (tokens)
```css
/* Verdes oliva */
--oliva-900: #2F3B17;
--oliva-700: #4A5A2B;
--oliva-500: #6B7F3A;
--oliva-300: #9CAA6B;

/* Terracota / óxido */
--terra-700: #9E4A22;
--terra-500: #C0622D;
--terra-300: #DE8B5C;

/* Ámbar / ocre dorado */
--ambar-600: #C8902E;
--ambar-400: #E2B25A;
--ambar-200: #F1D08A;

/* Crema / pergamino */
--crema-50:  #FBF3E2;
--crema-100: #F6E8CC;
--crema-200: #EFD9B0;

/* Marrón texto */
--cacao-900: #2C1E14;
--cacao-700: #4A3526;
```

### 3.2 Tipografías
- **Títulos / logo-feel:** una *script* cálida tipo *Pacifico* o *Caveat* **solo** para acentos
  (imita el logo "Placeres que conectan"). Usar con moderación.
- **Encabezados:** una serif moderna con carácter (*Fraunces* o *DM Serif Display*).
- **Texto / UI:** una sans limpia y legible (*Inter* o *Plus Jakarta Sans*).

Cargar vía Google Fonts. Definir como tokens `--font-display`, `--font-serif`, `--font-sans`.

### 3.3 Texturas y detalles
- Fondo con sutil textura de **papel/pergamino** (overlay muy bajo, `opacity: 0.04`).
- Elementos decorativos vectoriales: **ramas de olivo, aceitunas, gotas de aceite** (SVG inline,
  no imágenes pesadas), flotando con parallax suave.
- Sombras cálidas (no negras puras): `0 20px 40px -15px rgba(74,53,38,.35)`.
- Bordes redondeados generosos (`rounded-2xl` / `rounded-3xl`).

---

## 4. Datos de la marca (constantes del proyecto)

```ts
export const MARCA = {
  nombre: "Placeres que Conectan",
  subtitulo: "Delicias Regionales · San Juan",
  whatsapp: "5492644456612",        // 54 (Argentina) + 9 (móvil) + 264 (San Juan) + 4456612
  whatsappVisible: "264 445 6612",
  instagram: "https://instagram.com/saboresqueconectansj",
  instagramHandle: "@saboresqueconectansj",
  ciudad: "San Juan, Argentina",
  coords: { lat: -31.5375, lon: -68.5364 }, // San Juan (para SEO / LocalBusiness)
} as const;
```

> ⚠️ **Verificar el número de WhatsApp internacional.** Para `wa.me` los celulares argentinos
> van como `54` + `9` + código de área (sin 0) + número. El cartel dice **264 445 6612**, así que
> el link queda `https://wa.me/5492644456612`. Probarlo una vez antes de publicar.

---

## 5. Catálogo de productos (fuente de verdad)

Precios tomados de la lista oficial del negocio. Crear `src/data/productos.ts`:

```ts
export type Categoria =
  | "Aceite de Oliva"
  | "Aceto"
  | "Aceituna Verde"
  | "Aceituna Negra"
  | "Dulces";

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;          // ARS
  imagen: string;          // ruta en /public/productos/*.png
  destacado?: boolean;
}

export const PRODUCTOS: Producto[] = [
  // ── Aceite de Oliva Virgen Extra ──
  { id: "aceite-250",  nombre: "Aceite de Oliva Virgen Extra 250 cc. Blend", categoria: "Aceite de Oliva", precio: 5800,  imagen: "/productos/aceite-oliva-250.png", destacado: true },
  { id: "aceite-500",  nombre: "Aceite de Oliva Virgen Extra 500 cc. Blend", categoria: "Aceite de Oliva", precio: 10100, imagen: "/productos/aceite-oliva-500.png" },
  { id: "aceite-750",  nombre: "Aceite de Oliva Virgen Extra 750 cc. Blend", categoria: "Aceite de Oliva", precio: 14000, imagen: "/productos/aceite-oliva-750.png", destacado: true },
  { id: "aceite-5l",   nombre: "Aceite de Oliva Virgen Extra 5 L Blend",     categoria: "Aceite de Oliva", precio: 79500, imagen: "/productos/aceite-oliva-5000.png" },

  // ── Aceto ──
  { id: "aceto-250",   nombre: "Aceto Balsámico 250 cc.", categoria: "Aceto", precio: 6300, imagen: "/productos/aceto-balsamico-250.png" },

  // ── Aceituna Verde (Grupo C) ──
  { id: "verde-500",   nombre: "Aceituna Verde Grupo C 500 gr.", categoria: "Aceituna Verde", precio: 4100, imagen: "/productos/aceituna-verde-500.png" },
  { id: "verde-1000",  nombre: "Aceituna Verde Grupo C 1 kg.",   categoria: "Aceituna Verde", precio: 6500, imagen: "/productos/aceituna-verde-1000.png" },

  // ── Aceituna Negra (Griega) ──
  { id: "griega-500",  nombre: "Aceituna Griega 500 gr.", categoria: "Aceituna Negra", precio: 6700,  imagen: "/productos/aceituna-griega-500.png" },
  { id: "griega-1000", nombre: "Aceituna Griega 1 kg.",   categoria: "Aceituna Negra", precio: 11780, imagen: "/productos/aceituna-griega-1000.png" },

  // ── Dulces y Mermeladas ──
  { id: "merm-alcayota", nombre: "Mermelada 450 gr. Alcayota",          categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-alcayota.png" },
  { id: "merm-higo",     nombre: "Mermelada 450 gr. Higo",              categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-higo.png" },
  { id: "merm-durazno",  nombre: "Mermelada 450 gr. Durazno",           categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-durazno.png" },
  { id: "merm-membrillo",nombre: "Mermelada 450 gr. Membrillo",         categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-membrillo.png" },
  { id: "merm-pera",     nombre: "Mermelada 450 gr. Pera",              categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-pera.png" },
  { id: "merm-naranja",  nombre: "Mermelada 450 gr. Naranja",           categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-naranja.png" },
  { id: "merm-tomate",   nombre: "Mermelada 450 gr. Tomate",            categoria: "Dulces", precio: 4300, imagen: "/productos/mermelada-tomate.png" },
  { id: "dulce-batatita",nombre: "Dulce 490 gr. Batatita en Almíbar",   categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-batatita.png" },
  { id: "dulce-naranja", nombre: "Dulce 490 gr. Naranja en Almíbar",    categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-naranja.png" },
  { id: "dulce-zapallito",nombre:"Dulce 490 gr. Zapallito en Almíbar",  categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-zapallito.png" },
  { id: "dulce-membrillo-pan", nombre: "Dulce 600 gr. Membrillo en Pan", categoria: "Dulces", precio: 4300, imagen: "/productos/dulce-membrillo-pan.png" },
];

export const formatoARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
```

> Todos los precios están en pesos argentinos (ARS) y deben mostrarse con `formatoARS`
> (ej.: `$5.800`). El precio debe ser **fácil de actualizar** desde este único archivo.

---

## 6. Pipeline de imágenes (Python + rembg)

Hay una carpeta `imagenes/` con las fotos crudas de los productos (jarras/botellas sobre pared
blanca). Hay que **quitarles el fondo**, recortar al contenido, normalizar tamaño y exportar PNG
con transparencia a `public/productos/`.

### 6.1 Renombrar las fotos crudas (hacer esto a mano, una sola vez)
Las fotos vienen con nombres de WhatsApp poco descriptivos. Renombralas dentro de `imagenes/`
según lo que se ve en cada una:

| Lo que se ve en la foto | Nombrá el archivo como |
|---|---|
| Botella Olivar de los Andes **250 ML** | `aceite-oliva-250.jpg` |
| Botella Olivar de los Andes **500 ML** | `aceite-oliva-500.jpg` |
| Botella Olivar de los Andes **750 ML** | `aceite-oliva-750.jpg` |
| Botella morada **Aceto Balsámico 250 ML** | `aceto-balsamico-250.jpg` |
| Frasco La Salmuera **aceitunas verdes** (escurrido 500 gr) | `aceituna-verde-500.jpg` |
| Frasco La Salmuera **aceitunas verdes** (escurrido 1 kg) | `aceituna-verde-1000.jpg` |
| Frasco La Salmuera **aceitunas negras griegas** (500 grs) | `aceituna-griega-500.jpg` |
| Frasco La Salmuera **aceitunas negras griegas** (1 kg) | `aceituna-griega-1000.jpg` |
| Frasco dulce **Alcayota** | `mermelada-alcayota.jpg` |
| Frasco mermelada **Higo** | `mermelada-higo.jpg` |
| Frasco mermelada **Naranja** | `mermelada-naranja.jpg` |
| Frasco mermelada **Tomate** | `mermelada-tomate.jpg` |
| Frasco dulce **Batatitas en almíbar** | `dulce-batatita.jpg` |
| Frasco dulce **Naranja en almíbar** | `dulce-naranja.jpg` |

> El nombre del JPG de entrada debe coincidir con el nombre del PNG de salida usado en
> `productos.ts` (sin la extensión).

### 6.2 Script de procesado — `scripts/procesar_imagenes.py`

```python
"""
Quita el fondo de las fotos de producto y las deja listas para la web.
Requisitos:  pip install rembg pillow onnxruntime
Uso:         python scripts/procesar_imagenes.py
Entrada:     ./imagenes/*.jpg|*.png
Salida:      ./public/productos/*.png  (fondo transparente, recortado, sombra suave)
La primera ejecución descarga el modelo U2-Net (~170 MB) y luego trabaja 100% offline.
"""
from pathlib import Path
from rembg import remove, new_session
from PIL import Image, ImageFilter, ImageOps

ENTRADA = Path("imagenes")
SALIDA = Path("public/productos")
LADO = 1000          # lienzo cuadrado final (px)
MARGEN = 0.10        # 10% de aire alrededor del producto
session = new_session("u2net")   # buen modelo general para objetos

def procesar(src: Path):
    img = Image.open(src).convert("RGBA")
    img = ImageOps.exif_transpose(img)          # respeta orientación del celular
    sin_fondo = remove(img, session=session)    # recorta el fondo

    # recorta al bounding box del producto
    bbox = sin_fondo.getbbox()
    if bbox:
        sin_fondo = sin_fondo.crop(bbox)

    # lienzo cuadrado con margen
    w, h = sin_fondo.size
    escala = int(LADO * (1 - MARGEN * 2)) / max(w, h)
    nuevo = (max(1, int(w * escala)), max(1, int(h * escala)))
    sin_fondo = sin_fondo.resize(nuevo, Image.LANCZOS)

    lienzo = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))

    # sombra suave debajo del producto (sensación "flotando")
    sombra = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    alpha = sin_fondo.split()[3]
    sombra.paste((44, 30, 20, 90), ( (LADO - nuevo[0]) // 2,
                                     (LADO - nuevo[1]) // 2 + 14), alpha)
    sombra = sombra.filter(ImageFilter.GaussianBlur(22))
    lienzo = Image.alpha_composite(lienzo, sombra)

    # pega el producto centrado
    lienzo.alpha_composite(sin_fondo, ((LADO - nuevo[0]) // 2,
                                       (LADO - nuevo[1]) // 2))

    SALIDA.mkdir(parents=True, exist_ok=True)
    out = SALIDA / (src.stem + ".png")
    lienzo.save(out)
    print(f"✓ {src.name} → {out}")

if __name__ == "__main__":
    fotos = [p for p in ENTRADA.iterdir()
             if p.suffix.lower() in (".jpg", ".jpeg", ".png")]
    if not fotos:
        print("No hay imágenes en ./imagenes/")
    for f in fotos:
        try:
            procesar(f)
        except Exception as e:
            print(f"✗ Error con {f.name}: {e}")
```

Instalación y ejecución:
```bash
pip install rembg pillow onnxruntime
python scripts/procesar_imagenes.py
```

> **Mejora opcional de calidad:** si alguna foto queda con bordes sucios, probar el modelo
> `isnet-general-use` en `new_session(...)`. Para realce de color/nitidez se puede agregar
> `ImageEnhance.Color` y `ImageEnhance.Sharpness` de Pillow antes de guardar.

### 6.3 Productos SIN foto → generar placeholder de marca
Estos 6 productos **no tienen foto** todavía. Generá para cada uno un **placeholder SVG**
elegante con los colores de la marca (silueta de frasco/botella + nombre del producto + chip de
categoría). Que se vea intencional, no roto:

- `aceite-oliva-5000` (Aceite 5 L) → silueta de botella grande, verde oliva.
- `mermelada-durazno` → silueta de frasco, ámbar.
- `mermelada-membrillo` → silueta de frasco, terracota.
- `mermelada-pera` → silueta de frasco, oliva claro.
- `dulce-zapallito` → silueta de frasco, oliva.
- `dulce-membrillo-pan` → silueta de "pan de dulce", terracota.

Implementá un componente `<ProductoImagen>` que: si el PNG existe lo muestra; si no, renderiza el
placeholder SVG. Así, cuando la familia consiga las fotos, solo agregan el PNG y listo.

---

## 7. Calculadora de paquetes — comportamiento detallado

Es la sección estrella. Layout en desktop: **catálogo (2/3) + panel "Mi paquete" sticky (1/3)**.
En mobile: catálogo a ancho completo + **botón flotante** que abre el drawer del paquete.

### 7.1 Tarjeta de producto (en el catálogo)
Cada tarjeta muestra:
- La **imagen del producto** (PNG transparente) flotando con su sombra suave.
- **Nombre** del producto.
- **Chip de categoría** con color de la categoría.
- **Precio individual** bien visible debajo (ej. `$5.800`).
- Un **stepper**: `[ − ]  cantidad  [ + ]`.
  - Si la cantidad es 0, el botón `−` está deshabilitado.
  - Al tocar `+`, la cantidad sube y el producto se agrega/incrementa en el paquete.
- Filtros por categoría arriba (chips: Todos · Aceites · Aceto · Aceitunas verdes · Aceitunas
  negras · Dulces). Filtrado animado (`layout` de Framer Motion).
- Buscador opcional por nombre.

### 7.2 Panel "Mi paquete"
- Lista de ítems agregados. Cada ítem: mini-imagen, nombre, `cantidad × precio` y **subtotal**.
- Stepper también dentro del panel (para ajustar sin volver al catálogo).
- **Total general** abajo, grande, con **número animado** (count-up) cuando cambia.
- **Estado vacío** amable: "Todavía no agregaste nada. Sumá productos para armar tu paquete 🫒".
- Botón **"Vaciar paquete"** (con confirmación suave).
- Botón principal **"Finalizar pedido por WhatsApp"** (ver §8).

### 7.3 Animaciones de agregar / quitar (clave del pedido del cliente)
Usar **Framer Motion** con `AnimatePresence` + `layout`:

- **Al agregar** (cantidad 0 → 1): el ítem **aparece suave** en el panel: `opacity 0→1`,
  `y: 12→0`, leve `scale: 0.96→1`, con spring. Los demás ítems se reacomodan con `layout`.
- **Al quitar** (cantidad 1 → 0): el ítem **desaparece suave**: `opacity 1→0`, `x: 0→24`,
  `height` colapsa. `AnimatePresence` maneja la salida.
- **Feedback al tocar `+`:** la imagen de la tarjeta hace un pequeño "pulse" y, opcionalmente,
  una copia fantasma vuela hacia el panel (efecto "fly to cart" — opcional pero muy lindo).
- **Total:** componente `<NumeroAnimado valor={total} />` que interpola el número viejo→nuevo
  (~600 ms, easeOut) y formatea con `formatoARS`.

Variantes de ejemplo:
```tsx
const itemVariants = {
  inicial: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 30 } },
  salida:  { opacity: 0, x: 24, height: 0, marginBottom: 0,
    transition: { duration: 0.25 } },
};
```

### 7.4 Estado (sin librerías extra)
Usar `useReducer` o un store simple en React (Context). **No usar `localStorage`** dentro de
artifacts, pero en este proyecto real (Vite) **sí se puede** persistir el paquete en
`localStorage` para que no se pierda al recargar. Implementarlo con un hook `usePaquete()`.

---

## 8. Checkout por WhatsApp + explicación al cliente

### 8.1 Sección "Cómo comprar" (que el cliente no se pierda)
Mostrar 3 pasos con íconos y microanimación al hacer scroll:

1. **Armá tu paquete** — "Sumá o restá productos. Vas viendo el total en tiempo real."
2. **Tocá *Finalizar por WhatsApp*** — "Se abre el chat con tu pedido ya escrito."
3. **Coordinamos con vos** — "Confirmamos stock, pago y entrega directamente por WhatsApp."

Texto de apoyo, claro y tranquilizador: *"No se cobra nada en la web: la web solo arma tu pedido.
La compra se cierra por WhatsApp, donde te atendemos personalmente."*

### 8.2 Generar el link de WhatsApp con el detalle
Al tocar "Finalizar pedido por WhatsApp", construir un mensaje pre-armado y abrir `wa.me`:

```ts
function armarLinkWhatsApp(items: { nombre: string; cantidad: number; precio: number }[],
                           total: number): string {
  const lineas = items.map(
    (i) => `• ${i.cantidad} × ${i.nombre} — ${formatoARS(i.precio * i.cantidad)}`
  );
  const texto =
    `¡Hola Placeres que Conectan! 🫒\n` +
    `Quiero hacer este pedido:\n\n` +
    lineas.join("\n") +
    `\n\n*Total estimado: ${formatoARS(total)}*\n\n` +
    `¿Me confirman disponibilidad y forma de pago/entrega? ¡Gracias!`;

  return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(texto)}`;
}
```
- Abrir con `window.open(link, "_blank")`.
- Deshabilitar el botón si el paquete está vacío.
- En el mensaje aclarar **"Total estimado"** (los precios pueden cambiar; lo confirma el negocio).

---

## 9. Diseño dinámico: hora del día + estación (sin API externa)

El sitio cambia de paleta automáticamente según **(a)** la hora local del visitante y
**(b)** la estación del año. **No usa ninguna API externa ni geolocalización ni clave**: todo se
calcula en el navegador a partir de la fecha y hora del dispositivo. Cero dependencias, cero
términos legales, cero puntos de falla.

> Sistema de **dos ejes**:
> **Eje 1 — Hora** controla la *luminosidad* (claro de día ↔ oscuro de noche).
> **Eje 2 — Estación** controla la *paleta de acentos* y las *partículas ambientales* de fondo.
> La combinación da hasta 16 ambientes distintos manteniendo siempre la identidad de la marca.

### 9.1 Eje 1 — Hora del día → luminosidad
A partir de `new Date().getHours()`:

| Franja | Horas | Luminosidad | Sensación |
|---|---|---|---|
| `amanecer` | 6–9 | crema cálido, luz dorada suave | mañana |
| `dia` | 9–18 | crema claro, alto brillo | luminoso, fresco |
| `atardecer` | 18–21 | crema con tinte terracota/ámbar profundo | dorado |
| `noche` | 21–6 | fondo espresso/carbón cálido, acentos ámbar que "brillan" | íntimo, elegante |

### 9.2 Eje 2 — Estación → paleta de acentos + ambiente
San Juan está en el **hemisferio sur**, así que las estaciones se calculan según el mes (ver §9.3):

| Estación | Meses (hemisferio sur) | Acentos | Partículas ambientales sutiles |
|---|---|---|---|
| `verano` | Dic · Ene · Feb | ámbar y terracota saturados, dorado intenso | destellos dorados / luz cálida |
| `otoño` | Mar · Abr · May | cobre, ocre, terracota apagado | hojas de olivo cayendo lento |
| `invierno` | Jun · Jul · Ago | oliva profundo, crema más fría, acento azulado mínimo | bruma suave / aire quieto |
| `primavera` | Sep · Oct · Nov | verde sage y oliva claro, ámbar fresco | pétalos / brotes flotando |

Las partículas van en una capa de fondo (`<FondoEstacion />`) **muy sutil**, detrás del contenido,
y se **apagan** con `prefers-reduced-motion`. Nunca deben competir con la legibilidad del precio
ni del CTA.

### 9.3 Cálculo de la estación (función pura, sin red)

```ts
export type Estacion = "verano" | "otono" | "invierno" | "primavera";

// Hemisferio sur (Argentina). Aproximación por mes, suficiente para el theming.
export function estacionActual(fecha = new Date()): Estacion {
  const m = fecha.getMonth(); // 0 = enero ... 11 = diciembre
  if (m === 11 || m === 0 || m === 1) return "verano";   // dic, ene, feb
  if (m >= 2 && m <= 4)  return "otono";                  // mar, abr, may
  if (m >= 5 && m <= 7)  return "invierno";               // jun, jul, ago
  return "primavera";                                     // sep, oct, nov
}

export type Franja = "amanecer" | "dia" | "atardecer" | "noche";

export function franjaHoraria(fecha = new Date()): Franja {
  const h = fecha.getHours();
  if (h >= 6 && h < 9)  return "amanecer";
  if (h >= 9 && h < 18) return "dia";
  if (h >= 18 && h < 21) return "atardecer";
  return "noche";
}
```

### 9.4 Implementación (hook `useTema`)
- Calcular `franjaHoraria()` y `estacionActual()` al montar.
- Combinarlos en un objeto `tema` que setea **variables CSS** en `:root`
  (`--bg`, `--surface`, `--text`, `--accent`, `--accent-2`, etc.).
- Transición suave entre temas:
  `transition: background-color .8s ease, color .8s ease;` en los contenedores principales.
- **Toggle manual** en el header (Sol / Luna / Auto) para que el visitante fuerce claro u oscuro
  si quiere. Respetar también `prefers-color-scheme` y `prefers-reduced-motion`.
- Opcional: revaluar el tema cada ~10 min con un `setInterval`, por si el usuario deja la pestaña
  abierta y pasa de día a noche.

> Como todo es cálculo local, **nunca falla y no hay nada que cachear ni autorizar**. Es la opción
> más liviana, privada y sin riesgos legales.

### 9.5 Las 16 paletas exactas (hora × estación) — sin interpretación

Crear `src/lib/temas.ts`. Estos son **los valores definitivos** de los 16 ambientes. El eje **hora**
define la luminosidad (claro de día → oscuro de noche) y el eje **estación** define los acentos y el
color de las partículas. Todos los pares texto/fondo cumplen contraste **AA**.

```ts
// src/lib/temas.ts
import type { Franja, Estacion } from "./estacion";

export interface Paleta {
  dark: boolean;          // true en los temas de noche (logo/íconos claros)
  bg: string;             // fondo principal
  bg2: string;            // segundo stop del gradiente de fondo
  surface: string;        // tarjetas / paneles
  surface2: string;       // hover / superficie elevada
  border: string;         // bordes sutiles
  text: string;           // texto principal
  textSoft: string;       // texto secundario
  accent: string;         // acento principal (botones, precios, foco)
  accentStrong: string;   // estado hover / pressed del acento
  accent2: string;        // acento secundario (chips, decoración)
  shadow: string;         // color de sombra (rgba)
  particle: string;       // color de las partículas ambientales de la estación
  glow: string;           // resplandor del acento (solo noche; "none" en claros)
}

export const TEMAS: Record<Franja, Record<Estacion, Paleta>> = {
  // ───────────────────────── DÍA (luminoso, fondos crema claros) ─────────────────────────
  dia: {
    verano:    { dark:false, bg:"#FBF3E2", bg2:"#F6E8CC", surface:"#FFFDF8", surface2:"#FBF1DC", border:"#E7D6B5", text:"#2C1E14", textSoft:"#6B5848", accent:"#C8902E", accentStrong:"#A9761F", accent2:"#C0622D", shadow:"rgba(74,53,38,.16)", particle:"#E2B25A", glow:"none" },
    otono:     { dark:false, bg:"#F7ECD7", bg2:"#F0DEC0", surface:"#FFFCF4", surface2:"#F8EEDA", border:"#E6D1AE", text:"#2C1E14", textSoft:"#6E5742", accent:"#B5562A", accentStrong:"#94431F", accent2:"#C8902E", shadow:"rgba(74,53,38,.16)", particle:"#C77B3A", glow:"none" },
    invierno:  { dark:false, bg:"#F2ECDD", bg2:"#E7E0CE", surface:"#FBF8F0", surface2:"#F0EBDC", border:"#DAD2BE", text:"#28231B", textSoft:"#5E5848", accent:"#4A5A2B", accentStrong:"#394717", accent2:"#6B7F3A", shadow:"rgba(40,35,27,.16)", particle:"#C9CBB6", glow:"none" },
    primavera: { dark:false, bg:"#F6F2E0", bg2:"#ECEFCF", surface:"#FEFEF6", surface2:"#F4F4E2", border:"#DEE0BE", text:"#2C2E18", textSoft:"#5F6347", accent:"#6B7F3A", accentStrong:"#556B2F", accent2:"#E2B25A", shadow:"rgba(44,46,24,.16)", particle:"#B7C77F", glow:"none" },
  },
  // ──────────────────────── AMANECER (claro, cálido, tinte durazno) ───────────────────────
  amanecer: {
    verano:    { dark:false, bg:"#FBEBD2", bg2:"#F8DEBC", surface:"#FFF8EC", surface2:"#FBEED6", border:"#EFD9B8", text:"#3A2818", textSoft:"#7A6048", accent:"#D99A3A", accentStrong:"#BC7E22", accent2:"#E08A4E", shadow:"rgba(74,53,38,.16)", particle:"#F1D08A", glow:"none" },
    otono:     { dark:false, bg:"#F8E6CC", bg2:"#F2D6B2", surface:"#FFF6E8", surface2:"#F9ECD4", border:"#ECD0AC", text:"#3A2818", textSoft:"#7A5E44", accent:"#C76A33", accentStrong:"#A4521F", accent2:"#D9A441", shadow:"rgba(74,53,38,.16)", particle:"#D98E52", glow:"none" },
    invierno:  { dark:false, bg:"#EFE8D6", bg2:"#E4DAC2", surface:"#FAF5EA", surface2:"#EFE8D6", border:"#DCD2BC", text:"#322B20", textSoft:"#685F4C", accent:"#5A6B33", accentStrong:"#45561F", accent2:"#8A9A5B", shadow:"rgba(40,35,27,.16)", particle:"#CFD0BA", glow:"none" },
    primavera: { dark:false, bg:"#F4EDD4", bg2:"#ECE9C8", surface:"#FDFBEF", surface2:"#F4F0DE", border:"#DFDDBA", text:"#322E1C", textSoft:"#62614A", accent:"#7C9043", accentStrong:"#647734", accent2:"#E6B85E", shadow:"rgba(44,46,24,.16)", particle:"#C2CF88", glow:"none" },
  },
  // ──────────────────── ATARDECER (medio, dorado/terracota más profundo) ──────────────────
  atardecer: {
    verano:    { dark:false, bg:"#F4E2C2", bg2:"#EDCF9E", surface:"#FBF0DA", surface2:"#F4E4C6", border:"#E5CBA0", text:"#3A2614", textSoft:"#7C5C3C", accent:"#C77A1E", accentStrong:"#A35F12", accent2:"#B5562A", shadow:"rgba(74,53,38,.22)", particle:"#E8A94A", glow:"none" },
    otono:     { dark:false, bg:"#F0D9B6", bg2:"#E6C193", surface:"#F9EBD0", surface2:"#F0DCBA", border:"#E0C195", text:"#3A2412", textSoft:"#7A553A", accent:"#A8481F", accentStrong:"#863613", accent2:"#C8902E", shadow:"rgba(58,36,18,.22)", particle:"#CE7434", glow:"none" },
    invierno:  { dark:false, bg:"#E8DEC6", bg2:"#DACFB2", surface:"#F5EEDD", surface2:"#E9E1CC", border:"#D6CAB0", text:"#332A1D", textSoft:"#665C49", accent:"#556B2F", accentStrong:"#41541F", accent2:"#9E5A2A", shadow:"rgba(40,35,27,.22)", particle:"#C6C4AC", glow:"none" },
    primavera: { dark:false, bg:"#F0E6C6", bg2:"#E8E0B8", surface:"#FAF4E0", surface2:"#F0E8CE", border:"#DCD6AE", text:"#332E1A", textSoft:"#635E44", accent:"#6E8438", accentStrong:"#586C2B", accent2:"#D99A3A", shadow:"rgba(44,46,24,.22)", particle:"#BDC97E", glow:"none" },
  },
  // ──────────────── NOCHE (oscuro, espresso cálido, acentos que "brillan") ─────────────────
  noche: {
    verano:    { dark:true, bg:"#1E1610", bg2:"#2A1E14", surface:"#2C2118", surface2:"#392A1D", border:"#3C2C1E", text:"#F4E7D2", textSoft:"#BBA384", accent:"#E2B25A", accentStrong:"#F1D08A", accent2:"#D98A4E", shadow:"rgba(0,0,0,.5)", particle:"#E2B25A", glow:"rgba(226,178,90,.35)" },
    otono:     { dark:true, bg:"#1F1610", bg2:"#2B1C12", surface:"#2E2016", surface2:"#3C2A1B", border:"#3E2C1C", text:"#F3E5CE", textSoft:"#BBA083", accent:"#D98A4E", accentStrong:"#E8A45E", accent2:"#C8902E", shadow:"rgba(0,0,0,.5)", particle:"#D98A4E", glow:"rgba(217,138,78,.32)" },
    invierno:  { dark:true, bg:"#16170F", bg2:"#1F2116", surface:"#232619", surface2:"#2F3322", border:"#313524", text:"#ECEAD6", textSoft:"#A8AC8E", accent:"#8A9A5B", accentStrong:"#A6B576", accent2:"#C8902E", shadow:"rgba(0,0,0,.5)", particle:"#A8AC8E", glow:"rgba(138,154,91,.28)" },
    primavera: { dark:true, bg:"#181A0F", bg2:"#212414", surface:"#252818", surface2:"#313723", border:"#333823", text:"#EFEDD6", textSoft:"#ADB18F", accent:"#9CAA6B", accentStrong:"#BAC788", accent2:"#E2B25A", shadow:"rgba(0,0,0,.5)", particle:"#9CAA6B", glow:"rgba(156,170,107,.3)" },
  },
};

export function resolverTema(franja: Franja, estacion: Estacion): Paleta {
  return TEMAS[franja][estacion];
}
```

**Cómo aplicarlo en `useTema`** (setea variables CSS en `:root`, la transición las anima):

```ts
function aplicarPaleta(p: Paleta) {
  const r = document.documentElement;
  r.style.setProperty("--bg", p.bg);
  r.style.setProperty("--bg-2", p.bg2);
  r.style.setProperty("--surface", p.surface);
  r.style.setProperty("--surface-2", p.surface2);
  r.style.setProperty("--border", p.border);
  r.style.setProperty("--text", p.text);
  r.style.setProperty("--text-soft", p.textSoft);
  r.style.setProperty("--accent", p.accent);
  r.style.setProperty("--accent-strong", p.accentStrong);
  r.style.setProperty("--accent-2", p.accent2);
  r.style.setProperty("--shadow", p.shadow);
  r.style.setProperty("--particle", p.particle);
  r.style.setProperty("--glow", p.glow);
  r.dataset.theme = p.dark ? "dark" : "light";
}
```

**Toggle manual:** si el usuario fuerza "claro", usar la franja `dia` de la estación actual; si fuerza
"oscuro", usar `noche` de la estación actual; en "auto", usar `franjaHoraria()`. La estación siempre
sale de `estacionActual()`. Guardar la preferencia en `localStorage` (`tema_pref`).

Mapa rápido de "personalidad" de cada ambiente:

| | Verano | Otoño | Invierno | Primavera |
|---|---|---|---|---|
| **Día** | dorado vivo | cobre cálido | oliva sereno | verde fresco |
| **Amanecer** | durazno dorado | naranja tostado | oliva brumoso | brote verde |
| **Atardecer** | ámbar intenso | terracota profundo | oliva al ocaso | oliva dorado |
| **Noche** | ámbar que brilla | cobre cálido | oliva luna | oliva fresco |

---

## 10. Animaciones y microinteracciones (catálogo)

- **Hero:** entrada en cascada (stagger) de logo → claim → CTA. Ramas de olivo flotando con
  parallax al mover el mouse / al hacer scroll.
- **Scroll reveal:** secciones aparecen con `whileInView` (`opacity` + `y`), una sola vez.
- **Header:** se compacta y gana fondo translúcido al hacer scroll.
- **Botones:** `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`, sombra que crece.
- **Tarjetas de producto:** leve elevación + tilt sutil al hover (desktop).
- **Total del paquete:** número animado (count-up).
- **Partículas de estación:** capa de fondo muy sutil según la estación (destellos en verano,
  hojas de olivo en otoño, bruma en invierno, pétalos en primavera), detrás del contenido,
  desactivable con `prefers-reduced-motion`.
- **Transición de tema:** colores cambian con fade de ~0.8 s, nunca de golpe.

Regla de oro: **suave y discreto**. Nada que maree ni que reste legibilidad al precio o al CTA.

---

## 11. Responsive (mobile-first)

- Diseñar primero para **~380 px** de ancho (el público comprará desde el celu).
- Catálogo: 1 columna en mobile, 2 en tablet, 3 en desktop.
- Panel "Mi paquete": **drawer** en mobile (botón flotante con contador), **sidebar sticky** en ≥1024px.
- Botón "Finalizar por WhatsApp" siempre alcanzable (fijo abajo del drawer en mobile).
- Tipografías y espaciados fluidos (`clamp()`).

---

## 12. Accesibilidad y rendimiento

- Contraste AA en todos los temas (revisar especialmente el tema noche).
- Steppers y botones con `aria-label` claros ("Agregar Aceite de Oliva 250cc").
- Foco visible, navegable con teclado, `Esc` cierra el drawer.
- Imágenes con `alt` descriptivo y `loading="lazy"`.
- PNG de producto optimizados (~1000px, comprimidos). Considerar `srcset`/WebP en build.
- `prefers-reduced-motion`: apagar parallax y partículas, mantener fades mínimos.
- Objetivo Lighthouse: ≥ 90 en Performance y Accesibilidad.

---

## 13. SEO y metadatos

- `<title>`: "Placeres que Conectan — Aceite de oliva, aceitunas, aceto y dulces regionales | San Juan".
- `<meta name="description">` con productos y zona (San Juan, Argentina).
- Open Graph (imagen = logo o cartel) para que se vea lindo al compartir por WhatsApp/IG.
- `lang="es-AR"`, favicon con el isotipo de la marca.
- Datos estructurados `LocalBusiness` (JSON-LD) con WhatsApp e Instagram.

---

## 14. Estructura de carpetas

```
placeres-que-conectan/
├─ imagenes/                      # fotos crudas (renombradas, ver §6.1) — NO se publica
├─ scripts/
│  └─ procesar_imagenes.py        # quita fondos → public/productos/
├─ public/
│  ├─ productos/                  # PNG transparentes generados por el script
│  ├─ logo.png
│  └─ textura-papel.png
├─ src/
│  ├─ data/
│  │  └─ productos.ts             # catálogo + precios (fuente de verdad)
│  ├─ lib/
│  │  ├─ marca.ts                 # constantes de §4
│  │  ├─ whatsapp.ts              # armarLinkWhatsApp()
│  │  ├─ estacion.ts              # estacionActual() + franjaHoraria()
│  │  └─ temas.ts                 # las 16 paletas exactas (§9.5)
│  ├─ hooks/
│  │  ├─ usePaquete.ts            # estado del carrito + persistencia
│  │  └─ useTema.ts               # hora + estación → variables CSS
│  ├─ components/
│  │  ├─ Header.tsx
│  │  ├─ Hero.tsx
│  │  ├─ ComoComprar.tsx
│  │  ├─ Calculadora.tsx
│  │  ├─ TarjetaProducto.tsx
│  │  ├─ ProductoImagen.tsx       # PNG o placeholder SVG
│  │  ├─ PanelPaquete.tsx         # drawer / sidebar
│  │  ├─ NumeroAnimado.tsx
│  │  ├─ SobreNosotros.tsx
│  │  ├─ Footer.tsx
│  │  └─ FondoEstacion.tsx        # partículas según estación
│  ├─ styles/
│  │  └─ temas.css                # variables CSS por tema
│  ├─ App.tsx
│  └─ main.tsx
├─ tailwind.config.js
├─ index.html
└─ package.json
```

---

## 15. Orden de build para Claude Code

1. Inicializar Vite + React + TS, instalar dependencias (§1) y configurar Tailwind con los tokens
   de la marca (§3) + variables CSS de tema en `src/styles/temas.css`.
2. **Procesar imágenes:** ejecutar `scripts/procesar_imagenes.py` para llenar `public/productos/`
   (asumiendo que `imagenes/` ya tiene las fotos renombradas según §6.1).
3. Crear `src/data/productos.ts` y `src/lib/marca.ts`.
4. Hooks: `usePaquete.ts` (estado + total + persistencia) y `useTema.ts` (hora + estación).
5. Componentes en este orden: `ProductoImagen` → `TarjetaProducto` → `PanelPaquete` →
   `Calculadora` → `Header` → `Hero` → `ComoComprar` → `SobreNosotros` → `Footer` → `FondoEstacion`.
6. Animaciones con Framer Motion (§7.3, §10).
7. `whatsapp.ts` + integrar botón de checkout (§8).
8. Pulido responsive (§11), accesibilidad (§12), SEO (§13).
9. Probar: agregar/quitar productos, total correcto, link de WhatsApp con el detalle, cambio de
   tema según hora del día y estación, toggle manual claro/oscuro, `prefers-reduced-motion`.
10. Build (`npm run build`) y dejar listo para deploy en Netlify/Vercel.

---

## 16. Criterios de "terminado" (checklist)

- [ ] Las fotos de producto se ven **sin fondo**, flotando con sombra suave.
- [ ] Cada producto muestra su **precio individual** en el catálogo.
- [ ] Sumar/restar funciona y el producto **entra y sale del panel con animación suave**.
- [ ] El **total** se actualiza con número animado y formato `$` argentino.
- [ ] El botón abre **WhatsApp con el pedido detallado** ya escrito.
- [ ] La sección **"Cómo comprar"** explica claramente el proceso.
- [ ] El sitio **cambia de tema** según hora del día y estación, con transición suave.
- [ ] Hay **toggle manual** claro/oscuro y respeta `prefers-reduced-motion`.
- [ ] Funciona perfecto en **mobile** y se ve **moderno, cálido y profesional**.
- [ ] Footer con **WhatsApp** e **Instagram**.

---

## 17. Mejoras futuras (no obligatorias)

- Foto real para los 6 productos que hoy usan placeholder (§6.3).
- Compartir paquete por link (querystring con los ids + cantidades).
- Promos / combos sugeridos ("Pack degustación").
- Modo galería con foto real del frasco abierto / receta sugerida por producto.
- Multinúmero o derivación a varios vendedores si crece el equipo.

---

## 18. Prompt para pegar en Claude Code

> Copiá y pegá esto como **primer mensaje** en Claude Code, con el proyecto abierto y este `.md`
> y la carpeta `imagenes/` ya en la raíz.

```text
Sos un desarrollador senior full-stack experto en UX/UI y animación web. Vas a construir un
sitio web completo y listo para producción para "Placeres que Conectan", un negocio familiar de
productos regionales de San Juan, Argentina (aceite de oliva, aceitunas, aceto y dulces).

En la raíz del proyecto está el archivo `placeres-que-conectan-especificacion.md`. Leelo COMPLETO
y construí todo siguiéndolo al pie de la letra: es la fuente de verdad de productos, precios,
marca, arquitectura, animaciones, paletas de color y flujo de compra. Trabajá de forma autónoma.

Orden de trabajo:
1. Mirá la carpeta `imagenes/` (fotos crudas de producto ya renombradas). Creá y ejecutá
   `scripts/procesar_imagenes.py` (Python + rembg) para quitarles el fondo y generar los PNG
   transparentes con sombra suave en `public/productos/` (§6). Instalá rembg/Pillow si hace falta.
   Para los 6 productos sin foto (§6.3) generá placeholders SVG con la identidad de marca.
2. Stack: Vite + React 18 + TypeScript + Tailwind + Framer Motion + lucide-react (§1).
   NO uses APIs externas, ni claves, ni geolocalización.
3. Catálogo + calculadora de paquetes exactamente como en §7: tarjetas con imagen, nombre,
   chip de categoría, PRECIO INDIVIDUAL visible y stepper (− cantidad +). Panel "Mi paquete"
   (drawer en mobile, sidebar sticky en desktop) donde los productos ENTRAN y SALEN con animación
   suave (Framer Motion: AnimatePresence + layout). Total con número animado y formato $ argentino.
4. Botón "Finalizar pedido por WhatsApp" que abre wa.me con el pedido detallado (§8). Número:
   5492644456612. Incluí la sección "Cómo comprar" que explica el proceso al cliente.
5. Tema dinámico por hora del día + estación (hemisferio sur) usando EXACTAMENTE el objeto TEMAS
   con los 16 ambientes de §9.5. Toggle manual claro/oscuro/auto en el header. Transición de
   colores suave (~0.8s). Respetá prefers-reduced-motion y prefers-color-scheme.
6. Diseño ultra moderno, cálido y sofisticado, MOBILE-FIRST, con los colores y tipografías de §3
   y las microinteracciones de §10. Accesibilidad AA (§12) y SEO + JSON-LD LocalBusiness (§13).

Creá la estructura de carpetas de §14, instalá dependencias, generá todos los archivos y dejá el
proyecto corriendo con `npm run dev`. Si algo del .md te resulta ambiguo, elegí la opción más
profesional y consistente con la marca y dejámelo anotado al final. Cuando termines, hacé un
resumen de lo que creaste y cómo probarlo.
```

### Mensajes de seguimiento útiles (después del primer build)

```text
1) "Mostrame la calculadora en mobile y mejorá la animación de cuando un producto entra al
    panel: que sea más suave y con un pequeño efecto de 'vuelo' hacia el carrito."

2) "Probá los 16 temas: cambiá manualmente franja y estación y verificá que el texto siempre
    tenga buen contraste sobre el fondo. Ajustá los que se vean flojos."

3) "Optimizá las imágenes para web (WebP + lazy load) y corré un Lighthouse; apuntá a 90+ en
    Performance y Accesibilidad."

4) "Preparalo para deploy en Netlify: agregá el archivo de configuración y explicame los pasos."
```

---

*Fin del documento. Construir con cariño: es el negocio de una familia sanjuanina.* 🫒
