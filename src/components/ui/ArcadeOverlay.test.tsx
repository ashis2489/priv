import { describe, it, expect } from "vitest";
import { hitsPipe, type Pipe } from "./ArcadeOverlay";

// BIRD_X=60, BIRD_W=28 → bird spans x 60..88
const pipe = (x: number, topH: number): Pipe => ({ x, topH, scored: false });

describe("hitsPipe", () => {
  it("misses when the pipe is far to the right", () => {
    expect(hitsPipe(100, 118, pipe(300, 50))).toBe(false);
  });

  it("misses when bird is inside the gap", () => {
    // pipe gap = topH(50) .. 50+115=165; bird 100..118 sits inside
    expect(hitsPipe(100, 118, pipe(70, 50))).toBe(false);
  });

  it("hits the top pipe when bird is above the gap", () => {
    // bird 30..48 is above topH=50, and horizontally overlapping (x 70..130)
    expect(hitsPipe(30, 48, pipe(70, 50))).toBe(true);
  });

  it("hits the bottom pipe when bird is below the gap", () => {
    // bird 170..188 is below gap end 165
    expect(hitsPipe(170, 188, pipe(70, 50))).toBe(true);
  });

  it("misses when pipe has passed behind the bird", () => {
    // pipe ends at x=56 < BIRD_X=60
    expect(hitsPipe(100, 118, pipe(-4, 50))).toBe(false);
  });

  it("edge: bird exactly flush with gap boundary is safe", () => {
    // bird 50..68 starts exactly at topH → inside gap
    expect(hitsPipe(50, 68, pipe(70, 50))).toBe(false);
    // bird 147..165 ends exactly at gap bottom → inside gap
    expect(hitsPipe(147, 165, pipe(70, 50))).toBe(false);
  });
});
