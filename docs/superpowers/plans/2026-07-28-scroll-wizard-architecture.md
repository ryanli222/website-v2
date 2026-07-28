# Scroll Wizard Architecture and Homepage Placement Plan

**Goal:** Add an interactive architecture tree to Scroll Wizard and replace the homepage ESP32 card with Scroll Wizard while retaining ESP32 in the Projects collection.

## Tasks

1. Extend the Scroll Wizard project-data test to require a Technical Implementation architecture with clickable node details.
2. Add a homepage regression test that requires Scroll Wizard and rejects an ESP32 homepage card.
3. Add the architecture graph and node descriptions to the Technical Implementation section.
4. Replace only the homepage ESP32 `ProjectCard` with Scroll Wizard and its KYNEXA poster.
5. Run focused tests, changed-file lint, the production build, and browser checks.
