import test from "node:test";
import assert from "node:assert/strict";

import { shouldAutoplayVideo } from "../src/lib/video-policy.ts";

test("autoplay is disabled when the visitor prefers reduced motion", () => {
  assert.equal(shouldAutoplayVideo(true, true), false);
});

test("autoplay follows the project setting when reduced motion is off", () => {
  assert.equal(shouldAutoplayVideo(true, false), true);
  assert.equal(shouldAutoplayVideo(false, false), false);
});
