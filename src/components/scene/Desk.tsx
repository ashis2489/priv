/**
 * Standing desk — flush against the north wall.
 *
 * Dimensions (human scale):
 *   Surface: 1800mm wide × 750mm deep × 720mm high
 *   Legs: solid steel 60mm sq, floor-mounted
 *   Back edge touches north wall at Z = -ROOM.D/2 = -4.5
 *   Desk group origin at world [0, 0, -3.88]
 *   (back of desk: Z = -3.88 - 0.38 = -4.26, gap ~0.24 from wall for cable run)
 */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../store/useStore";
import { useCursor } from "../../utils/useCursor";
import * as THREE from "three";

const DH  = 0.72;  // desk height
const DW  = 1.8;   // desk width
const DD  = 0.75;  // desk depth
const LEG = 0.06;  // leg cross-section
const ST  = 0.03;  // surface thickness

// ── Monitor ───────────────────────────────────────────────────────────────
function Monitor({
  position, rotation = [0, 0, 0], label, onClick, emissiveColor = "#20D9E8",
  subLabel = "",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
  onClick: () => void;
  emissiveColor?: string;
  subLabel?: string;
}) {
  const cursor = useCursor();
  const scrRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (scrRef.current)
      (scrRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.35 + Math.sin(clock.getElapsedTime() * 1.4) * 0.06;
  });

  return (
    <group position={position} rotation={rotation as [number,number,number]}>
      {/* Monitor back housing */}
      <mesh castShadow>
        <boxGeometry args={[0.56, 0.36, 0.04]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Screen face */}
      <mesh
        ref={scrRef}
        position={[0, 0, 0.022]}
        onClick={onClick}
        {...cursor}
      >
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial
          color="#020408"
          emissive={emissiveColor}
          emissiveIntensity={0.35}
          roughness={0.05}
          toneMapped={false}
        />
      </mesh>
      <Text position={[0, 0.02, 0.026]} fontSize={0.032} color={emissiveColor}
        anchorX="center" anchorY="middle" fontWeight={700} letterSpacing={0.08}>
        {label}
      </Text>
      {subLabel && (
        <Text position={[0, -0.04, 0.026]} fontSize={0.018} color="#718096"
          anchorX="center" anchorY="middle" letterSpacing={0.06}>
          {subLabel}
        </Text>
      )}
      {/* Stand — connects screen down to the desk surface */}
      <mesh position={[0, -0.15, -0.015]}>
        <boxGeometry args={[0.04, 0.14, 0.04]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.225, 0.0]}>
        <boxGeometry args={[0.26, 0.02, 0.16]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ── Laptop ────────────────────────────────────────────────────────────────
function Laptop({ position, onClick }: {
  position: [number, number, number]; onClick: () => void;
}) {
  const cursor = useCursor();
  return (
    <group position={position}
      onClick={onClick}
      {...cursor}>
      {/* Base */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.016, 0.21]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Lid — slightly open ~110° */}
      <mesh position={[0, 0.1, -0.08]} rotation={[-1.1, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.016, 0.2]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, -0.08]} rotation={[-1.1, 0, 0]}>
        <planeGeometry args={[0.27, 0.17]} />
        <meshStandardMaterial color="#020408" emissive="#20D9E8"
          emissiveIntensity={0.3} roughness={0.05} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── Pen Holder ─────────────────────────────────────────────────────────────
function PenHolder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cup */}
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.025, 0.08, 8]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Pens */}
      {[[-0.008, 0.05, 0], [0.005, 0.055, 0.003], [0.012, 0.048, -0.002]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0.05 * (i - 1), 0, 0.03]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 4]} />
          <meshStandardMaterial color={["#2DE2E6", "#8a5ae8", "#FFB84D"][i]} />
        </mesh>
      ))}
    </group>
  );
}

// ── Office Chair — clean minimal design ────────────────────────────────────
function OfficeChair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh castShadow position={[0, 0.44, 0]}>
        <boxGeometry args={[0.46, 0.04, 0.44]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Backrest */}
      <mesh castShadow position={[0, 0.78, -0.2]}>
        <boxGeometry args={[0.42, 0.52, 0.03]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Armrests */}
      {[-0.24, 0.24].map((x, i) => (
        <group key={i} position={[x, 0.56, -0.04]}>
          <mesh>
            <boxGeometry args={[0.03, 0.2, 0.03]} />
            <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.1, 0.04]}>
            <boxGeometry args={[0.04, 0.02, 0.16]} />
            <meshStandardMaterial color="#1a1a1e" roughness={0.8} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Center stem */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
        <meshStandardMaterial color="#141416" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 5-star base */}
      {[0, 1.256, 2.512, 3.768, 5.024].map((angle, i) => (
        <group key={i}>
          <mesh
            position={[Math.sin(angle) * 0.15, 0.2, Math.cos(angle) * 0.15]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.03, 0.025, 0.18]} />
            <meshStandardMaterial color="#141416" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[Math.sin(angle) * 0.24, 0.18, Math.cos(angle) * 0.24]}>
            <sphereGeometry args={[0.018, 6, 4]} />
            <meshStandardMaterial color="#0a0a0c" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 10]} />
        <meshStandardMaterial color="#141416" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ── Drawer Unit ────────────────────────────────────────────────────────────
function DrawerUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[0.36, 0.58, 0.45]} />
        <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Drawers */}
      {[0.18, 0, -0.18].map((y, i) => (
        <group key={i} position={[0, y, 0.228]}>
          <mesh>
            <boxGeometry args={[0.32, 0.16, 0.01]} />
            <meshStandardMaterial color="#1a1a1e" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.08, 0.015, 0.015]} />
            <meshStandardMaterial color="#2DE2E6" emissive="#2DE2E6" emissiveIntensity={0.3} roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Desk() {
  const { openPanel } = useStore();
  const cursor = useCursor();

  // Group origin Z = -3.88 (desk back at ~-4.26, front at ~-3.51)
  // Surface top Y = DH + ST/2 ≈ 0.735
  const SY = DH + ST / 2; // surface top face Y in group space

  return (
    <group position={[0, 0, -3.88]}>
      {/* ── Surface ── */}
      <mesh position={[0, DH, 0]} castShadow receiveShadow>
        <boxGeometry args={[DW, ST, DD]} />
        <meshStandardMaterial color="#22180e" roughness={0.55} metalness={0.04} />
      </mesh>

      {/* ── Steel legs — four corners, floor-mounted ── */}
      {[[-DW / 2 + 0.08, -DD / 2 + 0.08],
        [ DW / 2 - 0.08, -DD / 2 + 0.08],
        [-DW / 2 + 0.08,  DD / 2 - 0.08],
        [ DW / 2 - 0.08,  DD / 2 - 0.08],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, DH / 2, z]} castShadow>
          <boxGeometry args={[LEG, DH, LEG]} />
          <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* ── Horizontal stretcher ── */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[DW - 0.1, 0.025, 0.025]} />
        <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── Cable management tray under surface ── */}
      <mesh position={[0, DH - 0.06, -DD / 2 + 0.1]}>
        <boxGeometry args={[DW - 0.1, 0.025, 0.08]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* ── Monitors — two, side by side ── */}
      <Monitor
        position={[-0.32, SY + 0.22, -DD / 2 + 0.12]}
        label="{ GITHUB }"
        subLabel="BUILD · COMMIT · GROW"
        onClick={() => openPanel("github")}
        emissiveColor="#8a5ae8"
      />
      <Monitor
        position={[0.32, SY + 0.22, -DD / 2 + 0.12]}
        label="{ DEVELOPER MODE }"
        subLabel="IDEAS · CODE · IMPACT"
        onClick={() => openPanel("developer")}
        emissiveColor="#20D9E8"
      />

      {/* ── Keyboard with mousepad ── */}
      <mesh position={[0, SY + 0.003, DD / 2 - 0.22]} castShadow>
        <boxGeometry args={[0.5, 0.005, 0.28]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.8} />
      </mesh>
      <mesh position={[0, SY + 0.009, DD / 2 - 0.22]} castShadow>
        <boxGeometry args={[0.42, 0.012, 0.14]} />
        <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── Mouse ── */}
      <mesh position={[0.28, SY + 0.015, DD / 2 - 0.2]} castShadow>
        <boxGeometry args={[0.055, 0.02, 0.09]} />
        <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* ── Laptop — left side, lid open ── */}
      <Laptop position={[-0.68, SY, DD / 2 - 0.15]} onClick={() => openPanel("project")} />

      {/* ── Pen holder ── */}
      <PenHolder position={[-0.52, SY + 0.04, -DD / 2 + 0.2]} />

      {/* ── Notebook / book ── */}
      <mesh position={[-0.52, SY + 0.008, DD / 2 - 0.18]} castShadow
        {...cursor} onClick={() => openPanel("about")}>
        <boxGeometry args={[0.14, 0.012, 0.18]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.7} />
      </mesh>
      <mesh position={[-0.52, SY + 0.015, DD / 2 - 0.18]} castShadow>
        <boxGeometry args={[0.13, 0.005, 0.17]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.8} />
      </mesh>

      {/* ── Smartphone ── */}
      <mesh position={[0.62, SY + 0.007, DD / 2 - 0.15]}
        {...cursor}
        onClick={() => openPanel("contact")}
        castShadow>
        <boxGeometry args={[0.065, 0.01, 0.13]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* ── Desk lamp — attached to back-left corner ── */}
      <group position={[-0.82, SY, -DD / 2 + 0.08]}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.018, 10]} />
          <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Arm */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.42, 6]} />
          <meshStandardMaterial color="#1c1c1e" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Shade */}
        <mesh position={[0.06, 0.42, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.04, 0.07, 0.1, 8]} />
          <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Warm bulb glow */}
        <mesh position={[0.06, 0.42, 0]}>
          <sphereGeometry args={[0.022, 6, 4]} />
          <meshStandardMaterial color="#ffe8b0" emissive="#ffe8b0" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* ── Resume folder ── */}
      <mesh position={[-0.72, SY + 0.005, DD / 2 - 0.3]}
        {...cursor}
        onClick={() => openPanel("resume")}
        castShadow>
        <boxGeometry args={[0.22, 0.008, 0.28]} />
        <meshStandardMaterial color="#c07820" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* ── Office chair ── */}
      <OfficeChair position={[0, 0, DD / 2 + 0.5]} />

      {/* ── Drawer unit — right side ── */}
      <DrawerUnit position={[DW / 2 + 0.24, 0.29, -DD / 2 + 0.25]} />
    </group>
  );
}
