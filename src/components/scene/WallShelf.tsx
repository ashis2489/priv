/**
 * Wall shelf — mounted above desk on back wall.
 * Contains books, small plant, and decorative items.
 */
import { Text } from "@react-three/drei";

export function WallShelf({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Shelf board */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.03, 0.2]} />
        <meshStandardMaterial color="#6e4a2f" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Shelf brackets */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, -0.08, 0.08]}>
          <boxGeometry args={[0.02, 0.15, 0.02]} />
          <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Books stack — "Discipline", "Build", "Create", "Repeat" */}
      <group position={[-0.25, 0.02, 0]}>
        {[
          { y: 0.015, color: "#2a2a2a", label: "Discipline" },
          { y: 0.035, color: "#1a1a1a", label: "Build" },
          { y: 0.055, color: "#2a2a2a", label: "Create" },
          { y: 0.075, color: "#1a1a1a", label: "Repeat" },
        ].map((book, i) => (
          <group key={i}>
            <mesh position={[0, book.y, 0]} castShadow>
              <boxGeometry args={[0.12, 0.018, 0.16]} />
              <meshStandardMaterial color={book.color} roughness={0.8} />
            </mesh>
            <Text
              position={[0, book.y + 0.01, 0.082]}
              fontSize={0.012}
              color="#e8e4d8"
              anchorX="center"
              anchorY="middle"
            >
              {book.label}
            </Text>
          </group>
        ))}
      </group>

      {/* Small trailing plant */}
      <group position={[0.35, 0.02, 0]}>
        {/* Pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.05, 8]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
        {/* Leaves hanging down */}
        {[
          [0, 0.04, 0.02],
          [-0.02, 0.03, 0.04],
          [0.02, 0.035, 0.03],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[0.4, i * 0.8, 0.2]}>
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial color="#2a5820" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Globe */}
      <group position={[0.05, 0.06, 0]}>
        <mesh>
          <sphereGeometry args={[0.04, 12, 8]} />
          <meshStandardMaterial color="#1a3a4a" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Globe stand */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.005, 0.03, 0.04, 8]} />
          <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* LED strip under shelf — warm glow */}
      <mesh position={[0, -0.02, 0.09]}>
        <boxGeometry args={[0.95, 0.005, 0.01]} />
        <meshStandardMaterial
          color="#FFB84D"
          emissive="#FFB84D"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
