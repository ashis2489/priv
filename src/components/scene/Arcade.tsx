import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

function makeScreenTex(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 400;
  cv.height = 300;
  const ctx = cv.getContext("2d")!;

  ctx.fillStyle = "#0a0e14";
  ctx.fillRect(0, 0, 400, 300);

  const games = [
    "Street Fighter", "Tekken", "Mortal Kombat", "Pac-Man",
    "Space Invaders", "Metal Slug", "Snow Bros", "Contra",
  ];

  games.forEach((game, i) => {
    const y = 30 + i * 30;
    if (i === 0) {
      ctx.fillStyle = "#1a8a9a";
      ctx.fillRect(0, y - 10, 400, 26);
    }
    ctx.font = "500 13px monospace";
    ctx.fillStyle = i === 0 ? "#ffffff" : "#556670";
    ctx.textAlign = "center";
    ctx.fillText(game, 200, y + 5);
  });

  ctx.font = "700 12px monospace";
  ctx.fillStyle = "#445560";
  ctx.textAlign = "center";
  ctx.fillText("PRESS START", 200, 280);

  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function Arcade() {
  const screenRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setArcadeActive } = useStore();
  const screenTex = useMemo(() => makeScreenTex(), []);

  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
  });

  const W = 0.7, H = 2.3, D = 0.55;

  return (
    <group
      position={[-4.85, 0, 3.8]}
      rotation={[0, Math.PI / 2, 0]}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      onClick={() => setArcadeActive(true)}
    >
      {/* Body */}
      <mesh castShadow position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#0c1018" roughness={0.35} metalness={0.5} />
      </mesh>

      {/* Top marquee */}
      <mesh position={[0, H + 0.08, 0.04]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[W + 0.04, 0.28, 0.35]} />
        <meshStandardMaterial color="#080c14" roughness={0.3} metalness={0.55} />
      </mesh>

      {/* Marquee text */}
      <Text position={[0, H + 0.16, 0.2]} fontSize={0.075} color="#2DE2E6"
        anchorX="center" anchorY="middle" fontWeight={700} letterSpacing={0.1}>
        GAME ZONE
      </Text>
      <Text position={[0, H + 0.26, 0.2]} fontSize={0.06} color="#2DE2E6"
        anchorX="center" anchorY="middle">🎮</Text>

      {/* Screen bezel */}
      <mesh position={[0, 1.5, D / 2 + 0.005]}>
        <boxGeometry args={[W - 0.06, 0.7, 0.02]} />
        <meshStandardMaterial color="#040810" roughness={0.25} metalness={0.6} />
      </mesh>

      {/* Screen */}
      <mesh
        ref={screenRef}
        position={[0, 1.5, D / 2 + 0.016]}
        onClick={() => setArcadeActive(true)}
      >
        <planeGeometry args={[W - 0.12, 0.64]} />
        <meshStandardMaterial map={screenTex} emissive="#2DE2E6" emissiveIntensity={0.5}
          roughness={0.05} toneMapped={false} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0, 1.05, D / 2 + 0.06]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[W - 0.08, 0.2, 0.03]} />
        <meshStandardMaterial color="#0a1220" roughness={0.45} metalness={0.5} />
      </mesh>

      {/* Joystick */}
      <mesh position={[-0.14, 1.03, D / 2 + 0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.14, 1.06, D / 2 + 0.1]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color="#cc2222" emissive="#cc2222" emissiveIntensity={0.3} />
      </mesh>

      {/* Buttons */}
      {[
        { x: 0.02, c: "#cc2222" }, { x: 0.09, c: "#cc2222" }, { x: 0.16, c: "#ccaa22" },
        { x: 0.23, c: "#2266cc" }, { x: 0.30, c: "#22aa44" }, { x: 0.37, c: "#22aa44" },
      ].map((b, i) => (
        <mesh key={i} position={[b.x, 1.04, D / 2 + 0.14]}>
          <cylinderGeometry args={[0.018, 0.018, 0.012, 8]} />
          <meshStandardMaterial color={b.c} emissive={b.c} emissiveIntensity={0.35} />
        </mesh>
      ))}

      {/* Lower panel — text */}
      <Text position={[0, 0.6, D / 2 + 0.015]} fontSize={0.07} color="#2DE2E6"
        anchorX="center" letterSpacing={0.08}>🎮</Text>
      <Text position={[0, 0.42, D / 2 + 0.015]} fontSize={0.055} color="#ffffff"
        anchorX="center" letterSpacing={0.08}>
        {"PLAY\nPAUSE\nCODE\nREPEAT"}
      </Text>

      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[W + 0.04, 0.1, D + 0.04]} />
        <meshStandardMaterial color="#080c14" roughness={0.4} metalness={0.45} />
      </mesh>

      {/* LED strips — left */}
      <mesh position={[-W / 2 - 0.008, H / 2, D / 2 + 0.005]}>
        <boxGeometry args={[0.01, H - 0.1, 0.005]} />
        <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={1.8} transparent opacity={0.8} />
      </mesh>

      {/* LED strips — right */}
      <mesh position={[W / 2 + 0.008, H / 2, D / 2 + 0.005]}>
        <boxGeometry args={[0.01, H - 0.1, 0.005]} />
        <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={1.8} transparent opacity={0.8} />
      </mesh>

      {/* LED — bottom */}
      <mesh position={[0, 0.005, D / 2 + 0.01]}>
        <boxGeometry args={[W + 0.06, 0.012, 0.012]} />
        <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={2.5} transparent opacity={0.9} />
      </mesh>

      {hovered && (
        <Text position={[0, H + 0.48, 0.25]} fontSize={0.07} color="#2DE2E6"
          anchorX="center" letterSpacing={0.1}>[ PLAY ]</Text>
      )}
    </group>
  );
}
