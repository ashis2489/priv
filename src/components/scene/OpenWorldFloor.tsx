/**
 * Open World Floor — one continuous building.
 *
 * Design language (architectural studio / premium office):
 *   • Floors: pale polished concrete, light and warm
 *   • Walls:  painted plaster, warm off-white (each room a faint tint)
 *   • Ceilings: matte white with recessed warm-white light panels
 *   • Windows: real wood-framed glazing with a soft daylight view
 *   • Doors:   solid timber doors with a glazed inset, stood open
 *   • Skirting: painted timber at every wall base
 *   • Signs:   brushed-metal engraved name plates on the wall
 *
 * No neon. No space backdrop. Colour lives in materials + daylight.
 *
 * Coordinate system: Y up, Z south (toward player).
 * All rooms are 10 × 9 × 3.4 m. CW = corridor width = 4.0 m.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { H, RW, RD, CW, SHELL } from "./sceneConstants";

// Re-export for consumers that import from here
export { H, RW, RD, CW, SHELL };

// ─── Material palette ────────────────────────────────────────────────────────
const FLOOR_CONCRETE = "#bdb8b0";   // pale polished concrete
const FLOOR_WOOD     = "#b08a5e";   // main-hq warm oak
const FLOOR_WOOD_LT  = "#c8b89a";   // light oak (knowledge / cloud)
const FLOOR_CONC_DK  = "#b3b3ad";   // cooler concrete (terminal)
const WALL_COOL      = "#e6e9ea";   // cool plaster (skills / experience)
const WALL_TERR      = "#ecd9cb";   // warm terracotta plaster (contact)
const CORR_CONCRETE  = "#a9a49b";   // corridor — slightly darker
const CEIL_COLOR     = "#f3f1ec";   // matte white ceiling
const WALL_WARM      = "#e9e3d8";   // main-hq walls — warm plaster
const WALL_NEUTRAL   = "#e7e3db";   // side-room walls
const SKIRT          = "#dad5cc";   // painted timber skirting
const WOOD           = "#6e4a2f";   // doors / window frames / sills
const METAL          = "#3a3d42";   // subtle metal frames
const GLASS          = "#bcd2dd";

// ─── Procedural textures ────────────────────────────────────────────────────
function makeSignTexture(label: string, sub: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 144;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 144);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ece7dd";
  ctx.font = "600 46px 'Inter', sans-serif";
  ctx.fillText(label, 256, 58);
  ctx.fillStyle = "#9aa0a6";
  ctx.font = "300 22px 'Inter', sans-serif";
  ctx.fillText(sub.toUpperCase(), 256, 100);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ─── Procedural surface grain (so walls/floors read as real materials) ────────
function makeGrainTex(base: string, count: number, size = 256): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  // Low-frequency mottle — large soft patches so the surface isn't perfectly flat
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = size * (0.3 + Math.random() * 0.4);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const shade = Math.random() > 0.5 ? 255 : 0;
    g.addColorStop(0, `rgba(${shade},${shade},${shade},0.05)`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  // Fine speckle grain
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = Math.random() * 1.4 + 0.3;
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = Math.random() * 0.025 + 0.006;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const plasterTex = makeGrainTex("#fbfaf7", 700);
plasterTex.repeat.set(3, 2);
const concreteTex = makeGrainTex("#ffffff", 1400);
concreteTex.repeat.set(5, 5);

// ─── Doorway opening with a real timber door stood open ──────────────────────
function DoorOpening({
  pos, rot = [0, 0, 0], openW, wallH, wallColor, thick = 0.22, showDoor = true,
}: {
  pos: [number, number, number];
  rot?: [number, number, number];
  openW: number;   // clear opening width
  wallH: number;   // wall height
  wallColor: string;
  thick?: number;
  showDoor?: boolean;
}) {
  const jambH  = wallH;
  const jambW  = (RW - openW) / 2;
  const headH  = wallH - H + 0.05;
  const doorH  = H - 0.1;
  const doorW  = openW * 0.94;

  return (
    <group position={pos} rotation={rot as [number, number, number]}>
      {/* Jambs */}
      <mesh position={[-(openW / 2 + jambW / 2), jambH / 2, 0]}><boxGeometry args={[jambW, jambH, thick]} /><meshStandardMaterial color={wallColor} roughness={0.9} /></mesh>
      <mesh position={[(openW / 2 + jambW / 2), jambH / 2, 0]}><boxGeometry args={[jambW, jambH, thick]} /><meshStandardMaterial color={wallColor} roughness={0.9} /></mesh>
      {/* Header */}
      <mesh position={[0, H - headH / 2, 0]}><boxGeometry args={[RW, headH, thick]} /><meshStandardMaterial color={wallColor} roughness={0.9} /></mesh>
      {/* Architrave reveal */}
      <mesh position={[-(openW / 2), jambH / 2, 0]}><boxGeometry args={[0.06, H, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.6} /></mesh>
      <mesh position={[(openW / 2), jambH / 2, 0]}><boxGeometry args={[0.06, H, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.6} /></mesh>
      <mesh position={[0, H, 0]}><boxGeometry args={[openW, 0.06, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.6} /></mesh>

      {/* Floor threshold — clean architectural transition across the opening */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[openW + 0.12, 0.04, 0.5]} />
        <meshStandardMaterial color={SKIRT} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Timber door, hinged open against the left jamb */}
      {showDoor && (
        <group position={[-openW / 2 + 0.04, 0, 0.06]} rotation={[0, -Math.PI * 0.52, 0]}>
          <group position={[0, doorH / 2, 0]}>
            <mesh castShadow><boxGeometry args={[doorW, doorH, 0.05]} /><meshStandardMaterial color={WOOD} roughness={0.55} /></mesh>
            {/* glazed inset */}
            <mesh position={[doorW * 0.26, 0.35, 0.03]}><boxGeometry args={[doorW * 0.42, doorH * 0.42, 0.02]} /><meshStandardMaterial color={GLASS} transparent opacity={0.22} roughness={0.1} /></mesh>
            {/* handle */}
            <mesh position={[doorW * 0.44, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.16, 10]} /><meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} /></mesh>
          </group>
        </group>
      )}
    </group>
  );
}

// ─── Ceiling detail: beams + crown molding (kills empty-ceiling feel) ─────────
function CeilDetail({ W, D, H, openSides }: {
  W: number; D: number; H: number; openSides: ("north" | "south" | "east" | "west")[];
}) {
  const solid = (s: string) => !openSides.includes(s as any);
  const y = H - 0.08;
  return (
    <group>
       {/* 3 low, low-contrast ceiling beams — subtle, not attention-grabbing */}
       {[-D * 0.3, 0, D * 0.3].map((z, i) => (
         <mesh key={i} position={[0, H - 0.06, z]}>
           <boxGeometry args={[W - 0.1, 0.1, 0.18]} />
           <meshStandardMaterial color="#e7e3da" roughness={0.9} />
         </mesh>
       ))}
      {/* Crown molding on solid walls */}
      {solid("north") && <mesh position={[0, y, -D / 2 + 0.04]}><boxGeometry args={[W, 0.14, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
      {solid("south") && <mesh position={[0, y, D / 2 - 0.04]}><boxGeometry args={[W, 0.14, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
      {solid("west") && <mesh position={[-W / 2 + 0.04, y, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[D, 0.14, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
      {solid("east") && <mesh position={[W / 2 - 0.04, y, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[D, 0.14, 0.06]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
    </group>
  );
}

// ─── Single room shell ───────────────────────────────────────────────────────
function RoomBox({
  cx, cz,
  W = RW, D = RD,
  wallColor = WALL_NEUTRAL,
  floorColor = FLOOR_CONCRETE,
  openSides = [] as ("north" | "south" | "east" | "west")[],
  rug = false,
}: {
  cx: number; cz: number; W?: number; D?: number;
  wallColor?: string; floorColor?: string;
  openSides?: ("north" | "south" | "east" | "west")[];
  rug?: boolean;
}) {
  return (
    <group position={[cx, 0, cz]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={floorColor} roughness={0.55} metalness={0.04} map={concreteTex} />
      </mesh>
      {/* Floor seam grid — very subtle, architectural tile joints */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[W, D, Math.round(W), Math.round(D)]} />
        <meshStandardMaterial color="#9c988f" wireframe transparent opacity={0.05} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={CEIL_COLOR} roughness={1} map={plasterTex} />
      </mesh>

      {/* Recessed warm-white ceiling light panels — 2×2 */}
      {[[-W * 0.22, -D * 0.22], [W * 0.22, -D * 0.22],
        [-W * 0.22, D * 0.22], [W * 0.22, D * 0.22]].map(([lx, lz], i) => (
        <group key={i} position={[lx, H - 0.02, lz]}>
          <mesh><boxGeometry args={[0.5, 0.03, 0.5]} /><meshStandardMaterial color="#1a1a1e" roughness={0.5} metalness={0.3} /></mesh>
          <mesh position={[0, -0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.42]} />
            <meshStandardMaterial color="#fff4e2" emissive="#fff4e2" emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}

      {/* Walls */}
      {!openSides.includes("north") && (
        <mesh position={[0, H / 2, -D / 2 - 0.08]} receiveShadow castShadow><boxGeometry args={[W, H, 0.16]} /><meshStandardMaterial color={wallColor} roughness={0.95} map={plasterTex} /></mesh>
      )}
      {!openSides.includes("south") && (
        <mesh position={[0, H / 2, D / 2 + 0.08]} rotation={[0, Math.PI, 0]} receiveShadow castShadow><boxGeometry args={[W, H, 0.16]} /><meshStandardMaterial color={wallColor} roughness={0.95} map={plasterTex} /></mesh>
      )}
      {!openSides.includes("west") && (
        <mesh position={[-W / 2 - 0.08, H / 2, 0]} receiveShadow castShadow><boxGeometry args={[0.16, H, D]} /><meshStandardMaterial color={wallColor} roughness={0.95} map={plasterTex} /></mesh>
      )}
      {!openSides.includes("east") && (
        <mesh position={[W / 2 + 0.08, H / 2, 0]} receiveShadow castShadow><boxGeometry args={[0.16, H, D]} /><meshStandardMaterial color={wallColor} roughness={0.95} map={plasterTex} /></mesh>
      )}

      {/* Skirting — all closed walls */}
      {!openSides.includes("north") && <mesh position={[0, 0.05, -D / 2 + 0.02]}><boxGeometry args={[W - 0.05, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
      {!openSides.includes("west") && <mesh position={[-W / 2 + 0.02, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[D - 0.05, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
      {!openSides.includes("east") && <mesh position={[W / 2 - 0.02, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}><boxGeometry args={[D - 0.05, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}
      {!openSides.includes("south") && <mesh position={[0, 0.05, D / 2 - 0.02]} rotation={[0, Math.PI, 0]}><boxGeometry args={[W - 0.05, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>}

      {/* Ceiling beams + crown molding — breaks up the empty ceiling */}
      <CeilDetail W={W} D={D} H={H} openSides={openSides} />

      {/* Area rug (main-hq) */}
      {rug && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -1.2]} receiveShadow>
          <planeGeometry args={[5.5, 3.6]} />
          <meshStandardMaterial color="#9c6f4e" roughness={0.95} />
        </mesh>
      )}
    </group>
  );
}

// ─── Corridor ────────────────────────────────────────────────────────────────
function Corridor({
  cx, cz, length, axis,
}: { cx: number; cz: number; length: number; axis: "x" | "z" }) {
  const W = axis === "x" ? length : CW;
  const D = axis === "z" ? length : CW;

  return (
    <group position={[cx, 0, cz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[W, D]} /><meshStandardMaterial color={CORR_CONCRETE} roughness={0.6} metalness={0.04} map={concreteTex} /></mesh>
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[W, D]} /><meshStandardMaterial color={CEIL_COLOR} roughness={1} /></mesh>

      {axis === "z" && (<>
        <mesh position={[-CW / 2 - 0.08, H / 2, 0]} receiveShadow castShadow><boxGeometry args={[0.16, H, length]} /><meshStandardMaterial color={WALL_NEUTRAL} roughness={0.95} map={plasterTex} /></mesh>
        <mesh position={[CW / 2 + 0.08, H / 2, 0]} receiveShadow castShadow><boxGeometry args={[0.16, H, length]} /><meshStandardMaterial color={WALL_NEUTRAL} roughness={0.95} map={plasterTex} /></mesh>
        <mesh position={[-CW / 2 + 0.02, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[length - 0.1, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>
        <mesh position={[CW / 2 - 0.02, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}><boxGeometry args={[length - 0.1, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>
      </>)}

      {axis === "x" && (<>
        <mesh position={[0, H / 2, -CW / 2 - 0.08]} receiveShadow castShadow><boxGeometry args={[length, H, 0.16]} /><meshStandardMaterial color={WALL_NEUTRAL} roughness={0.95} map={plasterTex} /></mesh>
        <mesh position={[0, H / 2, CW / 2 + 0.08]} rotation={[0, Math.PI, 0]} receiveShadow castShadow><boxGeometry args={[length, H, 0.16]} /><meshStandardMaterial color={WALL_NEUTRAL} roughness={0.95} map={plasterTex} /></mesh>
        <mesh position={[0, 0.05, -CW / 2 + 0.02]}><boxGeometry args={[length - 0.1, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>
        <mesh position={[0, 0.05, CW / 2 - 0.02]} rotation={[0, Math.PI, 0]}><boxGeometry args={[length - 0.1, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>
      </>)}

      {/* Warm-white linear ceiling light */}
      <mesh position={[0, H - 0.02, 0]}>
        <boxGeometry args={[axis === "x" ? length * 0.7 : 0.18, 0.03, axis === "z" ? length * 0.7 : 0.18]} />
        <meshStandardMaterial color="#fff4e2" emissive="#fff4e2" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

// ─── Hub junction ────────────────────────────────────────────────────────────
function Hub() {
  return (
    <group position={[0, 0, 30]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[CW, CW]} /><meshStandardMaterial color={CORR_CONCRETE} roughness={0.6} /></mesh>
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[CW, CW]} /><meshStandardMaterial color={CEIL_COLOR} roughness={1} /></mesh>
      <mesh position={[0, H / 2, CW / 2 + 0.08]} rotation={[0, Math.PI, 0]} receiveShadow castShadow><boxGeometry args={[CW, H, 0.16]} /><meshStandardMaterial color={WALL_NEUTRAL} roughness={0.95} map={plasterTex} /></mesh>
      <mesh position={[0, 0.05, CW / 2 - 0.02]} rotation={[0, Math.PI, 0]}><boxGeometry args={[CW - 0.1, 0.1, 0.03]} /><meshStandardMaterial color={SKIRT} roughness={0.7} /></mesh>
      <mesh position={[0, H - 0.02, 0]}><boxGeometry args={[0.4, 0.03, 0.4]} /><meshStandardMaterial color="#fff4e2" emissive="#fff4e2" emissiveIntensity={1.3} /></mesh>
    </group>
  );
}

// ─── Engraved name plate ─────────────────────────────────────────────────────
function RoomSign({
  position, rotation = [0, 0, 0], label, sub, color = "#cbb89a",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string; sub: string; color?: string;
}) {
  const tex = useMemo(() => makeSignTexture(label, sub), [label, sub]);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.01]} castShadow><boxGeometry args={[1.9, 0.56, 0.03]} /><meshStandardMaterial color="#2a2d33" roughness={0.5} metalness={0.45} /></mesh>
      <mesh position={[0, 0, 0.012]}><planeGeometry args={[1.8, 0.48]} /><meshStandardMaterial map={tex} transparent toneMapped={false} /></mesh>
      <mesh position={[0, 0.3, 0.018]}><boxGeometry args={[1.9, 0.012, 0.004]} /><meshStandardMaterial color={color} roughness={0.6} metalness={0.2} /></mesh>
    </group>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function OpenWorldFloor() {
  return (
    <group>
      {/* ══ MAIN HQ ══ (south/east/west open to corridors; doors at z=4.5 / x=±5) ══ */}
      <RoomBox cx={0} cz={0} wallColor={WALL_WARM} floorColor={FLOOR_WOOD} rug
        openSides={["south", "east", "west"]} />

      {/* ══ KNOWLEDGE LAB / SKILLS ══ */}
      <RoomBox cx={-14} cz={0} wallColor={WALL_COOL} floorColor={FLOOR_WOOD_LT}
        openSides={["east"]} />
      <Corridor cx={-7} cz={0} length={4} axis="x" />
      <DoorOpening pos={[-9, 0, 0]} rot={[0, -Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <DoorOpening pos={[-5, 0, 0]} rot={[0, Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_WARM} showDoor={false} />
      <RoomSign position={[-14, 2.5, -4.35]} label="SKILLS" sub="Knowledge Lab" color="#cbb89a" />

      {/* ══ TERMINAL LAB / EXPERIENCE ══ */}
      <RoomBox cx={14} cz={0} wallColor={WALL_COOL} floorColor={FLOOR_CONC_DK}
        openSides={["west"]} />
      <Corridor cx={7} cz={0} length={4} axis="x" />
      <DoorOpening pos={[9, 0, 0]} rot={[0, Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <DoorOpening pos={[5, 0, 0]} rot={[0, -Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_WARM} showDoor={false} />
      <RoomSign position={[14, 2.5, -4.35]} label="EXPERIENCE" sub="Terminal Lab" color="#cbb89a" />

      {/* ══ PROJECT LAB ══ */}
      <RoomBox cx={0} cz={16} wallColor={WALL_NEUTRAL} floorColor={FLOOR_CONCRETE}
        openSides={["north", "south"]} />
      <Corridor cx={0} cz={8} length={7} axis="z" />
      <DoorOpening pos={[0, 0, 4.5]} rot={[0, 0, 0]} openW={CW} wallH={H} wallColor={WALL_WARM} showDoor={false} />
      <DoorOpening pos={[0, 0, 11.5]} rot={[0, Math.PI, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <RoomSign position={[0, 2.5, 11.6]} rotation={[0, Math.PI, 0]} label="PROJECTS" sub="Project Lab" color="#cbb89a" />

      {/* ══ LOWER CORRIDOR ══ */}
      <Corridor cx={0} cz={24.3} length={7.6} axis="z" />
      <DoorOpening pos={[0, 0, 20.5]} rot={[0, 0, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <DoorOpening pos={[0, 0, 28.1]} rot={[0, Math.PI, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />

      {/* ══ HUB ══ */}
      <Hub />

      {/* ══ CLOUD CENTER / ABOUT ══ */}
      <RoomBox cx={-14} cz={32} wallColor={WALL_WARM} floorColor={FLOOR_WOOD_LT}
        openSides={["east"]} />
      <Corridor cx={-5.55} cz={32} length={6.9} axis="x" />
      <DoorOpening pos={[-9, 0, 32]} rot={[0, -Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <DoorOpening pos={[-2.1, 0, 32]} rot={[0, Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <RoomSign position={[-14, 2.5, 27.65]} label="ABOUT" sub="Cloud Center" color="#cbb89a" />

      {/* ══ CONTACT LOUNGE ══ */}
      <RoomBox cx={14} cz={32} wallColor={WALL_TERR} floorColor={FLOOR_WOOD}
        openSides={["west"]} />
      <Corridor cx={5.55} cz={32} length={6.9} axis="x" />
      <DoorOpening pos={[9, 0, 32]} rot={[0, Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <DoorOpening pos={[2.1, 0, 32]} rot={[0, -Math.PI / 2, 0]} openW={CW} wallH={H} wallColor={WALL_NEUTRAL} showDoor={false} />
      <RoomSign position={[14, 2.5, 27.65]} label="CONTACT" sub="Contact Lounge" color="#cbb89a" />
    </group>
  );
}
