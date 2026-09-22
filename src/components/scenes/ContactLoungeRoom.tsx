/**
 * Contact Lounge — clean redesign.
 *
 * Back wall layout (X positions, room is 10 wide, X = -5 to +5):
 *   X = -4.6 to -3.6  : Side tag panel  (0.8 wide)
 *   X = -3.2 to +3.2  : Feature wall — dark panel with LET'S CONNECT + 4 cards + CTA
 *   X = +3.6 to +4.8  : CONTACT LOUNGE info panel (1.2 wide)
 *
 * NO wall shelves — they cause persistent z-fighting and clutter.
 * NO wood slat panel — replaced with a slim decorative strip only.
 *
 * Mid-room right: Reception desk
 * Corners: 2 tall floor plants
 * Ceiling: recessed downlights + cove strip
 */
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { SHELL } from "../scene/OpenWorldFloor";
import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";
import * as THREE from "three";

const { W, D, H } = SHELL;

const LINKS = [
  { label: "GITHUB",    sub: "Check out my work", icon: "⊕", color: "#cccccc", url: siteConfig.github   },
  { label: "LINKEDIN",  sub: "Let's connect",      icon: "in", color: "#0A66C2", url: siteConfig.linkedin },
  { label: "EMAIL",     sub: "Send a message",     icon: "✉",  color: "#cccccc", url: siteConfig.email   },
  { label: "CV/RESUME", sub: "View my resume",     icon: "☰",  color: "#cccccc", url: siteConfig.resume  },
];

// ── Ceiling cove light strip ──────────────────────────────────────────────
function CeilingCove() {
  return (
    <>
      <mesh position={[0, H - 0.05, D / 2 - 0.2]}>
        <boxGeometry args={[W - 0.4, 0.035, 0.12]} />
        <meshStandardMaterial color="#1a1612" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, H - 0.035, D / 2 - 0.14]}>
        <boxGeometry args={[W - 0.5, 0.005, 0.005]} />
        <meshStandardMaterial color="#fff4d8" emissive="#fff4d8" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, H - 0.05, -D / 2 + 0.2]}>
        <boxGeometry args={[W - 0.4, 0.035, 0.12]} />
        <meshStandardMaterial color="#1a1612" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, H - 0.035, -D / 2 + 0.14]}>
        <boxGeometry args={[W - 0.5, 0.005, 0.005]} />
        <meshStandardMaterial color="#fff4d8" emissive="#fff4d8" emissiveIntensity={2.5} />
      </mesh>
    </>
  );
}

// ── Recessed downlight fixture ────────────────────────────────────────────
function Downlight({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh>
        <boxGeometry args={[0.18, 0.022, 0.18]} />
        <meshStandardMaterial color="#1a1814" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 14]} />
        <meshStandardMaterial color="#fff8e8" emissive="#fff8e8" emissiveIntensity={2.6} />
      </mesh>
    </group>
  );
}

// ── Slim left accent strip (replaces the oversized slat panel) ────────────
function LeftAccentStrip() {
  const Z = -D / 2 + 0.05;
  return (
    <group position={[-W / 2 + 0.5, H / 2, Z]}>
      {/* Thin dark backing */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.7, H, 0.02]} />
        <meshStandardMaterial color="#0a0806" roughness={0.8} />
      </mesh>
      {/* 5 slim vertical slats */}
      {[-0.24, -0.12, 0, 0.12, 0.24].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.006]} castShadow>
          <boxGeometry args={[0.04, H - 0.1, 0.03]} />
          <meshStandardMaterial color="#1a0e06" roughness={0.72} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// ── Left tag panel ────────────────────────────────────────────────────────
function SideTagPanel() {
  const Z = -D / 2 + 0.06;
  return (
    <group position={[-W / 2 + 1.4, H / 2 - 0.2, Z]}>
      <mesh position={[0, 0, -0.012]} castShadow>
        <boxGeometry args={[0.72, 1.9, 0.024]} />
        <meshStandardMaterial color="#0c0a08" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Left red bar */}
      <mesh position={[-0.354, 0, 0.014]}>
        <boxGeometry args={[0.01, 1.9, 0.004]} />
        <meshStandardMaterial color="#FF4D6D" emissive="#FF4D6D" emissiveIntensity={1.8} />
      </mesh>
      <Text position={[0.04, 0.45, 0.016]}
        fontSize={0.09} color="#e8e0d8" anchorX="center"
        fontWeight={700} letterSpacing={0.06}
        maxWidth={0.56} textAlign="center">
        BUILD{"\n"}IDEAS{"\n"}INTO{"\n"}REALITY
      </Text>
      <Text position={[0.04, -0.42, 0.016]} fontSize={0.12}
        color="#FF4D6D" anchorX="center">
        {"</>"}
      </Text>
    </group>
  );
}

// ── Main feature wall ─────────────────────────────────────────────────────
function FeatureWall() {
  const { openPanel } = useStore();
  const btnRef = useRef<THREE.Mesh>(null);
  const [btnHov, setBtnHov] = useState(false);

  useFrame(({ clock }) => {
    if (btnRef.current)
      (btnRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        btnHov ? 0.65 : 0.3 + Math.sin(clock.getElapsedTime() * 1.1) * 0.07;
  });

  const Z = -D / 2 + 0.04;
  // Feature wall spans X = -3.0 to +3.0 (6.0 wide)
  const PW = 6.0;

  return (
    // Group Y origin at 0 (floor), panel fills full wall height
    <group position={[0, H / 2, Z]}>
      {/* Dark backing — full height to cover room sign */}
      <mesh position={[0, 0, -0.018]} castShadow>
        <boxGeometry args={[PW, H, 0.036]} />
        <meshStandardMaterial color="#0e0b09" roughness={0.65} metalness={0.12} />
      </mesh>

      {/* LET'S + CONNECT heading — positioned in upper half */}
      <Text position={[-0.7, 0.52, 0.025]} fontSize={0.21}
        color="#f0ece4" anchorX="right" fontWeight={700} letterSpacing={0.04}>
        LET'S
      </Text>
      <Text position={[-0.55, 0.52, 0.025]} fontSize={0.21}
        color="#FF4D6D" anchorX="left" fontWeight={700} letterSpacing={0.04}>
        CONNECT
      </Text>

      {/* Sub-heading */}
      <Text position={[0, 0.24, 0.025]} fontSize={0.075}
        color="#6a7880" anchorX="center" letterSpacing={0.2}>
        LET'S BUILD SOMETHING GREAT TOGETHER.
      </Text>

      {/* Red divider */}
      <mesh position={[0, 0.12, 0.022]}>
        <boxGeometry args={[1.6, 0.005, 0.002]} />
        <meshStandardMaterial color="#FF4D6D" emissive="#FF4D6D"
          emissiveIntensity={1.6} transparent opacity={0.75} />
      </mesh>

      {/* 4 icon cards — evenly spaced, centred */}
      {LINKS.map((link, i) => (
        <LinkCard key={link.label} link={link} posX={-2.1 + i * 1.4} posY={-0.32} />
      ))}

      {/* START A CONVERSATION button */}
      <group position={[0, -1.22, 0]}
        onPointerEnter={() => { setBtnHov(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setBtnHov(false); document.body.style.cursor = "auto"; }}
        onClick={() => openPanel("contact")}>
        <mesh ref={btnRef}>
          <boxGeometry args={[2.2, 0.3, 0.05]} />
          <meshStandardMaterial color="#b02a38" emissive="#FF4D6D"
            emissiveIntensity={0.3} roughness={0.3} metalness={0.25} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.09}
          color="#ffffff" anchorX="center" fontWeight={700} letterSpacing={0.16}>
          START A CONVERSATION  →
        </Text>
      </group>

      {/* Overhead spot on feature wall */}
      <pointLight position={[0, H / 2 + 0.4, 1.2]}
        intensity={2.8} color="#ffd8a8" distance={5} decay={2} castShadow />
    </group>
  );
}

// ── Single link card (local to FeatureWall group) ─────────────────────────
function LinkCard({ link, posX, posY }: {
  link: typeof LINKS[0]; posX: number; posY: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hov, setHov] = useState(false);

  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        hov ? 0.55 : 0.1 + Math.sin(clock.getElapsedTime() + posX) * 0.03;
  });

  const CW = 1.24;  // card width — 4 cards × 1.24 + gaps = ~5.6 (fits in PW=6)
  const CH = 0.88;

  return (
    <group position={[posX, posY, 0.06]}
      onPointerEnter={() => { setHov(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHov(false); document.body.style.cursor = "auto"; }}
      onClick={() => window.open(link.url, "_blank")}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={[CW, CH, 0.046]} />
        <meshStandardMaterial color="#1a1410" emissive={link.color}
          emissiveIntensity={0.1} roughness={0.42} metalness={0.28} />
      </mesh>
      {/* Top accent bar */}
      <mesh position={[0, CH / 2 - 0.007, 0.026]}>
        <boxGeometry args={[CW, 0.01, 0.003]} />
        <meshStandardMaterial color={link.color} emissive={link.color}
          emissiveIntensity={1.8} transparent opacity={0.85} />
      </mesh>
      <Text position={[0, 0.17, 0.028]} fontSize={0.18}
        color={link.color} anchorX="center" fontWeight={700}>
        {link.icon}
      </Text>
      <Text position={[0, -0.14, 0.028]} fontSize={0.08}
        color="#d0ccc8" anchorX="center" fontWeight={600} letterSpacing={0.1}>
        {link.label}
      </Text>
      <Text position={[0, -0.28, 0.028]} fontSize={0.058}
        color="#606870" anchorX="center">
        {link.sub}
      </Text>
      {hov && (
        <mesh position={[0, 0, 0.024]}>
          <boxGeometry args={[CW + 0.02, CH + 0.02, 0.001]} />
          <meshStandardMaterial color={link.color} emissive={link.color}
            emissiveIntensity={1.0} transparent opacity={0.14} />
        </mesh>
      )}
    </group>
  );
}

// ── CONTACT LOUNGE info panel (right side) ────────────────────────────────
function ContactInfoPanel() {
  const Z = -D / 2 + 0.06;
  // Sits at X = +4.0 — safely right of feature wall (+3.0 edge) and within room (+5.0)
  return (
    <group position={[4.1, H / 2, Z]}>
      <mesh position={[0, 0, -0.014]} castShadow>
        <boxGeometry args={[1.6, H, 0.028]} />
        <meshStandardMaterial color="#0c0a08" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Left red bar */}
      <mesh position={[-0.79, 0, 0.015]}>
        <boxGeometry args={[0.01, H, 0.004]} />
        <meshStandardMaterial color="#FF4D6D" emissive="#FF4D6D" emissiveIntensity={1.8} />
      </mesh>
      <Text position={[0.06, 0.55, 0.020]} fontSize={0.14}
        color="#FF4D6D" anchorX="center" fontWeight={700} letterSpacing={0.1}>
        CONTACT
      </Text>
      <Text position={[0.06, 0.32, 0.020]} fontSize={0.14}
        color="#ece8e0" anchorX="center" fontWeight={700} letterSpacing={0.1}>
        LOUNGE
      </Text>
      <mesh position={[0, 0.16, 0.018]}>
        <boxGeometry args={[1.2, 0.005, 0.002]} />
        <meshStandardMaterial color="#FF4D6D" emissive="#FF4D6D"
          emissiveIntensity={1.2} transparent opacity={0.5} />
      </mesh>
      <Text position={[0.06, 0.0, 0.020]} fontSize={0.062}
        color="#887870" anchorX="center" letterSpacing={0.1}>
        AVAILABLE FOR
      </Text>
      {["FULL-TIME", "FREELANCE", "COLLABORATION"].map((t, i) => (
        <Text key={t} position={[0.06, -0.15 - i * 0.2, 0.020]}
          fontSize={0.082} color="#cec6be" anchorX="center"
          fontWeight={600} letterSpacing={0.06}>
          {t}
        </Text>
      ))}
    </group>
  );
}

// ── Reception desk ────────────────────────────────────────────────────────
function ReceptionDesk() {
  const { openPanel } = useStore();
  const DH = 0.9;
  const DW = 3.2;
  const DD = 0.95;

  return (
    <group position={[1.6, 0, 0.6]}>
      {/* Dark top */}
      <mesh position={[0, DH, 0]} castShadow receiveShadow>
        <boxGeometry args={[DW, 0.05, DD]} />
        <meshStandardMaterial color="#18120a" roughness={0.42} metalness={0.06} />
      </mesh>
      {/* Body */}
      <mesh position={[0, DH / 2, 0]}>
        <boxGeometry args={[DW, DH, DD]} />
        <meshStandardMaterial color="#100c06" roughness={0.72} metalness={0.04} />
      </mesh>
      {/* Wood slat strips on front face */}
      {[0.7, 0.52, 0.34, 0.17].map((y, i) => (
        <mesh key={i} position={[0, y, DD / 2 + 0.008]} castShadow>
          <boxGeometry args={[DW - 0.04, 0.04, 0.018]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#2a1a0a" : "#221408"}
            roughness={0.68} metalness={0.04} />
        </mesh>
      ))}
      {/* Amber LED strip at base */}
      <mesh position={[0, 0.07, DD / 2 + 0.001]}>
        <boxGeometry args={[DW - 0.08, 0.01, 0.006]} />
        <meshStandardMaterial color="#ffaa44" emissive="#ffaa44"
          emissiveIntensity={2.5} transparent opacity={0.9} />
      </mesh>
      {/* RECEPTION label */}
      <Text position={[0, DH * 0.44, DD / 2 + 0.025]}
        fontSize={0.086} color="#c8944a" anchorX="center"
        fontWeight={700} letterSpacing={0.32}>
        RECEPTION
      </Text>
      {/* Floor anchor */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[DW + 0.04, 0.03, DD + 0.04]} />
        <meshStandardMaterial color="#08060a" roughness={0.65} metalness={0.4} />
      </mesh>
      {/* Desk lamp */}
      <group position={[-1.2, DH + 0.003, -0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.065, 0.018, 10]} />
          <meshStandardMaterial color="#181410" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.48, 6]} />
          <meshStandardMaterial color="#1c1810" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, 0.38]}>
          <cylinderGeometry args={[0.03, 0.055, 0.085, 8]} />
          <meshStandardMaterial color="#141010" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.05, 0.5, 0]}>
          <sphereGeometry args={[0.016, 6, 4]} />
          <meshStandardMaterial color="#ffe8b0" emissive="#ffe8b0" emissiveIntensity={3.5} />
        </mesh>
      </group>
      {/* Small plant on desk */}
      <group position={[1.3, DH + 0.003, -0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.048, 0.038, 0.09, 8]} />
          <meshStandardMaterial color="#281c0e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.092, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <meshStandardMaterial color="#284018" roughness={0.86} />
        </mesh>
      </group>
      {/* Monitor */}
      <mesh position={[0.3, DH + 0.21, -0.35]} castShadow>
        <boxGeometry args={[0.58, 0.36, 0.036]} />
        <meshStandardMaterial color="#0a0808" roughness={0.2} metalness={0.82} />
      </mesh>
      <mesh position={[0.3, DH + 0.21, -0.332]}>
        <planeGeometry args={[0.53, 0.31]} />
        <meshStandardMaterial color="#020208" emissive="#334455"
          emissiveIntensity={0.38} roughness={0.05} toneMapped={false} />
      </mesh>
      {/* Invisible click target */}
      <mesh position={[0, DH + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { document.body.style.cursor = "auto"; }}
        onClick={() => openPanel("contact")}>
        <planeGeometry args={[DW, DD]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

export function ContactLoungeRoom() {
  return (
    <group>
      {/* Ceiling cove */}
      <CeilingCove />

      {/* Downlights */}
      <Downlight pos={[-2.0, H - 0.012, -1.2]} />
      <Downlight pos={[ 1.2, H - 0.012, -1.2]} />
      <Downlight pos={[-0.5, H - 0.012,  1.0]} />
      <Downlight pos={[ 2.8, H - 0.012,  1.0]} />

      {/* Back wall */}
      <LeftAccentStrip />
      <SideTagPanel />
      <FeatureWall />
      <ContactInfoPanel />

      {/* Reception desk */}
      <ReceptionDesk />

      {/* Lighting */}
      <ambientLight intensity={2.0} color="#d4c8b8" />

      <pointLight position={[-1.8, H - 0.18, -1.0]}
        intensity={3.8} color="#fff4e0" distance={7} decay={1.7} castShadow />
      <pointLight position={[ 1.5, H - 0.18, -1.0]}
        intensity={3.5} color="#fff4e0" distance={7} decay={1.7} />
    </group>
  );
}
