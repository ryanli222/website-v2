import { createReadStream, existsSync } from "node:fs";
import { mkdir, mkdtemp } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".webp", "image/webp"],
]);

export function buildScrollStops() {
  return [
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
  ];
}

export function loaderWaitOptions() {
  return { state: "hidden", timeout: 30_000 };
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function startStaticServer(rootDirectory) {
  const root = path.resolve(rootDirectory);
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    const requestedPath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.resolve(root, `.${requestedPath}`);

    if (!filePath.startsWith(`${root}${path.sep}`) || !existsSync(filePath)) {
      response.writeHead(404).end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": MIME_TYPES.get(path.extname(filePath)) ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(response);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to determine KYNEXA preview port");
  }

  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

export async function recordKynexa() {
  const workspaceRoot = path.resolve(import.meta.dirname, "..");
  const kynexaRoot = path.resolve(workspaceRoot, "..", "3dwebgen", "robots", "site");
  const playwrightEntry = path.resolve(
    workspaceRoot,
    "..",
    "3dwebgen",
    "node_modules",
    "playwright",
    "index.mjs",
  );
  const outputDirectory = path.join(
    workspaceRoot,
    "public",
    "projects",
    "scroll-wizard",
  );

  if (!existsSync(path.join(kynexaRoot, "index.html"))) {
    throw new Error(`KYNEXA site not found at ${kynexaRoot}`);
  }
  if (!existsSync(playwrightEntry)) {
    throw new Error(`Playwright not found at ${playwrightEntry}`);
  }

  await mkdir(outputDirectory, { recursive: true });
  const captureDirectory = await mkdtemp(path.join(tmpdir(), "kynexa-capture-"));
  const preview = await startStaticServer(kynexaRoot);
  const { chromium } = await import(pathToFileURL(playwrightEntry).href);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: captureDirectory,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();
  const video = page.video();

  try {
    await page.goto(preview.url, { waitUntil: "networkidle" });
    await page.waitForSelector("#loader", loaderWaitOptions());
    await page.waitForTimeout(1_200);

    for (const stop of buildScrollStops()) {
      await page.evaluate(async (progress) => {
        const maximumScroll = document.documentElement.scrollHeight - window.innerHeight;
        const start = window.scrollY;
        const target = maximumScroll * progress;
        const duration = 900;
        const startedAt = performance.now();

        await new Promise((resolve) => {
          const tick = (now) => {
            const elapsed = Math.min(1, (now - startedAt) / duration);
            const eased = elapsed < 0.5
              ? 4 * elapsed * elapsed * elapsed
              : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
            window.scrollTo(0, start + (target - start) * eased);
            if (elapsed < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
      }, stop);
      await page.waitForTimeout(stop === 0 || stop === 1 ? 1_100 : 650);
    }

    await page.waitForTimeout(900);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
    await preview.close();
  }

  if (!video) throw new Error("Playwright did not create a video recording");
  const webmPath = await video.path();
  const mp4Path = path.join(outputDirectory, "kynexa-demo.mp4");
  const posterPath = path.join(outputDirectory, "kynexa-poster.webp");

  await run("ffmpeg", [
    "-y",
    "-i",
    webmPath,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "24",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mp4Path,
  ]);
  await run("ffmpeg", [
    "-y",
    "-ss",
    "5",
    "-i",
    mp4Path,
    "-frames:v",
    "1",
    "-c:v",
    "libwebp",
    "-quality",
    "82",
    posterPath,
  ]);

  console.log(`Recorded ${mp4Path}`);
  console.log(`Created ${posterPath}`);
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
  : false;

if (isDirectRun) {
  await recordKynexa();
}
