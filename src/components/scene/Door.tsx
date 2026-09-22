import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore, type RoomId } from "../../store/useStore";
import { ROOMS } from "../../config/rooms";
import { yawRef } from "../../utils/shared";
import * as THREE from "three";

interface DoorProps {
  targetRoom: RoomId;
  position: [number, number, number];
  rotation?: [number, number, number];
  label?: string;
}

export function Door({ targetRoom, position, rotation = [0, 0, 0], label }: DoorProps) {
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef<THREE.Mesh>(null);
  const { setCurrentRoom, setTransitioning, setTransitionLabel, closePanel, activePanel } = useStore();
  const { camera } = useThree();
  const config = ROOMS[targetRoom];

  useFrame(({ clock }) => {
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      const t = clock.getElapsedTime();
      mat.emissiveIntensity = hovered
        ? 1.2 + Math.sin(t * 4) * 0.2
        : 0.5 + Math.sin(t * 1.5) * 0.12;
    }
  });

  const enter = () => {
    if (activePanel) closePanel();
    setTransitionLabel(config.label);
    setTransitioning(true);

    setTimeout(() => {
      const [sx, sy, sz] = config.spawnPos;
      camera.position.set(sx, sy, sz);
      const euler = new THREE.Euler(0, config.spawnYaw, 0, "YXZ");
      camera.quaternion.setFromEuler(euler);
      // Sync PlayerController yaw ref
      yawRef.current = config.spawnYaw;
      setCurrentRoom(targetRoom);
    }, 380);

    setTimeout(() => {
      setTransitioning(false);
    }, 1200);
  };

  const W = 1.4, H = 2.5;

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      onClick={enter}
    >
      {/* Door frame outer */}
      <mesh>
        <boxGeometry args={[W + 0.18, H + 0.18, 0.12]} />
        <meshStandardMaterial color="#0a1525" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Door surface */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[W, H, 0.05]} />
        <meshStandardMaterial
          color="#050d18"
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Animated glow frame */}
      <mesh ref={frameRef} position={[0, 0, 0.09]}>
        <boxGeometry args={[W + 0.05, H + 0.05, 0.01]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Top label bar */}
      <mesh position={[0, H / 2 + 0.06, 0.1]}>
        <boxGeometry args={[W, 0.06, 0.01]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Bottom bar */}
      <mesh position={[0, -H / 2 - 0.06, 0.1]}>
        <boxGeometry args={[W, 0.06, 0.01]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Room name text */}
      <Text
        position={[0, 0.4, 0.12]}
        fontSize={0.14}
        color={config.color}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
        letterSpacing={0.12}
      >
        {label ?? config.label}
      </Text>

      <Text
        position={[0, 0.16, 0.12]}
        fontSize={0.08}
        color="#718096"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {config.sublabel}
      </Text>

      {/* ENTER hint */}
      <Text
        position={[0, -0.2, 0.12]}
        fontSize={0.1}
        color={hovered ? config.color : "#3a5060"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {hovered ? "[ ENTER → ]" : "[ ENTER ]"}
      </Text>

      {/* Floor indicator strip */}
      <mesh position={[0, -H / 2 - 0.03, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, 0.6]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={hovered ? 1.0 : 0.3}
          transparent
          opacity={0.25}
        />
      </mesh>

    </group>
  );
}
