import { chromium } from "@playwright/test";

const url = process.env.SHOT_URL || "https://kada-ya-moko.vercel.app/";
const outDir = process.env.SHOT_OUT || "/home/antonypeter/Projects/kada-ya-moko-app/.qwen/tmp/shots";
const widths = (process.env.SHOT_WIDTHS || "320,375,430,768,1024,1440").split(",").map(Number);
const wait = Number(process.env.SHOT_WAIT || 25000);

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch((e) => console.log("goto:", e.message));
  await page.waitForTimeout(wait);
  const file = `${outDir}/${width}.png`;
  await page.screenshot({ path: file });
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    title: document.title,
    bodyText: document.body.innerText.slice(0, 200).replace(/\n/g, " | "),
  }));
  console.log(width, JSON.stringify(overflow));
  await page.close();
}
await browser.close();
console.log("done");
