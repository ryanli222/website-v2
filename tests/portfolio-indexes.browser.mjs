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

test("projects show Scroll Wizard third and no VEX Drawing Robot", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:3000/projects");

    assert.deepEqual(
      await page
        .locator('main a[href^="/projects/"]')
        .evaluateAll((links) =>
          links.slice(0, 3).map((link) => link.getAttribute("href")),
        ),
      [
        "/projects/autonomous-wheelchair",
        "/projects/canopi",
        "/projects/scroll-wizard",
      ],
    );
    assert.equal(
      await page.locator('a[href="/projects/vex-drawing-robot"]').count(),
      0,
    );

    await page.goto("http://127.0.0.1:3000/projects/vex-drawing-robot");
    await assert.doesNotReject(() =>
      page.getByText("project not found.").waitFor(),
    );
  } finally {
    await browser.close();
  }
});

test("Hestus and UWFE are side by side with Hestus first", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    for (const route of ["/", "/experience"]) {
      const page = await browser.newPage({
        viewport: { width: 1280, height: 900 },
      });
      await page.goto(`http://127.0.0.1:3000${route}`);

      const hestus = page.locator('a[href="https://www.hestus.co/"]');
      const uwfe = page.locator('a[href="/experience/uwfe"]');
      const [hestusBox, uwfeBox] = await Promise.all([
        hestus.boundingBox(),
        uwfe.boundingBox(),
      ]);

      assert.ok(hestusBox && uwfeBox);
      assert.ok(Math.abs(hestusBox.y - uwfeBox.y) < 2);
      assert.ok(hestusBox.x < uwfeBox.x);
      assert.equal(await hestus.getAttribute("target"), "_blank");
      assert.equal(await hestus.getAttribute("rel"), "noopener noreferrer");
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("experience cards stack with Hestus first on mobile", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await page.goto("http://127.0.0.1:3000/experience");

    const hestusBox = await page
      .locator('a[href="https://www.hestus.co/"]')
      .boundingBox();
    const uwfeBox = await page
      .locator('a[href="/experience/uwfe"]')
      .boundingBox();

    assert.ok(hestusBox && uwfeBox);
    assert.ok(hestusBox.y < uwfeBox.y);
    assert.ok(Math.abs(hestusBox.x - uwfeBox.x) < 2);
  } finally {
    await browser.close();
  }
});
