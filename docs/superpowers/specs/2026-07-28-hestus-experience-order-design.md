# Hestus Experience and Portfolio Ordering Design

## Scope

Update the portfolio indexes without adding a Hestus detail page:

- Place Scroll Wizard third on the Projects tab.
- Remove the VEX Drawing Robot project from the website.
- Add Hestus as the first experience entry.
- Show Hestus and UWFE side by side on both the homepage and Experience tab at medium viewports and above, stacking them on mobile.
- Link the Hestus card directly to the official Hestus product.
- Run an Impeccable critique after implementation and verification.

## Content

The Hestus card uses only the requested concise copy:

- Company: `Hestus (YC S24)`
- Role: `Software Engineer`
- Description: `Datasets and tooling.`
- Destination: `https://www.hestus.co/`

The entire Hestus card is the product link. It opens in a new tab with `noopener noreferrer`. UWFE continues to link to its existing internal experience page.

## Ordering

The Projects tab begins with:

1. Autonomous Wheelchair
2. Canopi
3. Scroll Wizard

All remaining projects retain their existing relative order. The homepage project arrangement does not change.

The VEX Drawing Robot entry is removed from the shared project data rather than hidden only on the index. It no longer appears on the Projects tab, and `/projects/vex-drawing-robot` returns the existing project-not-found state.

Experience ordering is:

1. Hestus
2. UWFE

This ordering is shared by the Experience tab and the homepage experience row.

## Layout

Both experience surfaces use one column on mobile and two equal columns from the medium breakpoint upward. Existing `ExperienceCard` styling remains the visual source of truth. Hestus has no invented image or additional copy; UWFE keeps its current image and detail content. Cards align to the start of the grid so the shorter text-only Hestus card is not padded with artificial empty height.

## Data and Linking

Add an optional `href` to the `Experience` data type. The Experience tab reads the link from the data object. The homepage uses the same Hestus content and destination while preserving the existing UWFE internal route.

`ExperienceCard` detects external HTTP links and adds the appropriate new-tab attributes. Internal experience links continue to use normal same-tab navigation.

## Verification

- Data test confirms Hestus copy, ordering, and product URL.
- Browser test confirms Scroll Wizard is third on the Projects tab.
- Data and browser tests confirm VEX Drawing Robot is absent and its former detail route returns the project-not-found state.
- Browser test confirms Hestus precedes UWFE and both cards share a two-column row on desktop while stacking on mobile.
- Browser test confirms the Hestus card links to the official product with safe external-link attributes.
- Changed-file lint, the existing project browser suite, and a production build must pass.
- The final Impeccable critique evaluates the homepage, Projects tab, and Experience tab after implementation.
