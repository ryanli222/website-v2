import test from "node:test";
import assert from "node:assert/strict";

import { buildScrollStops, loaderWaitOptions } from "../scripts/record-kynexa.mjs";

test("KYNEXA capture stops follow the approved story from start to finish", () => {
  assert.deepEqual(buildScrollStops(), [
    0,
    0.05,
    0.13924,
    0.23715,
    0.34842,
    0.4787,
    0.6213,
    0.75158,
    0.86285,
    1,
  ]);
});

test("capture waits for the KYNEXA loader to become hidden", () => {
  assert.deepEqual(loaderWaitOptions(), { state: "hidden", timeout: 30_000 });
});