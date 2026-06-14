import { chromium } from "playwright";

const BASE = "http://localhost:5173";
const FRANJAS = ["dia", "amanecer", "atardecer", "noche"];
const ESTACIONES = ["verano", "otono", "invierno", "primavera"];

// ---- utilidades de contraste WCAG ----
function parse(c) {
  c = c.trim();
  if (c.startsWith("#")) {
    const h = c.slice(1);
    const n = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
    return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) return m[1].split(",").slice(0, 3).map((x) => parseFloat(x));
  return [0, 0, 0];
}
function lum([r, g, b]) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const l1 = lum(parse(a)), l2 = lum(parse(b));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 720 } });

let fallos = 0;
console.log("AUDITORÍA DE CONTRASTE (16 temas) — AA texto normal ≥ 4.5, grande/UI ≥ 3.0\n");

for (const f of FRANJAS) {
  for (const e of ESTACIONES) {
    await page.goto(`${BASE}/?franja=${f}&estacion=${e}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const v = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      const g = (n) => s.getPropertyValue(n).trim();
      return {
        bg: g("--bg"), surface: g("--surface"), surface2: g("--surface-2"),
        text: g("--text"), textSoft: g("--text-soft"),
        accent: g("--accent"), accentStrong: g("--accent-strong"),
        onAccent: g("--on-accent"), onAccentStrong: g("--on-accent-strong"),
        theme: document.documentElement.dataset.theme,
      };
    });
    const checks = [
      ["texto/bg", ratio(v.text, v.bg), 4.5],
      ["texto/surface", ratio(v.text, v.surface), 4.5],
      ["textoSuave/surface", ratio(v.textSoft, v.surface), 4.5],
      ["precio (accentStrong/surface)", ratio(v.accentStrong, v.surface), 3.0],
      ["botón (on-accent/accent)", ratio(v.onAccent, v.accent), 3.0],
      ["hover (on-accentStrong/accentStrong)", ratio(v.onAccentStrong, v.accentStrong), 3.0],
    ];
    const malos = checks.filter(([, r, min]) => r < min);
    fallos += malos.length;
    const estado = malos.length ? "✗" : "✓";
    console.log(`${estado} ${f.padEnd(9)} ${e.padEnd(10)} [${v.theme}]  ` +
      checks.map(([n, r]) => `${n}=${r.toFixed(2)}`).join("  "));
    if (malos.length) malos.forEach(([n, r, min]) => console.log(`     ⚠ ${n} ${r.toFixed(2)} < ${min}`));
    await page.screenshot({ path: `scripts/_tema-${f}-${e}.png` });
  }
}

console.log(`\nTotal de pares por debajo de AA: ${fallos}`);

// ---- chips de categoría (texto blanco, texto chico → AA 4.5) ----
console.log("\nChips de categoría (blanco sobre color, AA ≥ 4.5):");
const CATS = {
  "Aceite de Oliva": "#566B2C", Aceto: "#8E3B5E", "Aceituna Verde": "#65722F",
  "Aceituna Negra": "#5A4632", Dulces: "#9C631A",
};
for (const [n, c] of Object.entries(CATS)) {
  const r = ratio("#ffffff", c);
  if (r < 4.5) fallos++;
  console.log(`  ${r >= 4.5 ? "✓" : "✗"} ${n.padEnd(16)} ${r.toFixed(2)}`);
}

// ---- test panel con MUCHOS productos (bug del footer) ----
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.locator("#calculadora").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const botones = page.getByRole("button", { name: /^Agregar / });
const n = await botones.count();
for (let i = 0; i < n; i++) await botones.nth(i).click(); // 1 de cada producto
await page.waitForTimeout(800);
const btnWa = page.locator("aside").getByRole("button", { name: /Finalizar pedido por WhatsApp/ });
const visible = await btnWa.isVisible();
const box = await btnWa.boundingBox();
const vh = page.viewportSize().height;
console.log(`\nPanel con ${n} productos distintos:`);
console.log(`  Botón WhatsApp visible: ${visible}`);
console.log(`  Botón dentro del viewport (bottom ${box ? Math.round(box.y + box.height) : "?"} ≤ ${vh}): ${box ? box.y + box.height <= vh + 1 : "?"}`);
await page.screenshot({ path: "scripts/_panel-lleno.png" });

await browser.close();
console.log("\nListo.");
