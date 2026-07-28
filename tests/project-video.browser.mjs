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

test("the Scroll Wizard demo autoplays only without reduced motion", async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    const motionContext = await browser.newContext({ reducedMotion: "no-preference" });
    const motionPage = await motionContext.newPage();
    await motionPage.goto("http://127.0.0.1:3000/projects/scroll-wizard");
    await motionPage.waitForFunction(() => {
      const video = document.querySelector("video");
      return video && !video.paused && video.currentTime > 0;
    });
    const playback = await motionPage.locator("video").evaluate((video) => ({
      paused: video.paused,
      currentTime: video.currentTime,
    }));
    assert.equal(playback.paused, false);
    assert.ok(playback.currentTime > 0);
    await motionContext.close();

    const reducedContext = await browser.newContext({ reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto("http://127.0.0.1:3000/projects/scroll-wizard");
    await reducedPage.waitForTimeout(750);
    const reducedPlayback = await reducedPage.locator("video").evaluate((video) => ({
      autoplay: video.autoplay,
      paused: video.paused,
      currentTime: video.currentTime,
    }));
    assert.deepEqual(reducedPlayback, {
      autoplay: false,
      paused: true,
      currentTime: 0,
    });
    await reducedContext.close();
  } finally {
    await browser.close();
  }
});