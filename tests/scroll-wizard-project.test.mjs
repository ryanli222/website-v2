import test from "node:test";
import assert from "node:assert/strict";

import { getProjectBySlug } from "../src/data/projects.ts";

test("Scroll Wizard exposes the approved KYNEXA portfolio story", () => {
  const project = getProjectBySlug("scroll-wizard");

  assert.ok(project);
  assert.equal(project.title, "Scroll Wizard");
  assert.equal(project.sections.length, 6);
  assert.equal(project.image, "/projects/scroll-wizard/kynexa-card.png");
  assert.equal(project.imageStyle, "screen");
  assert.deepEqual(
    project.sections.map((section) => section.title),
    [
      "Overview",
      "How It Works",
      "KYNEXA Demo",
      "Design Controls",
      "Technical Implementation",
      "Outcome",
    ],
  );
  assert.deepEqual(project.sections[2].video, {
    src: "/projects/scroll-wizard/kynexa-demo.mp4",
    poster: "/projects/scroll-wizard/kynexa-poster.webp",
    label: "KYNEXA robotics website generated with Scroll Wizard, shown from its opening facility scene through the final robot reveal",
    autoPlay: true,
    loop: true,
    muted: true,
    controls: true,
  });
  assert.ok(
    project.links?.some(
      (link) => link.href === "https://github.com/ryanli222/scroll-wizard",
    ),
  );

  const technicalSection = project.sections.find(
    (section) => section.id === "technical-implementation",
  );
  assert.ok(technicalSection?.architecture);
  assert.deepEqual(
    technicalSection.architecture.groups.map((group) => group.id),
    ["INPUTS", "PIPELINE", "RUNTIME", "OUTPUT"],
  );
  assert.deepEqual(
    technicalSection.architecture.edges.map((edge) => [edge.from, edge.to]),
    [
      ["BRIEF", "PLAN"],
      ["MEDIA", "PLAN"],
      ["PLAN", "VALIDATE"],
      ["VALIDATE", "EXTRACT"],
      ["EXTRACT", "SCAFFOLD"],
      ["SCAFFOLD", "CONFIG"],
      ["CONFIG", "SCRUB"],
      ["SCRUB", "SITE"],
    ],
  );
  assert.ok(technicalSection.nodeDetails?.SCRUB);
});
