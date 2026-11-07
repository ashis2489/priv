import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

function makeScreenTex(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 384;
  const ctx = cv.getContext("2d")!;

  ctx.fillStyle = "#081018";
  ctx.fillRect(0, 0, 512, 384);
  ctx.textAlign = "center";

  ctx.font = "700 24px monospace";
  ctx.fillStyle = "#2DE2E6";
  ctx.fillText("GAME ZONE", 256, 42);

  ctx.font = "400 12px monospace";
  ctx.fillStyle = "#40565f";
  ctx.fillText("- SELECT GAME -", 256, 66);

  const games = [
    "Street Fighter", "Tekken", "Mortal Kombat", "Pac-Man",
    "Space Invaders", "Metal Slug", "Snow Bros", "Contra",
    "Galaga", "Asteroids", "Donkey Kong", "Frogger",
    "Dig Dug", "Bubble Bobble",
  ];

  // 14 rows in a 384px screen: tight 19px rows from y=94 to y=341.
  games.forEach((game, i) => {
    const y = 94 + i * 19;
    if (i === 0) {
      ctx.fillStyle = "#14636f";
      ctx.fillRect(116, y - 13, 280, 17);
    }
    ctx.font = "500 14px monospace";
    ctx.fillStyle = i === 0 ? "#ffffff" : "#8fa8b5";
    ctx.fillText(game, 256, y);
  });

  ctx.font = "700 15px monospace";
  ctx.fillStyle = "#FFB84D";
  ctx.fillText("PRESS START", 256, 372);

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
    mat.emissiveIntensity = 0.55 + Math.sin(clock.getElapsedTime() * 2) * 0.12;
  });

  // Cabinet proportions: proper upright, not a phone-booth pillar.
  const W = 0.92, H = 2.0, D = 0.62;
  const FZ = D / 2; // body front face

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

      {/* ── Marquee: sign sits proud of its own face (was buried → z-fighting) ── */}
      <group position={[0, H + 0.14, 0.24]} rotation={[-0.22, 0, 0]}>
        <mesh>
          <boxGeometry args={[W, 0.3, 0.14]} />
          <meshStandardMaterial color="#080c14" roughness={0.3} metalness={0.55} />
        </mesh>
        {/* Backlit panel */}
        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[W - 0.06, 0.24]} />
          <meshStandardMaterial color="#0a3a44" emissive="#20D9E8" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 0, 0.085]} fontSize={0.1} color="#2DE2E6"
          anchorX="center" anchorY="middle" fontWeight={700} letterSpacing={0.12}>
          GAME ZONE
        </Text>
      </group>

      {/* ── Display ── */}
      <mesh position={[0, 1.6, FZ + 0.015]}>
        <boxGeometry args={[W - 0.1, 0.7, 0.03]} />
        <meshStandardMaterial color="#040810" roughness={0.25} metalness={0.6} />
      </mesh>
      <mesh ref={screenRef} position={[0, 1.6, FZ + 0.035]} onClick={() => setArcadeActive(true)}>
        <planeGeometry args={[W - 0.18, 0.6]} />
        {/* emissiveMap (not flat emissive) so the menu keeps its contrast */}
        <meshStandardMaterial map={screenTex} emissiveMap={screenTex} emissive="#ffffff"
          emissiveIntensity={0.55} roughness={0.05} toneMapped={false} />
      </mesh>

      {/* ── Control deck: children live in deck space so nothing floats or overflows ── */}
      <group position={[0, 1.06, FZ + 0.04]} rotation={[-0.55, 0, 0]}>
        <mesh>
          <boxGeometry args={[W, 0.42, 0.035]} />
          <meshStandardMaterial color="#101826" roughness={0.45} metalness={0.5} />
        </mesh>

        {/* Button recess */}
        <mesh position={[0.19, 0, 0.023]}>
          <boxGeometry args={[0.5, 0.15, 0.012]} />
          <meshStandardMaterial color="#05080e" roughness={0.6} />
        </mesh>

        {/* Joystick */}
        <group position={[-0.26, 0, 0.0175]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.007]}>
            <cylinderGeometry args={[0.05, 0.05, 0.014, 16]} />
            <meshStandardMaterial color="#05080e" roughness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.059]}>
            <cylinderGeometry args={[0.013, 0.013, 0.09, 8]} />
            <meshStandardMaterial color="#1c1c1c" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.134]}>
            <sphereGeometry args={[0.033, 16, 12]} />
            <meshStandardMaterial color="#e33d3d" emissive="#e33d3d" emissiveIntensity={0.35} />
          </mesh>
        </group>

        {/* Buttons — inside the deck bounds now */}
        {[
          { x: -0.02, c: "#e33d3d" }, { x: 0.064, c: "#e33d3d" }, { x: 0.148, c: "#e8c53a" },
          { x: 0.232, c: "#3d7ee8" }, { x: 0.316, c: "#3dc46a" }, { x: 0.40, c: "#3dc46a" },
        ].map((b, i) => (
          <mesh key={i} position={[b.x, 0, 0.029]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.016, 12]} />
            <meshStandardMaterial color={b.c} emissive={b.c} emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* ── Lower front: coin door, speaker slats, slogan ── */}
      {[0.70, 0.73, 0.76, 0.79].map(y => (
        <mesh key={y} position={[0, y, FZ + 0.012]}>
          <boxGeometry args={[0.28, 0.014, 0.012]} />
          <meshStandardMaterial color="#1a2230" roughness={0.7} />
        </mesh>
      ))}

      <mesh position={[0, 0.55, FZ + 0.012]}>
        <boxGeometry args={[0.34, 0.24, 0.02]} />
        <meshStandardMaterial color="#05080e" roughness={0.55} metalness={0.4} />
      </mesh>
      {[-0.08, 0.08].map(x => (
        <mesh key={x} position={[x, 0.6, FZ + 0.027]}>
          <boxGeometry args={[0.05, 0.09, 0.012]} />
          <meshStandardMaterial color="#0f1826" emissive="#FFB84D" emissiveIntensity={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0.48, FZ + 0.028]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.016, 12]} />
        <meshStandardMaterial color="#e33d3d" emissive="#e33d3d" emissiveIntensity={0.4} />
      </mesh>

      <Text position={[0, 0.3, FZ + 0.015]} fontSize={0.045} color="#7f95a8"
        anchorX="center" anchorY="middle" letterSpacing={0.06}>
        PLAY · PAUSE · CODE · REPEAT
      </Text>

      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[W + 0.06, 0.1, D + 0.05]} />
        <meshStandardMaterial color="#080c14" roughness={0.4} metalness={0.45} />
      </mesh>

      {/* LED strips — front edges */}
      {[-1, 1].map(s => (
        <mesh key={s} position={[s * (W / 2 + 0.008), H / 2, FZ + 0.005]}>
          <boxGeometry args={[0.012, H - 0.12, 0.006]} />
          <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={1.8}
            transparent opacity={0.8} />
        </mesh>
      ))}

      {/* LED — bottom */}
      <mesh position={[0, 0.008, FZ + 0.01]}>
        <boxGeometry args={[W + 0.06, 0.014, 0.014]} />
        <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={2.5}
          transparent opacity={0.9} />
      </mesh>

      {hovered && (
        <Text position={[0, H + 0.55, 0.35]} fontSize={0.07} color="#2DE2E6"
          anchorX="center" anchorY="middle" letterSpacing={0.1}>[ PLAY ]</Text>
      )}
    </group>
  );
}
