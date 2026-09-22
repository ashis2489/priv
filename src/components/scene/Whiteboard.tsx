import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import { SHELL as ROOM } from "./sceneConstants";
import * as THREE from "three";

function makeWhiteboardTex() {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 352;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f0f0e8";
  ctx.fillRect(0, 0, 512, 352);

  // Title
  ctx.font = "bold 30px monospace";
  ctx.fillStyle = "#0a1018";
  ctx.textAlign = "left";
  ctx.fillText("ABOUT VEDAA", 24, 44);

  // Underline
  ctx.fillStyle = "#2DE2E6";
  ctx.fillRect(24, 54, 200, 3);

  // Lines
  const lines = [
    "• CS & Engineering Student",
    "• Full-Stack Developer",
    "• Focus: Web Dev, DSA, Cloud",
    "• Building: Campus Delivery",
    "• Open to opportunities",
  ];
  ctx.font = "20px monospace";
  ctx.fillStyle = "#0a1018";
  lines.forEach((line, i) => {
    ctx.fillText(line, 24, 92 + i * 44);
  });

  return new THREE.CanvasTexture(canvas);
}

export function Whiteboard() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { openPanel } = useStore();
  const tex = useMemo(() => makeWhiteboardTex(), []);

  useFrame(({ clock }) => {
    if (meshRef.current && hovered) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.08 + Math.sin(clock.getElapsedTime() * 3) * 0.03;
    }
  });

  // Back wall at Z = -ROOM.D/2 = -4.5
  // Panel depth = 0.07, so front face at Z = -4.5 + 0.07/2 + 0.01 = -4.465
  // Place at CENTER of back wall
  const Z = -ROOM.D / 2 + 0.04;

  return (
    <group position={[0, 2.1, Z]}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.0, 1.4, 0.07]} />
        <meshStandardMaterial color="#1a2535" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Board surface */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.04]}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={() => openPanel("about")}
      >
        <planeGeometry args={[1.82, 1.22]} />
        <meshStandardMaterial
          map={tex}
          emissive="#f0f0e8"
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* Hover glow */}
      {hovered && (
        <mesh position={[0, 0, 0.038]}>
          <boxGeometry args={[2.06, 1.46, 0.001]} />
          <meshStandardMaterial
            color="#2DE2E6" emissive="#2DE2E6"
            emissiveIntensity={1.2} transparent opacity={0.12}
          />
        </mesh>
      )}

      {/* Marker tray */}
      <mesh position={[0, -0.75, 0.05]}>
        <boxGeometry args={[1.7, 0.06, 0.07]} />
        <meshStandardMaterial color="#1a2535" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Markers */}
      {["#2DE2E6", "#FFB84D", "#FF4D6D", "#68A063"].map((color, i) => (
        <mesh key={i} position={[-0.3 + i * 0.22, -0.75, 0.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.011, 0.011, 0.15, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
