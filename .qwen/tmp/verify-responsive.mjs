import { chromium } from "@playwright/test";

const url = process.env.SHOT_URL || "http://localhost:4173/";
const outDir = "/home/antonypeter/Projects/kada-ya-moko-app/.qwen/tmp/shots2";
const bootWait = 23000; // let the health retry window exhaust so the shell renders

const browser = await chromium.launch();
async function shoot(width, height, name, fn) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(bootWait);
  if (fn) await fn(page);
  await page.screenshot({ path: `${outDir}/${name}.png` });
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
  }));
  console.log(name, JSON.stringify(m));
  await page.close();
}

for (const w of [320, 430]) await shoot(w, 800, `${w}-home`);
await shoot(375, 800, "375-home");
await shoot(375, 800, "375-drawer", async (page) => {
  await page.keyboard.press("Control+b");
  await page.waitForTimeout(400);
});
await shoot(375, 800, "375-settings", async (page) => {
  await page.keyboard.press("Control+,");
  await page.waitForTimeout(600);
});
await shoot(768, 900, "768-home");
await shoot(1440, 900, "1440-home");
await browser.close();
console.log("done");
