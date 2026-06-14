import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto("http://localhost:5173/");
await page.evaluate(() => localStorage.setItem("tema_pref", "claro"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "scripts/_shot-claro-hero.png" });
await page.locator("#calculadora").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /^Agregar / }).nth(8).click(); // un dulce (placeholder?)
await page.waitForTimeout(700);
await page.screenshot({ path: "scripts/_shot-claro-calc.png" });
await browser.close();
console.log("ok");
