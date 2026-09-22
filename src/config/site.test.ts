import { describe, it, expect } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("has name", () => {
    expect(siteConfig.name).toBeTruthy();
  });

  it("has valid github URL", () => {
    expect(siteConfig.github).toMatch(/^https:\/\/github\.com\//);
  });

  it("has valid linkedin URL", () => {
    expect(siteConfig.linkedin).toMatch(/^https:\/\/linkedin\.com\/in\//);
  });

  it("has email with mailto prefix", () => {
    expect(siteConfig.email).toMatch(/^mailto:/);
  });

  it("has portfolio URL", () => {
    expect(siteConfig.portfolio).toMatch(/^https?:\/\//);
  });

  it("has resume path", () => {
    expect(siteConfig.resume).toBeTruthy();
  });
});
