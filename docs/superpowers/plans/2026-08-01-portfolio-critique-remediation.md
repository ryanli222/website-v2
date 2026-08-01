# Portfolio Critique Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio indexes and navigation accessible, readable, and reliable across desktop and mobile while preserving the current understated visual language.

**Architecture:** Keep the existing shared Header, Hero, and global token system as the only visual primitives changed. Add semantic page titles at each index route, use global focus and reduced-motion rules for consistent behavior, and verify the rendered desktop/mobile interaction through the current Playwright smoke suite.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Node.js built-in test runner, Playwright.

## Global Constraints

- Preserve the existing white, editorial portfolio visual system and project/experience data order.
- Leave the `/resume` CV endpoint unchanged until the user supplies a resume URL or asset.
- Do not change factual portfolio copy beyond concise route labels.
- Use visible `:focus-visible` treatment and honor `prefers-reduced-motion`.

---

### Task 1: Add regression coverage for index structure, navigation, and motion

**Files:**
- Modify: `tests/portfolio-indexes.browser.mjs`

**Interfaces:**
- Consumes: `GET /`, `GET /projects`, `GET /experience`, and the shared semantic `<header>` navigation.
- Produces: browser checks for visible route titles, mobile navigation width, keyboard focus, and reduced-motion behavior.

- [ ] **Step 1: Write the failing index and mobile navigation assertions**

```js
test("portfolio indexes expose route titles and mobile navigation stays within the viewport", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    for (const route of ["/projects", "/experience"]) {
      await page.goto(`http://127.0.0.1:3000${route}`);
      assert.equal(await page.locator("main h1").count(), 1);
      assert.equal(await page.locator("header").evaluate((header) => header.scrollWidth <= window.innerWidth), true);
    }
  } finally {
    await browser.close();
  }
});
```

- [ ] **Step 2: Run the index test to verify it fails**

Run: `node --test --test-name-pattern="portfolio indexes expose" tests/portfolio-indexes.browser.mjs`

Expected: FAIL because the Projects and Experience routes have no `<h1>`.

- [ ] **Step 3: Write the failing keyboard-focus and reduced-motion assertions**

```js
test("navigation keeps a visible focus ring and reduced-motion removes entrance animations", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://127.0.0.1:3000/");
    await page.getByRole("link", { name: "projects" }).focus();
    assert.notEqual(await page.getByRole("link", { name: "projects" }).evaluate((link) => getComputedStyle(link).outlineStyle), "none");
    assert.equal(await page.locator(".animate-hero-fade").evaluate((element) => getComputedStyle(element).animationName), "none");
  } finally {
    await browser.close();
  }
});
```

- [ ] **Step 4: Run the accessibility test to verify it fails**

Run: `node --test --test-name-pattern="navigation keeps" tests/portfolio-indexes.browser.mjs`

Expected: FAIL because focused navigation has no explicit focus-visible style and reduced-motion has no override.

- [ ] **Step 5: Add the minimal route, header, hero, and motion implementation**

```tsx
<main aria-labelledby="projects-heading">
  <h1 id="projects-heading">Projects</h1>
  {/* existing card grid */}
</main>
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 6: Run the browser test to verify it passes**

Run: `node --test tests/portfolio-indexes.browser.mjs`

Expected: PASS with all browser assertions completing.

- [ ] **Step 7: Commit**

```bash
git add tests/portfolio-indexes.browser.mjs src/components/header.tsx src/components/hero.tsx src/app/globals.css src/app/projects/page.tsx src/app/experience/page.tsx
git commit -m "fix: harden portfolio navigation and indexes"
```

### Task 2: Validate design and production build

**Files:**
- Modify: none expected

**Interfaces:**
- Consumes: the completed shared UI behavior from Task 1.
- Produces: validation evidence for the shipped presentation.

- [ ] **Step 1: Run static and build verification**

```bash
npm run lint
npm run build
```

- [ ] **Step 2: Run the design detector on the changed UI files**

```bash
node C:\Users\ryanl\.agents\skills\impeccable\scripts\detect.mjs --json src/components/header.tsx src/components/hero.tsx src/app/globals.css src/app/projects/page.tsx src/app/experience/page.tsx
```

- [ ] **Step 3: Inspect one desktop and one mobile browser render in a single bounded pass**

```bash
node --test tests/portfolio-indexes.browser.mjs
```

- [ ] **Step 4: Commit the plan record and push the verified branch**

```bash
git add docs/superpowers/plans/2026-08-01-portfolio-critique-remediation.md
git commit -m "docs: record portfolio accessibility plan"
git push origin master
```
