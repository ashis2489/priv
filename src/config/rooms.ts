import type { RoomId } from "../store/useStore";

export interface RoomConfig {
  id: RoomId;
  label: string;
  sublabel: string;
  color: string;
  // World-space center of the room floor
  worldOffset: [number, number, number];
  // Where the player spawns when entering this room (world space)
  spawnPos: [number, number, number];
  spawnYaw: number;
}

// ──────────────────────────────────────────────────────────
// TRUE OPEN WORLD LAYOUT  (all rooms share one continuous world)
//
// Room dimensions: 10W × 9D
// Corridor width: 3.5  Corridor length: 3.0
//
// Top-down map (Z increases southward = toward camera):
//
//   [KNOWLEDGE -11,0,0]──────[MAIN HQ 0,0,0]──────[TERMINAL 11,0,0]
//                                  │
//                           corridor Z+9 to Z+12
//                                  │
//                          [PROJECT 0,0,16]
//                                  │
//                           corridor Z+25 to Z+28
//                                  │
//              [CLOUD -11,0,32]────[HUB 0,0,32]────[CONTACT 11,0,32]
//
// Rooms placed so their walls abut corridors seamlessly.
// ──────────────────────────────────────────────────────────

export const ROOMS: Record<RoomId, RoomConfig> = {
  "main-hq": {
    id: "main-hq",
    label: "CYBER CORE",
    sublabel: "Digital Headquarters",
    color: "#20D9E8",
    worldOffset: [0, 0, 0],
    spawnPos: [0, 1.62, 2.2],
    spawnYaw: 0,         // face the back wall / desk / VEDAA display
  },
  "knowledge-lab": {
    id: "knowledge-lab",
    label: "SKILLS",
    sublabel: "Technology Control Room",
    color: "#20D9E8",
    worldOffset: [-14, 0, 0],
    spawnPos: [-14, 1.65, 3.5],
    spawnYaw: 0,
  },
  "terminal-lab": {
    id: "terminal-lab",
    label: "EXPERIENCE",
    sublabel: "Timeline Command Center",
    color: "#8a5ae8",
    worldOffset: [14, 0, 0],
    spawnPos: [14, 1.65, 3.5],
    spawnYaw: 0,
  },
  "project-lab": {
    id: "project-lab",
    label: "PROJECTS",
    sublabel: "Technology Laboratory",
    color: "#20D9E8",
    worldOffset: [0, 0, 16],
    spawnPos: [0, 1.65, 19.5],
    spawnYaw: 0,
  },
  "cloud-center": {
    id: "cloud-center",
    label: "ABOUT",
    sublabel: "Vedaa Overview",
    color: "#4ECDC4",
    worldOffset: [-14, 0, 32],
    spawnPos: [-14, 1.65, 35.5],
    spawnYaw: 0,
  },
  "contact-lounge": {
    id: "contact-lounge",
    label: "CONTACT",
    sublabel: "Communication Console",
    color: "#FF4D6D",
    worldOffset: [14, 0, 32],
    spawnPos: [14, 1.65, 35.5],
    spawnYaw: 0,
  },
};

export const ROOM_ORDER: RoomId[] = [
  "main-hq",
  "knowledge-lab",
  "terminal-lab",
  "project-lab",
  "cloud-center",
  "contact-lounge",
];
