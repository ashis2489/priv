import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// device.ts checks window at module scope, so we need to mock before import
describe("isMobile", () => {
  let isMobile: typeof import("./device").isMobile;

  beforeEach(async () => {
    vi.stubGlobal("navigator", {
      maxTouchPoints: 0,
      userAgent: "Mozilla/5.0",
      hardwareConcurrency: 8,
      deviceMemory: 8,
    });
    vi.stubGlobal("window", { innerWidth: 1920, matchMedia: vi.fn().mockReturnValue({ matches: false }) });
    const mod = await import("./device");
    isMobile = mod.isMobile;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns false on wide desktop", () => {
    expect(isMobile()).toBe(false);
  });

  it("returns true on narrow viewport", () => {
    (window as any).innerWidth = 500;
    expect(isMobile()).toBe(true);
  });

  it("returns true on mobile UA with narrow width", () => {
    (navigator as any).userAgent = "iPhone";
    (window as any).innerWidth = 800;
    expect(isMobile()).toBe(true);
  });
});

describe("isLowEnd", () => {
  let isLowEnd: typeof import("./device").isLowEnd;

  beforeEach(async () => {
    vi.stubGlobal("navigator", {
      hardwareConcurrency: 8,
      deviceMemory: 8,
    });
    const mod = await import("./device");
    isLowEnd = mod.isLowEnd;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns false on beefy machine", () => {
    expect(isLowEnd()).toBe(false);
  });

  it("returns true on 2-core device", () => {
    (navigator as any).hardwareConcurrency = 2;
    expect(isLowEnd()).toBe(true);
  });

  it("returns true on low-memory device", () => {
    (navigator as any).deviceMemory = 2;
    expect(isLowEnd()).toBe(true);
  });
});
