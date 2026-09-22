/**
 * Global lighting — cyber tech-lab.
 * Lean: 2 directional + ambient + hemisphere + 2 point lights only.
 */
export function Lighting() {
  return (
    <>
      {/* Strong ambient — rooms must be readable */}
      <ambientLight intensity={2.2} color="#c8d4e0" />

      {/* Hemisphere — cool sky, neutral ground */}
      <hemisphereLight color="#b0c8e0" groundColor="#1a1a20" intensity={1.2} />

      {/* Key directional with soft shadows */}
      <directionalLight
        position={[6, 14, 8]}
        intensity={2.8}
        color="#d8e8f8"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.001}
        shadow-radius={6}
      />

      {/* Fill from opposite side */}
      <directionalLight position={[-5, 8, -6]} intensity={1.2} color="#c0d0e0" />

      {/* Desk lamp — warm tungsten */}
      <pointLight position={[-0.75, 2.5, -3.8]} intensity={4.0} color="#ffcc77" distance={6} decay={2} />

      {/* Monitor glow */}
      <pointLight position={[0.2, 2.0, -3.2]} intensity={2.0} color="#4488cc" distance={4} decay={2} />
    </>
  );
}
