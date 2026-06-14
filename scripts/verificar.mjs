import { chromium } from "playwright";

const errores = [];
const browser = await chromium.launch();

// ---------- Desktop ----------
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") errores.push("CONSOLE: " + m.text());
});
page.on("pageerror", (e) => errores.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/_shot-hero.png" });

// Ir a la calculadora
await page.locator("#calculadora").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

// Agregar 2 productos (botones "Agregar ...")
const agregar = page.getByRole("button", { name: /^Agregar / });
await agregar.nth(0).click();
await agregar.nth(0).click();
await agregar.nth(2).click();
await page.waitForTimeout(900);

// Leer el total del panel sidebar
const totalTxt = await page.locator("aside").getByText(/\$/).last().innerText();
console.log("Total sidebar:", totalTxt);

await page.screenshot({ path: "scripts/_shot-calculadora.png" });

// Verificar link de WhatsApp (interceptar window.open)
await page.evaluate(() => {
  window.__waLink = null;
  window.open = (url) => {
    window.__waLink = url;
    return null;
  };
});
await page.getByRole("button", { name: /Finalizar pedido por WhatsApp/ }).click();
const waLink = await page.evaluate(() => window.__waLink);
console.log("WhatsApp link:", waLink ? decodeURIComponent(waLink).slice(0, 120) : "NULL");

// Toggle de tema oscuro
await page.getByRole("button", { name: "Tema oscuro" }).click();
await page.waitForTimeout(1000);
const theme = await page.evaluate(() => document.documentElement.dataset.theme);
console.log("data-theme tras 'oscuro':", theme);
await page.screenshot({ path: "scripts/_shot-oscuro.png" });

// ---------- Mobile ----------
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
});
const mpage = await mctx.newPage();
mpage.on("pageerror", (e) => errores.push("MOBILE PAGEERROR: " + e.message));
await mpage.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await mpage.locator("#calculadora").scrollIntoViewIfNeeded();
await mpage.waitForTimeout(500);
await mpage.getByRole("button", { name: /^Agregar / }).first().click();
await mpage.waitForTimeout(400);
await mpage.getByRole("button", { name: /Mi paquete/ }).click();
await mpage.waitForTimeout(900);
await mpage.screenshot({ path: "scripts/_shot-mobile-drawer.png" });

await browser.close();

console.log("\n=== ERRORES (" + errores.length + ") ===");
for (const e of errores) console.log(e);
if (errores.length === 0) console.log("Sin errores de consola/runtime.");
