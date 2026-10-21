import { chromium } from "playwright-core";
import fs from "node:fs/promises";
const report = JSON.parse(
  await fs.readFile("out/sejuk/render-report.json", "utf8"),
);
const browser = await chromium.launch({
  executablePath: report.browserExecutable,
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
  });
  await page.goto("http://localhost:3000/SejukSigap", {
    waitUntil: "domcontentloaded",
  });
  await page.screenshot({ path: "out/sejuk/studio.png" });
  console.log("STUDIO", await page.title());
} finally {
  await browser.close();
}
