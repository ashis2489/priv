/**
 * Terminal Lab — EXPERIENCE
 * Server-room / operations centre aesthetic.
 * Four server racks flush to back wall, status board wall-mounted above,
 * operations desk integrated into the layout.
 * Clean cable management on walls. No floating objects.
 */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { SHELL } from "../scene/OpenWorldFloor";
import { useStore } from "../../store/useStore";
import { useCursor } from "../../utils/useCursor";

import * as THREE from "three";

function makeStatusTex(items: { label: string; value: string; color: string }[]): THREE.CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 640; cv.height = 220;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#0c1220'; ctx.fillRect(0, 0, 640, 220);
  ctx.fillStyle = '#8a5ae8'; ctx.fillRect(0, 0, 640, 5);
  ctx.font = '700 30px Arial'; ctx.fillStyle = '#8a5ae8'; ctx.textAlign = 'center';
  ctx.fillText('SYSTEM STATUS', 320, 42);
  ctx.fillStyle = 'rgba(138,90,232,0.4)'; ctx.fillRect(60, 52, 520, 1.5);
  const cw = 320;
  items.forEach((item, i) => {
    const col = i % 2; const row = Math.floor(i / 2);
    const cx = 80 + col * cw; const cy = 74 + row * 54;
    ctx.font = '400 20px Arial'; ctx.fillStyle = '#4a5a6a'; ctx.textAlign = 'left';
    ctx.fillText(item.label, cx, cy);
    ctx.font = '700 24px Arial'; ctx.fillStyle = item.color;
    ctx.fillText('? ' + item.value, cx, cy + 30);
  });
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeTerminalTex(): THREE.CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 300;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#01090f'; ctx.fillRect(0, 0, 512, 300);
  ctx.font = '700 28px monospace'; ctx.fillStyle = '#8a5ae8'; ctx.textAlign = 'left';
  ctx.fillText('VEDAA_OS v2.0.4', 22, 44);
  ctx.font = '22px monospace'; ctx.fillStyle = '#28C840';
  ['$ whoami', '> Vedaa', '$ status', '> All systems nominal'].forEach((l, i) => ctx.fillText(l, 22, 84 + i * 36));
  ctx.font = '700 22px monospace'; ctx.fillStyle = '#8a5ae8'; ctx.textAlign = 'center';
  ctx.fillText('[ CLICK TO OPEN TERMINAL ]', 256, 272);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}




const { W, D, H } = SHELL;


const STATUS_ITEMS = [
  { label: "API SERVER",   value: "ONLINE",   color: "#28C840" },
  { label: "DATABASE",     value: "CONNECTED",color: "#28C840" },
  { label: "CI / CD",      value: "PASSING",  color: "#28C840" },
  { label: "DEPLOYMENT",   value: "READY",    color: "#2DE2E6" },
  { label: "BUILD",        value: "12 / 12",  color: "#28C840" },
  { label: "UPTIME",       value: "99.9 %",   color: "#FFB84D" },
];

// ── Server rack unit ──────────────────────────────────────────────────────
function ServerRack({ position }: { position: [number, number, number] }) {
  const ledRefs = useRef<(THREE.Mesh | null)[]>([]);
  const colors = ["#28C840","#2DE2E6","#28C840","#FFB84D","#28C840","#FF4D6D","#28C840","#2DE2E6"];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ledRefs.current.forEach((m, i) => {
      if (!m) return;
      (m.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(t * 2.4 + i * 0.9) * 0.4;
    });
  });

  return (
    <group position={position}>
      {/* Rack chassis */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 1.8, 0.5]} />
        <meshStandardMaterial color="#0c1018" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Front bezel */}
      <mesh position={[0, 0, 0.252]}>
        <boxGeometry args={[0.58, 1.78, 0.004]} />
        <meshStandardMaterial color="#101420" roughness={0.25} metalness={0.7} />
      </mesh>
      {/* 8 blade slots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} position={[0, 0.78 - i * 0.19, 0.254]}>
          <mesh>
            <boxGeometry args={[0.56, 0.16, 0.003]} />
            <meshStandardMaterial color="#0a1220" roughness={0.2} metalness={0.75} />
          </mesh>
          <mesh ref={el => { ledRefs.current[i] = el; }}
            position={[-0.22, 0, 0.003]}>
            <boxGeometry args={[0.012, 0.012, 0.002]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.8} />
          </mesh>
          {/* Second LED */}
          <mesh position={[-0.19, 0, 0.003]}>
            <boxGeometry args={[0.008, 0.008, 0.002]} />
            <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={0.5} />
          </mesh>
          {/* Vent slots */}
          {Array.from({ length: 4 }).map((_, j) => (
            <mesh key={j} position={[0.05 + j * 0.04, 0, 0.002]}>
              <boxGeometry args={[0.02, 0.08, 0.001]} />
              <meshStandardMaterial color="#060f1a" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Rack rails — sides */}
      {[-0.26, 0.26].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.015, 1.8, 0.5]} />
          <meshStandardMaterial color="#060e18" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
      {/* Base */}
      <mesh position={[0, -0.92, 0]}>
        <boxGeometry args={[0.62, 0.04, 0.52]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Floor anchor channel */}
      <mesh position={[0, -0.93, 0]}>
        <boxGeometry args={[0.64, 0.02, 0.54]} />
        <meshStandardMaterial color="#060810" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Power strip glow at back */}
      <mesh position={[0, -0.7, -0.22]}>
        <boxGeometry args={[0.44, 0.02, 0.01]} />
        <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6"
          emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ── Wall-mounted status board ─────────────────────────────────────────────
function StatusBoard() {
  const Z = -D / 2 + 0.04;
  const tex = useMemo(() => makeStatusTex(STATUS_ITEMS), []);
  return (
    <group position={[0, 1.9, Z]}>
      {/* Backing plate */}
      <mesh position={[0, 0, -0.012]}>
        <boxGeometry args={[4.2, 0.88, 0.025]} />
        <meshStandardMaterial color="#080c14" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Canvas face */}
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[4.0, 0.78]} />
        <meshStandardMaterial map={tex} toneMapped={false}
          emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.22} />
      </mesh>
      {/* Top accent */}
      <mesh position={[0, 0.386, 0.019]}>
        <boxGeometry args={[4.0, 0.006, 0.003]} />
        <meshStandardMaterial color="#8a5ae8" emissive="#8a5ae8" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// ── Operations desk ────────────────────────────────────────────────────────
function OpsDesk() {
  const { openPanel } = useStore();
  const cursor = useCursor();
  const Z = -D / 2 + 1.55;
  const terminalTex = useMemo(() => makeTerminalTex(), []);

  return (
    <group position={[0, 0, Z]}>
      {/* Surface */}
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.04, 0.72]} />
        <meshStandardMaterial color="#0e100a" roughness={0.5} metalness={0.06} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.37, 0]}>
        <boxGeometry args={[3.6, 0.74, 0.72]} />
        <meshStandardMaterial color="#0a0c08" roughness={0.8} />
      </mesh>
      {/* Legs */}
      {[-1.7, 1.7].map((x, i) => (
        <mesh key={i} position={[x, 0.37, 0]}>
          <boxGeometry args={[0.04, 0.74, 0.70]} />
          <meshStandardMaterial color="#080a0e" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      {/* Baseboard */}
      <mesh position={[0, 0.045, 0.34]}>
        <boxGeometry args={[3.6, 0.09, 0.03]} />
        <meshStandardMaterial color="#060810" roughness={0.8} />
      </mesh>
      {/* Terminal monitor — wall-mounted above desk */}
      <group position={[0, 1.52, -0.34]}
        {...cursor}
        onClick={() => openPanel("terminal")}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.35, 0.045]} />
          <meshStandardMaterial color="#080a0e" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[2.08, 1.22]} />
          <meshStandardMaterial map={terminalTex} toneMapped={false}
            emissive="#8a5ae8" emissiveIntensity={0.35} />
        </mesh>
        {/* Wall bracket arm */}
        <mesh position={[0, -0.72, -0.028]}>
          <boxGeometry args={[0.14, 0.04, 0.08]} />
          <meshStandardMaterial color="#060810" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
      {/* Keyboard */}
      <mesh position={[0.1, 0.773, 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.012, 0.14]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function TerminalLabRoom() {
  const rackPositions: [number, number, number][] = [
    [-3.8, 0.9, -D / 2 + 0.27],
    [-3.0, 0.9, -D / 2 + 0.27],
    [ 3.0, 0.9, -D / 2 + 0.27],
    [ 3.8, 0.9, -D / 2 + 0.27],
  ];

  const titleTex = useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = 640; cv.height = 120;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, 640, 120);
    ctx.font = "700 60px Arial"; ctx.fillStyle = "#8a5ae8"; ctx.textAlign = "center";
    ctx.fillText("TERMINAL LAB", 320, 64);
    ctx.font = "400 26px Arial"; ctx.fillStyle = "#4a5a6a";
    ctx.fillText("ENGINEERING  &  EXPERIENCE", 320, 100);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <group>
      {/* room shell rendered by OpenWorldFloor RoomBox */}

      {/* Room title — canvas plane */}
      <mesh position={[0, H - 0.3, -D / 2 + 0.04]}>
        <planeGeometry args={[3.2, 0.5]} />
        <meshStandardMaterial map={titleTex} toneMapped={false} transparent />
      </mesh>

      {/* Continuous wall backing behind rack array */}
      <mesh position={[0, 0.9, -D / 2 + 0.14]}>
        <boxGeometry args={[W - 0.2, 2.0, 0.03]} />
        <meshStandardMaterial color="#080a14" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Overhead cable tray */}
      <mesh position={[0, 1.94, -D / 2 + 0.18]}>
        <boxGeometry args={[W - 0.3, 0.06, 0.18]} />
        <meshStandardMaterial color="#0a0c14" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Cable tray accent */}
      <mesh position={[0, 1.975, -D / 2 + 0.16]}>
        <boxGeometry args={[W - 0.5, 0.005, 0.005]} />
        <meshStandardMaterial color="#8a5ae8" emissive="#8a5ae8"
          emissiveIntensity={1.2} transparent opacity={0.5} />
      </mesh>
      {/* Floor conduit strip */}
      <mesh position={[0, 0.025, -D / 2 + 0.28]}>
        <boxGeometry args={[W - 0.3, 0.05, 0.26]} />
        <meshStandardMaterial color="#060810" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Side wall accent strips */}
      {[-W / 2 + 0.02, W / 2 - 0.02].map((x, i) => (
        <mesh key={i} position={[x, 0.15, -2]}>
          <boxGeometry args={[0.015, 0.02, D * 0.55]} />
          <meshStandardMaterial color="#8a5ae8" emissive="#8a5ae8"
            emissiveIntensity={0.6} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Server racks */}
      {rackPositions.map((pos, i) => (
        <ServerRack key={i} position={pos} />
      ))}

      {/* Status board */}
      <StatusBoard />

      {/* Operations desk */}
      <OpsDesk />

      {/* Floor accent strips */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.4, D - 0.4]} />
        <meshStandardMaterial color="#060810" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Ambient glow strips on floor */}
      {[-W / 2 + 0.3, W / 2 - 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, D - 0.5]} />
          <meshStandardMaterial color="#8a5ae8" emissive="#8a5ae8"
            emissiveIntensity={0.3} transparent opacity={0.2} />
        </mesh>
      ))}

      <pointLight position={[0, H - 0.4, -D / 2 + 1.2]}
        intensity={3.2} color="#e0e4f0" distance={8} decay={1.5} />
      <pointLight position={[0, 2.6, 1.0]}
        intensity={2.5} color="#d8d4e8" distance={8} decay={1.6} />
      <pointLight position={[-3, 1.5, 0]}
        intensity={1.5} color="#8a5ae8" distance={5} decay={2} />
      <pointLight position={[3, 1.5, 0]}
        intensity={1.5} color="#8a5ae8" distance={5} decay={2} />

      <ambientLight intensity={1.4} color="#c0c8d8" />
    </group>
  );
}
