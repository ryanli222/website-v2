# Scroll Wizard Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add a Scroll Wizard portfolio entry with a reusable accessible video renderer and a headless-browser recording of the KYNEXA demo.

**Architecture:** Extend the data-driven `Project` section type with an optional video descriptor and render it through a focused client component. Capture KYNEXA with local Playwright/Chromium, encode the result for the web, and reference the resulting poster and MP4 from the Scroll Wizard project record.

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript, Tailwind CSS 4, native HTML video, Playwright Chromium, ffmpeg.

## Global Constraints

- Change only `C:\Users\ryanl\Desktop\actual website`; treat `C:\Users\ryanl\Desktop\3dwebgen` as read-only input.
- Use the project title **Scroll Wizard** and present KYNEXA as the showcase output.
- Preserve existing project image, diagram, simulator, and model behavior.
- Do not autoplay for visitors who prefer reduced motion.
- Do not ship the 154 MB KYNEXA source video.

---

### Task 1: Reusable project video

**Files:**
- Create: `src/components/project-video.tsx`
- Create: `src/lib/video-policy.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/app/projects/[slug]/page.tsx`
- Test: `tests/project-video.test.mjs`

**Interfaces:**
- Consumes: `ProjectVideo` with `src`, `poster`, `label`, `autoPlay`, `loop`, `muted`, and `controls`.
- Produces: `ProjectVideo` component rendered after section text and existing media.

- [x] **Step 1: Write a failing playback-policy test**

Use Node's test runner to render `ProjectVideo` and assert that autoplay is
present by default but removed when `matchMedia('(prefers-reduced-motion:
reduce)')` matches.

- [x] **Step 2: Run the test and verify the component is missing**

Run: `node --test tests/project-video.test.mjs`
Expected: FAIL because `src/components/project-video.tsx` does not exist.

- [x] **Step 3: Implement the minimal component and data contract**

Create a client component that reads reduced-motion preference, renders a
responsive native `<video>` with the passed source/poster/label, and falls back
to a poster-backed link if the media cannot play. Add `video?: ProjectVideo` to
project sections and render it without slug checks.

- [x] **Step 4: Run the focused test**

Run: `node --test tests/project-video.test.mjs`
Expected: PASS.

### Task 2: KYNEXA capture assets

**Files:**
- Create: `scripts/record-kynexa.mjs`
- Create: `public/projects/scroll-wizard/kynexa-demo.mp4`
- Create: `public/projects/scroll-wizard/kynexa-poster.webp`
- Test: `tests/record-kynexa.test.mjs`

**Interfaces:**
- Consumes: KYNEXA static site at `C:\Users\ryanl\Desktop\3dwebgen\robots\site`.
- Produces: deterministic 1440x900 silent recording and poster under the portfolio public path.

- [x] **Step 1: Write a failing capture-plan test**

Test exported `buildScrollStops()` against literal held-beat positions and
assert a monotonic sequence beginning at 0 and ending at 1.

- [x] **Step 2: Run the test and verify the recorder is missing**

Run: `node --test tests/record-kynexa.test.mjs`
Expected: FAIL because `scripts/record-kynexa.mjs` does not exist.

- [x] **Step 3: Implement and run headless capture**

Serve the KYNEXA directory over HTTP, launch Playwright Chromium headlessly with
video recording at 1440x900, scroll through the configured stops with readable
pauses, save the WebM, extract a poster frame, and encode a silent H.264 MP4 with
fast-start metadata.

- [x] **Step 4: Verify generated media**

Run `ffprobe` on the MP4 and confirm 1440x900 video, no audio stream, and a
materially smaller file than the 154 MB source.

### Task 3: Scroll Wizard project content

**Files:**
- Modify: `src/data/projects.ts`
- Test: `tests/scroll-wizard-project.test.mjs`

**Interfaces:**
- Consumes: `/projects/scroll-wizard/kynexa-demo.mp4` and poster.
- Produces: `/projects/scroll-wizard` plus its card on `/projects`.

- [x] **Step 1: Write a failing project-data test**

Assert `getProjectBySlug('scroll-wizard')` returns the approved title, six
article sections, GitHub link, poster image, and KYNEXA demo media paths.

- [x] **Step 2: Run the test and verify the record is absent**

Run: `node --test tests/scroll-wizard-project.test.mjs`
Expected: FAIL because the project is not yet in `projects`.

- [x] **Step 3: Add the project record**

Add concise, factual copy for Overview, How It Works, KYNEXA Demo, Design
Controls, Technical Implementation, and Outcome. Use the checked-out repository
and current canonical GitHub remote as evidence.

- [x] **Step 4: Run the focused data test**

Run: `node --test tests/scroll-wizard-project.test.mjs`
Expected: PASS.

### Task 4: Browser and production verification

**Files:**
- Modify only if verification exposes a defect.

- [x] **Step 1: Run automated checks**

Run:

```powershell
node --test tests/*.test.mjs
npm run lint
npm run build
git diff --check
```

- [x] **Step 2: Inspect in a browser**

Start the production or development server and inspect `/projects` plus
`/projects/scroll-wizard` at desktop and mobile sizes. Confirm poster display,
playback, controls, loop, responsive sizing, and reduced-motion behavior.

- [x] **Step 3: Review the final diff**

Confirm only the plan/spec, reusable component, project data, recorder/tests,
and generated demo assets changed.

