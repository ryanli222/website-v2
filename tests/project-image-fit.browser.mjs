import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightEntry = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "3dwebgen",
  "node_modules",
  "playwright",
  "index.mjs",
);
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

test("wheelchair project hero contains the full portrait image", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://127.0.0.1:3000/projects/autonomous-wheelchair");

    const image = page.getByAltText("Autonomous Wheelchair Attachment");
    const fit = await image.evaluate((element) => ({
      objectFit: getComputedStyle(element).objectFit,
      naturalRatio: Number(
        (element.naturalWidth / element.naturalHeight).toFixed(2),
      ),
    }));

    assert.deepEqual(fit, {
      objectFit: "contain",
      naturalRatio: 0.75,
    });
  } finally {
    await browser.close();
  }
});
