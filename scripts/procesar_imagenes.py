"""
Quita el fondo de las fotos de producto y las deja listas para la web.

Requisitos:  pip install rembg pillow onnxruntime numpy
Uso:         python scripts/procesar_imagenes.py
Entrada:     ./imagenes/*.jpg|*.png   (fotos crudas ya renombradas, ver §6.1)
Salida:      ./public/productos/*.png (fondo transparente, centrado, base alineada)

Todas las fotos se tomaron desde el MISMO lugar, con los productos asentados en
el mismo punto. Por eso el script trabaja en dos pasadas:
  1) recorta el fondo de cada foto y mide el producto;
  2) renderiza TODOS con una ESCALA COMÚN, centrados y con la base alineada.
Así se conservan las proporciones reales (una botella de 750 es más alta que un
frasco de 500) y los productos se ven completos, sin cortes y prolijos.
"""
from pathlib import Path
import numpy as np
from rembg import remove, new_session
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

ENTRADA = Path("imagenes")
SALIDA = Path("public/productos")

LADO = 1000          # lienzo cuadrado final (px)
# Rango de alto: el producto más bajo ocupa ALTO_MIN y el más alto ALTO_MAX.
# Comprimir el rango (en vez de una escala 100% real) evita que los frascos
# cortos (dulces) se vean diminutos al lado de las botellas altas, manteniendo
# igual el orden: las botellas siguen siendo las más grandes.
ALTO_MIN = 0.80
ALTO_MAX = 0.94      # debe ser <= BASE para no cortar la parte superior
ANCHO_MAX = 0.96     # ningún producto supera el 96% del ancho
BASE = 0.96          # línea de "piso" donde se apoyan todos (96% del alto)

session = new_session("isnet-general-use")


def recortar_producto(src: Path):
    """Pasada 1: quita el fondo, borra el watermark de las esquinas y devuelve
    el producto recortado a su bounding box (sin escalar todavía)."""
    img = Image.open(src).convert("RGBA")
    img = ImageOps.exif_transpose(img)
    sin_fondo = remove(img, session=session)

    # Borra el sello del celular (logo Motorola abajo-izquierda + fecha
    # abajo-derecha). Los productos están centrados, así que las esquinas
    # inferiores están vacías y se pueden limpiar sin tocar el producto.
    arr = np.array(sin_fondo)
    h, w = arr.shape[:2]
    y0 = int(h * 0.88)
    arr[y0:, : int(w * 0.16), 3] = 0
    arr[y0:, int(w * 0.84) :, 3] = 0

    # Limpia el halo semitransparente del recorte.
    arr[arr[:, :, 3] < 40, 3] = 0
    sin_fondo = Image.fromarray(arr)

    # Bounding box ROBUSTO: ignora filas/columnas con muy pocos pixeles opacos
    # (motas/ruido sueltos que inflarian el recorte y descuadrarian la escala).
    mask = arr[:, :, 3] > 40
    col = mask.sum(axis=0)
    row = mask.sum(axis=1)
    UMBRAL = 12  # se requieren >=12 px opacos para considerar la fila/col del producto
    xs = np.where(col >= UMBRAL)[0]
    ys = np.where(row >= UMBRAL)[0]
    if len(xs) and len(ys):
        sin_fondo = sin_fondo.crop((xs[0], ys[0], xs[-1] + 1, ys[-1] + 1))
    else:
        bbox = sin_fondo.getbbox()
        if bbox:
            sin_fondo = sin_fondo.crop(bbox)

    # Realce sutil de color y nitidez (que el producto "venda").
    rgb = sin_fondo.convert("RGB")
    rgb = ImageEnhance.Color(rgb).enhance(1.08)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.15)
    alpha = sin_fondo.split()[3]
    return Image.merge("RGBA", (*rgb.split(), alpha))


def render(prod: Image.Image, escala: float, out: Path):
    """Pasada 2: escala con el factor común, centra y apoya en la base."""
    w, h = prod.size
    nw, nh = max(1, round(w * escala)), max(1, round(h * escala))
    prod = prod.resize((nw, nh), Image.LANCZOS)

    lienzo = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    x = (LADO - nw) // 2
    y = max(0, int(LADO * BASE) - nh)  # base alineada, sin cortar arriba

    # Sombra suave debajo del producto (sensación "apoyado/flotando").
    sombra = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    alpha = prod.split()[3]
    sombra.paste((44, 30, 20, 90), (x, y + 16), alpha)
    sombra = sombra.filter(ImageFilter.GaussianBlur(22))
    lienzo = Image.alpha_composite(lienzo, sombra)

    lienzo.alpha_composite(prod, (x, y))

    SALIDA.mkdir(parents=True, exist_ok=True)
    lienzo.save(out)


if __name__ == "__main__":
    fotos = sorted(
        p for p in ENTRADA.iterdir()
        if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png")
    )
    if not fotos:
        print("No hay imagenes en ./imagenes/")
        raise SystemExit

    print(f"Pasada 1/2: recortando {len(fotos)} productos...")
    recortados = []
    for f in fotos:
        try:
            prod = recortar_producto(f)
            recortados.append((f, prod))
            print(f"  ok  {f.name:28} -> {prod.size[0]}x{prod.size[1]} px")
        except Exception as e:
            print(f"  ERROR con {f.name}: {e}")

    # Mapea cada alto real al rango [ALTO_MIN, ALTO_MAX] del lienzo (rango
    # comprimido): se conserva el orden de tamaños pero sin extremos diminutos.
    alturas = [p.size[1] for _, p in recortados]
    h_min, h_max = min(alturas), max(alturas)
    print(f"\nAlto real: {h_min}px..{h_max}px -> ocupa {int(ALTO_MIN*100)}%..{int(ALTO_MAX*100)}% del lienzo")

    print("Pasada 2/2: renderizando centrado y con base alineada...")
    for f, prod in recortados:
        w, h = prod.size
        frac = ALTO_MAX if h_max == h_min else (
            ALTO_MIN + (ALTO_MAX - ALTO_MIN) * (h - h_min) / (h_max - h_min)
        )
        escala = frac * LADO / h
        if w * escala > ANCHO_MAX * LADO:   # no desbordar el ancho
            escala = ANCHO_MAX * LADO / w
        out = SALIDA / (f.stem + ".png")
        render(prod, escala, out)
        print(f"  ok  {out.name:28} alto {round(h*escala)}px")
    print("Listo.")
