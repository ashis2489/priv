import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, speeds, offsets } = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    const speeds    = new Float32Array(count);
    const offsets   = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = Math.random() * 3.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i]  = 0.015 + Math.random() * 0.025;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, speeds, offsets };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.007;
      // gentle horizontal drift
      pos[i * 3]     += Math.sin(t * 0.3 + offsets[i]) * 0.0003;
      if (pos[i * 3 + 1] > 3.5) pos[i * 3 + 1] = 0.05;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        color="#20D9E8"
        transparent
        opacity={0.38}
        sizeAttenuation
      />
    </points>
  );
}
