# Hestus Experience and Portfolio Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the concise Hestus experience, present it beside UWFE, place Scroll Wizard third, remove VEX Drawing Robot, and critique the finished portfolio.

**Architecture:** Keep portfolio content in the existing data modules and reuse `ExperienceCard` on both index surfaces. Add explicit display ordering at the exported project boundary, safe external-link behavior inside `ExperienceCard`, and responsive two-column grids in the homepage and Experience tab.

**Tech Stack:** Next.js 16.2, React 19, TypeScript, Tailwind CSS, Node test runner, Playwright.

## Global Constraints

- Work directly on the current `master` branch because the user explicitly requested pushing the finished changes.
- Hestus copy is exactly `Hestus (YC S24)`, `Software Engineer`, and `Datasets and tooling.`
- Hestus links to `https://www.hestus.co/` in a new tab with `noopener noreferrer`.
- Hestus is first and UWFE second on both experience surfaces.
- Experience cards are one column on mobile and two columns from the medium breakpoint.
- Projects begin Autonomous Wheelchair, Canopi, then Scroll Wizard.
- VEX Drawing Robot is removed from shared project data and its former route uses the existing project-not-found state.
- Do not add a Hestus detail page or invent Hestus imagery, dates, stack, or additional copy.

---

### Task 1: Project index ordering and VEX removal

**Files:**
- Create: `tests/portfolio-data.test.mjs`
- Modify: `src/data/projects.ts`

**Interfaces:**
- Consumes: existing `Project`, `projects`, and `getProjectBySlug(slug)`.
- Produces: exported `projects` ordered for index display with VEX absent.

- [ ] **Step 1: Write the failing project-data tests**

```js
import test from "node:test";
import assert from "node:assert/strict";

import { experiences } from "../src/data/experience.ts";
import { getProjectBySlug, projects } from "../src/data/projects.ts";

test("projects lead with wheelchair, Canopi, and Scroll Wizard", () => {
  assert.deepEqual(
    projects.slice(0, 3).map((project) => project.slug),
    ["autonomous-wheelchair", "canopi", "scroll-wizard"],
  );
});

test("VEX Drawing Robot is no longer a project", () => {
  assert.equal(
    projects.some((project) => project.slug === "vex-drawing-robot"),
    false,
  );
  assert.equal(getProjectBySlug("vex-drawing-robot"), undefined);
});
```

- [ ] **Step 2: Run the data test and verify RED**

Run:

```powershell
node --test tests/portfolio-data.test.mjs
```

Expected: the ordering assertion reports Scroll Wizard in position one, and the VEX assertion reports that the project still exists.

- [ ] **Step 3: Implement the ordered export and remove VEX**

Rename the current literal to `const projectCatalog: Project[]`. Delete the complete `vex-drawing-robot` object. After the catalog, export a stable ordered array:

```ts
const projectIndexOrder = [
  "autonomous-wheelchair",
  "canopi",
  "scroll-wizard",
];

export const projects = [
  ...projectIndexOrder.flatMap((slug) =>
    projectCatalog.filter((project) => project.slug === slug),
  ),
  ...projectCatalog.filter(
    (project) => !projectIndexOrder.includes(project.slug),
  ),
];
```

Keep `getProjectBySlug` reading from the exported `projects`.

- [ ] **Step 4: Run the data test and verify GREEN**

Run:

```powershell
node --test tests/portfolio-data.test.mjs
```

Expected: both project tests pass.

### Task 2: Hestus experience data and external link behavior

**Files:**
- Modify: `tests/portfolio-data.test.mjs`
- Modify: `src/data/experience.ts`
- Modify: `src/components/experience-card.tsx`
- Modify: `src/app/experience/page.tsx`

**Interfaces:**
- Produces: `Experience.href?: string`, Hestus as `experiences[0]`, UWFE as `experiences[1]`, and safe external card links.
- Consumes: `ExperienceCard` props with the existing optional `href`.

- [ ] **Step 1: Add the failing Hestus data test**

```js
test("Hestus is the first concise experience and links to its product", () => {
  assert.deepEqual(
    experiences.slice(0, 2).map(({ slug, company, role, description, href }) => ({
      slug,
      company,
      role,
      description,
      href,
    })),
    [
      {
        slug: "hestus",
        company: "Hestus (YC S24)",
        role: "Software Engineer",
        description: "Datasets and tooling.",
        href: "https://www.hestus.co/",
      },
      {
        slug: "uwfe",
        company: "UWFE",
        role: "Suspension + Firmware Engineer",
        description:
          "CAN bus communication, sensor integration, and real-time control loops for the electric race car. Suspension geometry design and analysis for the mechanical performance of the vehicle.",
        href: "/experience/uwfe",
      },
    ],
  );
});
```

- [ ] **Step 2: Run the data test and verify RED**

Run:

```powershell
node --test tests/portfolio-data.test.mjs
```

Expected: the Hestus test fails because the first entry is UWFE and `href` is missing.

- [ ] **Step 3: Add Hestus and link metadata**

Add `href?: string` to `Experience`. Insert Hestus first with the exact copy and official product URL. Add `href: "/experience/uwfe"` to UWFE.

In `src/app/experience/page.tsx`, pass `href={exp.href}` to every `ExperienceCard`.

In `ExperienceCard`, derive:

```ts
const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
```

Apply only for external links:

```tsx
target={isExternal ? "_blank" : undefined}
rel={isExternal ? "noopener noreferrer" : undefined}
```

- [ ] **Step 4: Run the data test and verify GREEN**

Run:

```powershell
node --test tests/portfolio-data.test.mjs
```

Expected: all three data tests pass.

### Task 3: Side-by-side experience layouts

**Files:**
- Create: `tests/portfolio-indexes.browser.mjs`
- Modify: `src/app/page.tsx`
- Modify: `src/app/experience/page.tsx`

**Interfaces:**
- Consumes: the first two items from `experiences`.
- Produces: responsive experience grids on `/` and `/experience`.

- [ ] **Step 1: Write failing browser tests**

Use the repository’s existing sibling Playwright import pattern. Test desktop and mobile:

```js
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
```

- [ ] **Step 2: Run the browser tests and verify RED**

Run:

```powershell
node --test tests/portfolio-indexes.browser.mjs
```

Expected: Hestus selectors have no match and the browser test fails.

- [ ] **Step 3: Implement the responsive grids**

In `src/app/page.tsx`, import `experiences` and replace the single UWFE card with:

```tsx
<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
  {experiences.slice(0, 2).map((experience, index) => (
    <ExperienceCard
      key={experience.slug}
      role={experience.role}
      company={experience.company}
      description={experience.description}
      image={experience.image}
      delay={`delay-${Math.min(index + 6, 7)}`}
      href={experience.href}
    />
  ))}
</div>
```

In `src/app/experience/page.tsx`, replace the vertical flex container with:

```tsx
<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
```

- [ ] **Step 4: Run browser and data tests and verify GREEN**

Run:

```powershell
node --test tests/portfolio-data.test.mjs tests/portfolio-indexes.browser.mjs
```

Expected: five tests pass.

### Task 4: Verification, Impeccable critique, commit, and push

**Files:**
- Create: `.impeccable/critique/<generated-snapshot>.md`
- Modify only if critique execution requires its generated persistence metadata.

**Interfaces:**
- Consumes: finished local site on `http://127.0.0.1:3000`.
- Produces: verified code, a persisted critique snapshot, commits, and an updated remote `master`.

- [ ] **Step 1: Run complete verification**

Run the entire Node test suite, changed-file ESLint, `git diff --check`, and:

```powershell
npm run build
```

Expected: zero test failures, zero lint errors, no whitespace errors, and successful Next.js production build.

- [ ] **Step 2: Run the authorized dual-agent Impeccable critique**

Resolve a stable target slug for `src/app`, read the ignore file if present, then dispatch:

- Assessment A: design-director review with fresh browser tabs and no detector output.
- Assessment B: `detect.mjs --json src/app` plus browser evidence in independent fresh tabs.

Synthesize their outputs, persist the snapshot with `critique-storage.mjs`, delete the temp body, and read the five-run trend.

- [ ] **Step 3: Commit the implementation and critique snapshot**

Stage only the plan, implementation, tests, and generated critique snapshot. Commit without a co-author trailer.

- [ ] **Step 4: Push**

Run:

```powershell
git push origin master
```

Expected: remote `master` advances to the local verified commit.
