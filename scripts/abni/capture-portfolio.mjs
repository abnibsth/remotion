import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
// Each capture uses its own new directory, separate from executable source.
const destination = path.join(
  root,
  "public/abni-portfolio",
  `capture-${Date.now()}`,
);
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
try {
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      colorScheme: "dark",
    });
    await page.goto("https://www.abnibasit.me/", {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images]
          .filter((image) => image.getBoundingClientRect().top < innerHeight)
          .map((image) => image.decode().catch(() => {})),
      );
    });
    await page.waitForTimeout(1800);
    await page.screenshot({
      path: path.join(destination, `${name}.png`),
      animations: "disabled",
      fullPage: false,
    });
    console.log(`${name}: ${destination}/${name}.png`);
    await page.close();
  }
  await writeFile(
    path.join(destination, "source.json"),
    JSON.stringify(
      {
        url: "https://www.abnibasit.me/",
        capturedAt: new Date().toISOString(),
        desktop: { width: 1440, height: 900 },
        mobile: { width: 390, height: 844 },
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
