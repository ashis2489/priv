import { describe, it, expect } from "vitest";
import { projects } from "./projects";

describe("projects", () => {
  it("has 3 projects", () => {
    expect(projects).toHaveLength(3);
  });

  it("each project has required fields", () => {
    for (const p of projects) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThan(0);
      expect(["live", "wip", "complete"]).toContain(p.status);
      expect(p.color).toMatch(/^#/);
    }
  });

  it("project IDs are unique", () => {
    const ids = projects.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
