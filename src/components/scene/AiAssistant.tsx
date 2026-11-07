import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Vector3, type Group } from "three";
import { useCursor } from "../../utils/useCursor";

const TIPS = [
  "Hi! I'm your AI guide — click me for a tip",
  "WASD to move · mouse to look around",
  "Click desks, screens and posters to open panels",
  "Shift sprints · Esc releases the mouse",
  "Glowing doors lead to PROJECTS, SKILLS and CONTACT",
  "The minimap shows where you are",
];

const _wp = new Vector3();

/** Floating AI guide in the Cyber Core — bobs, faces the player, cycles help tips. */
export function AiAssistant({ position }: { position: [number, number, number] }) {
  const [tip, setTip] = useState(0);
  const group = useRef<Group>(null);
  const orbit = useRef<Group>(null);
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

  useFrame(({ clock, camera }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * 1.6) * 0.07;
    // Turn to face the player, the way a guide would.
    g.getWorldPosition(_wp);
    const target = Math.atan2(camera.position.x - _wp.x, camera.position.z - _wp.z);
    let d = target - g.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    g.rotation.y += d * 0.08;
    if (orbit.current) orbit.current.rotation.y = t * 1.2;
  });

  return (
    <group
      ref={group}
      position={position}
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
