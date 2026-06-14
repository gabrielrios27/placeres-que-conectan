import { formatoARS } from "../data/productos";
import { MARCA } from "./marca";

export interface ItemPedido {
  nombre: string;
  cantidad: number;
  precio: number;
}

export function armarLinkWhatsApp(items: ItemPedido[], total: number): string {
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
