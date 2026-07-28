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

test("Hestus is the first concise experience and links to its product", () => {
  assert.deepEqual(
    experiences
      .slice(0, 2)
      .map(({ slug, company, role, description, href }) => ({
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
