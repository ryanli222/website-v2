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

test("homepage shows Scroll Wizard where ESP32 used to be", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:3000/");

    assert.equal(
      await page.locator('a[href="/projects/scroll-wizard"]').count(),
      1,
    );
    assert.equal(
      await page.locator('a[href="/projects/esp32-network"]').count(),
      0,
    );
    const scrollWizardImage = page.getByAltText("Scroll Wizard");
    assert.match(
      decodeURIComponent(await scrollWizardImage.getAttribute("src")),
      /\/projects\/scroll-wizard\/kynexa-card\.png/,
    );
    assert.equal(
      await scrollWizardImage.evaluate(
        (element) => getComputedStyle(element).objectFit,
      ),
      "contain",
    );
    await page.goto("http://127.0.0.1:3000/projects");
    assert.equal(
      await page.locator('a[href="/projects/esp32-network"]').count(),
      1,
    );
  } finally {
    await browser.close();
  }
});