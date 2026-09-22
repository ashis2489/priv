import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useStore, type RoomId } from "../../store/useStore";
import { ROOMS } from "../../config/rooms";
import { mobileInput } from "../../utils/shared";
import { yawRef } from "../../utils/shared";
import * as THREE from "three";

const WALK_SPEED = 4.5;
const LOOK_SENS  = 0.002;
const EYE_H      = 1.65;
const R          = 0.3;

type W = [number, number, number, number]; // minX maxX minZ maxZ

// CW = 4.0, so corridor half-width = 2.0
const CW_HALF = 2.0;

// ── Corridor wall thickness (same as OpenWorldFloor: 0.16m thick walls) ──
// Corridor walls sit at ±CW_HALF from corridor centre, inner face at ±(CW_HALF - 0.08)
// We block at ±(CW_HALF - 0.08 - R) = ±1.62 to be safe → use ±1.7

const WALLS: W[] = [
  // ────────────────────────────────────────────────────────────────────────
  // MAIN HQ  (room centre [0,0,0], footprint X[-5,+5] Z[-4.5,+4.5])
  // ────────────────────────────────────────────────────────────────────────
  [-5,  5,   -4.5, -4.2],          // north (back) wall
  [-5, -4.7, -4.5, -CW_HALF],      // west wall — south half
  [-5, -4.7,  CW_HALF, 4.5],       // west wall — north half
  [ 4.7, 5,  -4.5, -CW_HALF],      // east wall — south half
  [ 4.7, 5,   CW_HALF, 4.5],       // east wall — north half
  [-5, -CW_HALF, 4.2, 4.5],        // south wall — left of corridor opening
  [ CW_HALF, 5,  4.2, 4.5],        // south wall — right of corridor opening

  // ────────────────────────────────────────────────────────────────────────
  // HQ ↔ KNOWLEDGE LAB  corridor  (cx=-7, axis=x, Z[-2,+2], X[-9,-5])
  // ────────────────────────────────────────────────────────────────────────
  [-9, -5, -4.5, -CW_HALF],        // north corridor wall
  [-9, -5,  CW_HALF,  4.5],        // south corridor wall

  // ────────────────────────────────────────────────────────────────────────
  // HQ ↔ TERMINAL LAB  corridor  (cx=+7, axis=x, Z[-2,+2], X[+5,+9])
  // ────────────────────────────────────────────────────────────────────────
  [5, 9, -4.5, -CW_HALF],          // north corridor wall
  [5, 9,  CW_HALF,  4.5],          // south corridor wall

  // ────────────────────────────────────────────────────────────────────────
  // HQ ↔ PROJECT LAB  corridor  (cz=8, axis=z, X[-2,+2], Z[+4.5,+11.5])
  // ────────────────────────────────────────────────────────────────────────
  [-5, -CW_HALF, 4.5, 11.5],       // west corridor wall
  [ CW_HALF, 5,  4.5, 11.5],       // east corridor wall

  // ────────────────────────────────────────────────────────────────────────
  // KNOWLEDGE LAB  (worldOffset [-14,0,0], footprint X[-19,-9] Z[-4.5,+4.5])
  // ────────────────────────────────────────────────────────────────────────
  [-19, -9,    -4.5, -4.2],        // north wall
  [-19, -18.7, -4.5,  4.5],        // west wall
  [-9.3, -9,   -4.5, -CW_HALF],    // east wall — north half
  [-9.3, -9,    CW_HALF, 4.5],     // east wall — south half
  [-19, -9,    4.2,  4.5],         // south wall

  // ────────────────────────────────────────────────────────────────────────
  // TERMINAL LAB  (worldOffset [+14,0,0], footprint X[+9,+19] Z[-4.5,+4.5])
  // ────────────────────────────────────────────────────────────────────────
  [9, 19,   -4.5, -4.2],           // north wall
  [9,  9.3, -4.5, -CW_HALF],       // west wall — north half
  [9,  9.3,  CW_HALF, 4.5],        // west wall — south half
  [18.7, 19, -4.5,  4.5],          // east wall
  [9, 19,    4.2,  4.5],           // south wall

  // ────────────────────────────────────────────────────────────────────────
  // PROJECT LAB  (worldOffset [0,0,16], footprint X[-5,+5] Z[+11.5,+20.5])
  // ────────────────────────────────────────────────────────────────────────
  [-5, -CW_HALF, 11.5, 11.8],      // north wall — left of corridor
  [ CW_HALF, 5,  11.5, 11.8],      // north wall — right of corridor
  [-5, -4.7,  11.5, 20.5],         // west wall
  [ 4.7, 5,   11.5, 20.5],         // east wall
  [-5, -CW_HALF, 20.2, 20.5],      // south wall — left of corridor
  [ CW_HALF, 5,  20.2, 20.5],      // south wall — right of corridor

  // ────────────────────────────────────────────────────────────────────────
  // PROJECT ↔ HUB  corridor  (cz=24.3, axis=z, X[-2,+2], Z[+20.5,+28.1])
  // ────────────────────────────────────────────────────────────────────────
  [-5, -CW_HALF, 20.5, 28.1],      // west corridor wall
  [ CW_HALF, 5,  20.5, 28.1],      // east corridor wall

  // ────────────────────────────────────────────────────────────────────────
  // HUB junction  (cx=0, cz=30, footprint X[-2,+2] Z[+28,+32])
  // No wall colliders here — the hub is an open junction. Corridor walls
  // define the passages; hub walls were blocking Cloud/Contact corridors.
  // ────────────────────────────────────────────────────────────────────────

  // ────────────────────────────────────────────────────────────────────────
  // HUB ↔ CLOUD  corridor  (cx=-5.55, axis=x, Z[+29.9,+34.1] X[-9,-2.1])
  // ────────────────────────────────────────────────────────────────────────
  [-9, -2.1, 29.9, 32 - CW_HALF],  // north corridor wall
  [-9, -2.1, 32 + CW_HALF, 34.1],  // south corridor wall

  // ────────────────────────────────────────────────────────────────────────
  // HUB ↔ CONTACT  corridor  (cx=+5.55, axis=x, Z[+29.9,+34.1] X[+2.1,+9])
  // ────────────────────────────────────────────────────────────────────────
  [2.1, 9, 29.9, 32 - CW_HALF],    // north corridor wall
  [2.1, 9, 32 + CW_HALF, 34.1],    // south corridor wall

  // ────────────────────────────────────────────────────────────────────────
  // CLOUD CENTER  (worldOffset [-14,0,32], footprint X[-19,-9] Z[+27.5,+36.5])
  // ────────────────────────────────────────────────────────────────────────
  [-19, -9,    27.5, 27.8],        // north wall
  [-19, -18.7, 27.5, 36.5],        // west wall
  [-9.3, -9,   27.5, 32 - CW_HALF], // east wall — north half
  [-9.3, -9,   32 + CW_HALF, 36.5], // east wall — south half
  [-19, -9,   36.2, 36.5],         // south wall

  // ────────────────────────────────────────────────────────────────────────
  // CONTACT LOUNGE  (worldOffset [+14,0,32], footprint X[+9,+19] Z[+27.5,+36.5])
  // ────────────────────────────────────────────────────────────────────────
  [9, 19,    27.5, 27.8],          // north wall
  [9,  9.3,  27.5, 32 - CW_HALF],  // west wall — north half
  [9,  9.3,  32 + CW_HALF, 36.5],  // west wall — south half
  [18.7, 19, 27.5, 36.5],          // east wall
  [9, 19,   36.2, 36.5],           // south wall
];

function blocked(x: number, z: number): boolean {
  for (const [x0, x1, z0, z1] of WALLS) {
    if (x + R > x0 && x - R < x1 && z + R > z0 && z - R < z1) return true;
  }
  return false;
}

function detectRoom(x: number, z: number): RoomId {
  if (x > -19 && x < -9  && z > -4.5 && z < 4.5)  return "knowledge-lab";
  if (x >   9 && x <  19 && z > -4.5 && z < 4.5)  return "terminal-lab";
  if (x >  -5 && x <   5 && z >  11  && z < 21)   return "project-lab";
  if (x > -19 && x <  -9 && z >  27  && z < 37)   return "cloud-center";
  if (x >   9 && x <  19 && z >  27  && z < 37)   return "contact-lounge";
  return "main-hq";
}

const _v = new THREE.Vector3();
const _e = new THREE.Euler();

export function PlayerController() {
  const { camera, gl } = useThree();
  const { setPointerLocked, setCurrentRoom } = useStore();

  const yaw      = useRef(Math.PI);
  const pitch    = useRef(0);
  const lastRoom = useRef<RoomId>("main-hq");

  const panelRef = useRef<string | null>(null);
  useEffect(() => {
    panelRef.current = useStore.getState().activePanel;
    return useStore.subscribe(s => { panelRef.current = s.activePanel; });
  }, []);

  // ── Key state ──────────────────────────────────────────────────────────────
  const keys = useRef({ f: false, b: false, l: false, r: false, run: false });

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      // Ignore key events when typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "KeyW"      || e.code === "ArrowUp")    { keys.current.f   = true; e.preventDefault(); }
      if (e.code === "KeyS"      || e.code === "ArrowDown")  { keys.current.b   = true; e.preventDefault(); }
      if (e.code === "KeyA"      || e.code === "ArrowLeft")  { keys.current.l   = true; e.preventDefault(); }
      if (e.code === "KeyD"      || e.code === "ArrowRight") { keys.current.r   = true; e.preventDefault(); }
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.current.run = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW"      || e.code === "ArrowUp")    keys.current.f   = false;
      if (e.code === "KeyS"      || e.code === "ArrowDown")  keys.current.b   = false;
      if (e.code === "KeyA"      || e.code === "ArrowLeft")  keys.current.l   = false;
      if (e.code === "KeyD"      || e.code === "ArrowRight") keys.current.r   = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keys.current.run = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup",   up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup",   up);
    };
  }, []);

  // ── Spawn ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const sp = ROOMS["main-hq"];
    camera.position.set(sp.spawnPos[0], EYE_H, sp.spawnPos[2]);
    yaw.current    = sp.spawnYaw;
    yawRef.current = sp.spawnYaw;
  }, [camera]);

  // ── Sync look direction after quick navigation ────────────────────────────
  useEffect(() => useStore.subscribe((s, prev) => {
    if (!prev.transitioning && s.transitioning) {
      pitch.current = 0;
    }

    if (prev.transitioning && !s.transitioning) {
      const cfg = ROOMS[s.currentRoom];
      yaw.current    = cfg.spawnYaw;
      yawRef.current = cfg.spawnYaw;
      pitch.current  = 0;
    }
  }), []);

  // ── Look controls — pointer lock when available, drag fallback otherwise ──
  useEffect(() => {
    const c = gl.domElement;
    let dragging = false;

    const onLockChange = () => {
      const locked = document.pointerLockElement === c;
      setPointerLocked(locked);
    };

    const onMouseMove = (e: MouseEvent) => {
      const locked = document.pointerLockElement === c;
      if (!locked && !dragging) return;
      yaw.current   -= e.movementX * LOOK_SENS;
      pitch.current -= e.movementY * LOOK_SENS;
      pitch.current  = THREE.MathUtils.clamp(pitch.current, -Math.PI / 3, Math.PI / 4);
    };

    // Click focuses the frame (so WASD reaches us inside iframes) and asks for
    // pointer lock. If the browser/iframe denies lock, drag-to-look still works.
    const onClick = () => {
      if (panelRef.current) return;
      try { window.focus(); c.focus(); } catch { /* noop */ }
      if (document.pointerLockElement !== c) {
        try { c.requestPointerLock(); } catch { /* noop */ }
      }
    };
    const onMouseDown = () => {
      if (panelRef.current) return;
      if (document.pointerLockElement === c) return;
      dragging = true;
      try { c.focus(); window.focus(); } catch { /* noop */ }
    };
    const onMouseUp = () => { dragging = false; };

    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("mousemove", onMouseMove);
    c.addEventListener("click", onClick);
    c.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("mousemove", onMouseMove);
      c.removeEventListener("click", onClick);
      c.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [gl, setPointerLocked]);

  // Release pointer lock when a panel opens
  useEffect(() => useStore.subscribe(s => {
    if (s.activePanel && document.pointerLockElement) document.exitPointerLock();
  }), []);

  // ── Frame loop ─────────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    const k  = keys.current;
    const dt = Math.min(delta, 0.05);
    const spd = WALK_SPEED * (k.run ? 1.7 : 1) * dt;

    _v.set(0, 0, 0);
    if (k.f) _v.z -= 1;
    if (k.b) _v.z += 1;
    if (k.l) _v.x -= 1;
    if (k.r) _v.x += 1;

    // Mobile joystick
    const mob = Math.abs(mobileInput.dx) > 0.05 || Math.abs(mobileInput.dz) > 0.05;
    if (mob) { _v.x += mobileInput.dx; _v.z += mobileInput.dz; }

    if (_v.lengthSq() > 0) {
      _v.normalize().applyEuler(_e.set(0, yaw.current, 0));
      const nx = camera.position.x + _v.x * spd;
      const nz = camera.position.z + _v.z * spd;
      if (!blocked(nx, camera.position.z)) camera.position.x = nx;
      if (!blocked(camera.position.x, nz)) camera.position.z = nz;
    }

    camera.position.y = EYE_H;
    camera.quaternion.setFromEuler(_e.set(pitch.current, yaw.current, 0, "YXZ"));

    const room = detectRoom(camera.position.x, camera.position.z);
    if (room !== lastRoom.current) {
      lastRoom.current = room;
      setCurrentRoom(room);
    }
  });

  return null;
}
