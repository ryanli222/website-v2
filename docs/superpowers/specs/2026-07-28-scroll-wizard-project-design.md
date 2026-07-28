# Scroll Wizard Project Page Design

## Goal

Add Scroll Wizard to the portfolio's Projects collection and present KYNEXA as
the primary proof of what the tool produces. The project detail page should read
like the site's existing long-form project articles while giving the generated
scroll experience enough visual space to be understood immediately.

## Positioning

- Project title: **Scroll Wizard**
- Subject: the reusable generator and workflow in `C:\Users\ryanl\Desktop\3dwebgen`
- Showcase: the generated KYNEXA robotics experience
- Core message: Scroll Wizard turns an approved visual direction, storyboard,
  and source media into a responsive scroll-scrub website with controlled
  pacing, overlays, sections, interactions, and progressive loading.

The copy must distinguish implemented capabilities from design documentation or
future work. It should describe the checked-out repository as it exists when the
page is implemented.

## Portfolio Integration

Add a Scroll Wizard card to `/projects` through the existing project data
collection. The card will use a still captured from the KYNEXA recording, not a
generic illustration. Its date, stack, subtitle, links, and article sections
will follow the existing `Project` structure.

The detail route will be `/projects/scroll-wizard`.

## Article Structure

The project article will contain these sections:

1. **Overview** — what Scroll Wizard makes and why it exists.
2. **How It Works** — the gated workflow from brief and storyboard through
   source media, scaffolding, and browser-ready output.
3. **KYNEXA Demo** — the embedded screen recording, introduced as a generated
   example rather than a separate project.
4. **Design Controls** — directions, overlay vocabulary, timing, holds,
   sections, and reduced-motion behavior.
5. **Technical Implementation** — the static output architecture, scroll
   runtime, media handling, validation, and browser testing.
6. **Outcome** — what the finished tool demonstrates and links to the source.

Copy should be concise, concrete, and consistent with the portfolio's existing
first-person engineering voice.

## Demo Recording

Use a headless Chromium session to load the local KYNEXA site through an HTTP
server. Record a desktop viewport at approximately 1440 by 900 pixels.

The capture should:

- begin on the fully rendered opening state;
- scroll smoothly and deliberately through the complete KYNEXA experience;
- pause briefly at the major held beats so the overlay text remains readable;
- finish on the final reveal;
- exclude browser chrome, mouse movement, debug UI, and recording controls;
- avoid abrupt wheel jumps or dead time;
- contain no audio.

The final recording will be trimmed and encoded as a web-friendly MP4. A still
from the opening or strongest mid-journey composition will become both the video
poster and the Projects card image. The encoded asset should balance visual
quality with portfolio load time; it must not reuse the 154 MB source video
directly.

## Reusable Media Model

Extend project sections with an optional video media object rather than
special-casing the Scroll Wizard slug in the route component. The object will
support:

- source path;
- poster path;
- accessible label or description;
- optional autoplay, loop, muted, and controls flags.

The project renderer will output a responsive native `<video>` element after the
section copy. Autoplay will only be used with muted and inline playback. Controls
remain available so visitors can pause, replay, or scrub. The poster ensures the
section still has a strong visual before the video loads.

The existing image, architecture diagram, CAD model, and simulator behaviors
must remain unchanged.

## Visual Treatment

Preserve the portfolio's current typography, spacing, monochrome palette, and
long-form article layout. The KYNEXA footage supplies the visual contrast; the
surrounding page should not imitate KYNEXA's black cinematic interface.

The video should:

- fill the available article-media width;
- use the same border and corner language as existing project imagery;
- maintain its aspect ratio at every breakpoint;
- avoid decorative framing, gradients, or custom playback chrome;
- display a clear focus treatment for keyboard users.

On narrow screens, the video remains within the content column without
horizontal scrolling.

## Accessibility and Motion

- Provide meaningful poster alt-equivalent text through nearby copy and an
  accessible video label.
- Keep native playback controls keyboard accessible.
- Use `playsInline` for mobile behavior.
- If the visitor prefers reduced motion, do not autoplay the recording.
- Ensure the poster and surrounding text remain useful if video playback fails.

## Error Handling

If the recording cannot load, the poster remains visible and the article copy
still explains the demo. The implementation should not block or hide the rest of
the project article because of a media error.

If headless capture exposes a problem in the generated KYNEXA site, document the
issue and avoid modifying the `3dwebgen` repository unless the user explicitly
expands the task.

## Verification

Before completion:

- confirm the KYNEXA capture plays from the public asset path;
- inspect the Projects card and detail page at desktop and mobile widths;
- verify autoplay, controls, looping, poster display, and reduced-motion
  behavior;
- confirm all existing project pages still render;
- run the repository lint command;
- run a production build;
- check `git diff --check`.

## Scope

This task changes only the portfolio repository. It reads and runs the local
KYNEXA output from `C:\Users\ryanl\Desktop\3dwebgen` to create the recording,
but does not modify Scroll Wizard, regenerate its source media, deploy either
site, or alter unrelated portfolio content.
