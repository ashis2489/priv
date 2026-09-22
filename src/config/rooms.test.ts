import { describe, it, expect } from "vitest";
import { ROOMS, ROOM_ORDER } from "./rooms";

const ROOM_SIZE = { W: 10, D: 9, H: 3.6 };
const CORRIDOR  = { W: 3.5, L: 4.0, H: 3.6 };

describe("ROOMS", () => {
  it("has all 6 rooms", () => {
    expect(Object.keys(ROOMS)).toHaveLength(6);
  });

  it("each room has required fields", () => {
    for (const [id, room] of Object.entries(ROOMS)) {
      expect(room.id).toBe(id);
      expect(room.label).toBeTruthy();
      expect(room.color).toMatch(/^#/);
      expect(room.worldOffset).toHaveLength(3);
      expect(room.spawnPos).toHaveLength(3);
      expect(typeof room.spawnYaw).toBe("number");
    }
  });

  it("main-hq is at origin", () => {
    expect(ROOMS["main-hq"].worldOffset).toEqual([0, 0, 0]);
  });
});

describe("ROOM_ORDER", () => {
  it("matches ROOMS keys", () => {
    expect(ROOM_ORDER).toEqual(Object.keys(ROOMS));
  });
});

describe("dimensions", () => {
  it("room size has W, D, H", () => {
    expect(ROOM_SIZE.W).toBeGreaterThan(0);
    expect(ROOM_SIZE.D).toBeGreaterThan(0);
    expect(ROOM_SIZE.H).toBeGreaterThan(0);
  });

  it("corridor has W, L, H", () => {
    expect(CORRIDOR.W).toBeGreaterThan(0);
    expect(CORRIDOR.L).toBeGreaterThan(0);
    expect(CORRIDOR.H).toBeGreaterThan(0);
  });
});
