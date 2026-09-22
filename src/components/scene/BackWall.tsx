import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import { SHELL as ROOM } from "./sceneConstants";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const WOOD = "#6e4a2f";

// ── Framed Poster ──────────────────────────────────────────────────────────
function FramedPoster({
  position, lines, rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  lines: string[];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.5, 0.02]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* White mat */}
      <mesh position={[0, 0, 0.011]}>
        <boxGeometry args={[0.36, 0.46, 0.005]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      {/* Text lines */}
      {lines.map((line, i) => (
        <Text
          key={i}
          position={[0, 0.12 - i * 0.07, 0.015]}
          fontSize={0.035}
          color="#1a1a1e"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {line}
        </Text>
      ))}
    </group>
  );
}

function makeScreenTex(title: string, lines: string[], accent: string) {
  const W = 400, H = 280;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#0a1018";
  ctx.fillRect(0, 0, W, H);

  [["#FF5F57", 16], ["#FEBC2E", 36], ["#28C840", 56]].forEach(([col, x]) => {
    ctx.beginPath(); ctx.arc(Number(x), 16, 5, 0, Math.PI * 2);
    ctx.fillStyle = String(col); ctx.fill();
  });

  ctx.font = "bold 28px monospace";
  ctx.fillStyle = accent;
  ctx.textAlign = "left";
  ctx.fillText(title, 20, 60);

  ctx.fillStyle = accent + "60";
  ctx.fillRect(20, 70, 120, 2);

  ctx.font = "16px monospace";
  ctx.fillStyle = "#a6accd";
  lines.forEach((line, i) => {
    ctx.fillText(line, 20, 110 + i * 30);
  });

  return new THREE.CanvasTexture(c);
}

function WallScreen({
  position, title, lines, accent, onClick,
}: {
  position: [number, number, number];
  title: string; lines: string[]; accent: string; onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => makeScreenTex(title, lines, accent), [title, lines, accent]);

  useFrame(({ clock }) => {
    if (ref.current) (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      hovered ? 0.7 : 0.4 + Math.sin(clock.elapsedTime * 1.2) * 0.04;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.06]} />
        <meshStandardMaterial color="#16110b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[1.5, 1.1, 0.04]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.42, 1.02, 0.01]} />
        <meshStandardMaterial color="#0c0a07" roughness={0.9} />
      </mesh>
      <mesh
        ref={ref}
        position={[0, 0, 0.035]}
        onClick={onClick}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <planeGeometry args={[1.3, 0.88]} />
        <meshStandardMaterial map={tex} emissive={new THREE.Color(accent)} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function BackWall() {
  const { openPanel } = useStore();
  const Z = -ROOM.D / 2 + 0.06;

  return (
    <group>
      <WallScreen
        position={[-3.2, 2.4, Z]}
        title="PROJECTS"
        lines={["Featured work", "Live demos", "Case studies"]}
        accent="#2DE2E6"
        onClick={() => openPanel("project")}
      />
      <WallScreen
        position={[3.2, 2.4, Z]}
        title="SKILLS"
        lines={["React · TypeScript", "Node · Next.js", "Docker · AWS"]}
        accent="#7B61FF"
        onClick={() => openPanel("skills")}
      />
      <WallScreen
        position={[-3.2, 1.1, Z]}
        title="CONTACT"
        lines={["Let's build", "something real"]}
        accent="#20D9E8"
        onClick={() => openPanel("contact")}
      />
      <WallScreen
        position={[3.2, 1.1, Z]}
        title="ABOUT"
        lines={["Who I am", "What I do", "Where I'm going"]}
        accent="#4ECDC4"
        onClick={() => openPanel("about")}
      />

      {/* Framed motivational posters — flanking desk */}
      <FramedPoster
        position={[-1.8, 2.0, Z + 0.02]}
        lines={["GOOD", "CODE", "BETTER", "IDEAS"]}
      />
      <FramedPoster
        position={[1.8, 2.0, Z + 0.02]}
        lines={["DISCIPLINE", "CREATES", "FREEDOM"]}
      />
    </group>
  );
}
