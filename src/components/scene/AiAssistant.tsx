import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Vector3, type Group } from "three";
import { useCursor } from "../../utils/useCursor";
import { blocked } from "../player/PlayerController";

const TIPS = [
  "Hi! I'm your AI guide — click me for a tip",
  "WASD to move · mouse to look around",
  "Click desks, screens and posters to open panels",
  "Shift sprints · Esc releases the mouse",
  "Glowing doors lead to PROJECTS, SKILLS and CONTACT",
  "The minimap shows where you are",
  "I follow you into every room — keep exploring!",
];

const FRONT_DIST = 1.9; // ahead of the player
const SIDE_DIST = 0.6; // biased a little to the right of center
const TELEPORT_DIST_SQ = 9; // >3u camera jump in one frame = room transition

const _wp = new Vector3();
const _target = new Vector3();
const _fwd = new Vector3();
const _right = new Vector3();
const _lastCam = new Vector3(Infinity, Infinity, Infinity);
const _UP = new Vector3(0, 1, 0);

/** Companion AI guide — floats at the player's side in every room, faces them, cycles tips. */
export function AiAssistant() {
  const [tip, setTip] = useState(0);
  const group = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const placed = useRef(false);
  const cursor = useCursor();
  const timer = useRef<number | null>(null);

  const schedule = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setTip(i => (i + 1) % TIPS.length), 6000);
  };

  useEffect(() => {
    schedule();
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, []);

  useFrame(({ clock, camera }, delta) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;

    // Target = slightly ahead of the player, a bit right of center.
    // Forward is flattened so mouse pitch doesn't lift the bot up/down
    // when you look at the ceiling.
    _fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-6) _fwd.set(0, 0, -1);
    else _fwd.normalize();
    _right.crossVectors(_fwd, _UP);
    _target.copy(camera.position)
      .addScaledVector(_fwd, FRONT_DIST)
      .addScaledVector(_right, SIDE_DIST);
    _target.y = camera.position.y - 0.12 + Math.sin(t * 1.6) * 0.07;

    // First frame or room teleport (camera jumped >3u in one frame): snap.
    // Otherwise glide, but stop at walls: try the full target, slide along
    // whichever axis is still open, else hold position — never enter a wall.
    if (!placed.current || camera.position.distanceToSquared(_lastCam) > TELEPORT_DIST_SQ) {
      g.position.copy(_target);
      placed.current = true;
    } else {
      if (blocked(_target.x, _target.z)) {
        const cx = g.position.x;
        const cz = g.position.z;
        if (!blocked(cx, _target.z)) _target.x = cx;
        else if (!blocked(_target.x, cz)) _target.z = cz;
        else { _target.x = cx; _target.z = cz; }
      }
      const px = g.position.x;
      const pz = g.position.z;
      g.position.lerp(_target, 1 - Math.exp(-6 * Math.min(delta, 0.1)));
      // Never end a frame inside a wall (corner-cutting during the glide).
      if (blocked(g.position.x, g.position.z)) {
        g.position.x = px;
        g.position.z = pz;
      }
    }
    _lastCam.copy(camera.position);

    // Turn to face the player, the way a guide would.
    g.getWorldPosition(_wp);
    const face = Math.atan2(camera.position.x - _wp.x, camera.position.z - _wp.z);
    let d = face - g.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    g.rotation.y += d * 0.08;
    if (orbit.current) orbit.current.rotation.y = t * 1.2;
  });

  return (
    <group
      ref={group}
      {...cursor}
      onClick={e => { e.stopPropagation(); setTip(i => (i + 1) % TIPS.length); schedule(); }}
    >
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.17, 32, 24]} />
        <meshStandardMaterial color="#0d1524" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* Eyes — always look at whoever is reading */}
      <mesh position={[-0.055, 0.03, 0.145]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color="#9ff5ff" />
      </mesh>
      <mesh position={[0.055, 0.03, 0.145]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color="#9ff5ff" />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.1, 6]} />
        <meshStandardMaterial color="#3a4a5c" />
      </mesh>
      <mesh position={[0, 0.27, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#20D9E8" />
      </mesh>

      {/* Halo ring + orbiting node */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.01, 8, 48]} />
        <meshStandardMaterial color="#20D9E8" emissive="#20D9E8" emissiveIntensity={0.8} />
      </mesh>
      <group ref={orbit}>
        <mesh position={[0.3, 0, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#FFB84D" />
        </mesh>
      </group>

      <pointLight position={[0, 0.05, 0.15]} color="#20D9E8" intensity={0.7} distance={2.5} />

      {/* Speech bubble */}
      <group position={[0, 0.55, 0]}>
        <mesh>
          <planeGeometry args={[1.7, 0.3]} />
          <meshBasicMaterial color="#04080f" transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, -0.185, 0]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.075, 0.075]} />
          <meshBasicMaterial color="#04080f" transparent opacity={0.85} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.07}
          color="#8FA2B5"
          maxWidth={1.55}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {TIPS[tip]}
        </Text>
      </group>
    </group>
  );
}
