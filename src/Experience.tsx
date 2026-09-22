import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Scene } from "./components/scene/Scene";
import { useStore } from "./store/useStore";

/**
 * The entire WebGL/three.js stack lives behind this lazy boundary so the
 * initial page load (Entry screen / Classic portfolio) stays tiny. three.js
 * is only fetched once the user clicks "Enter 3D".
 */

// Shadows are frozen for perf, but sub-rooms mount on navigation — refresh the
// shadow map once each time the room changes so new furniture still casts.
function ShadowSync() {
  const gl = useThree((s) => s.gl);
  const room = useStore((s) => s.currentRoom);
  useEffect(() => { gl.shadowMap.needsUpdate = true; }, [room, gl]);
  return null;
}

export default function Experience() {
  const dimmed = useStore((s) => s.activePanel !== null);

  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false, toneMappingExposure: 1.1 }}
      camera={{ fov: 58, near: 0.04, far: 120 }}
      dpr={[1, 1.25]}
      tabIndex={0}
      onCreated={({ gl }) => {
        // Render the shadow map once; ShadowSync re-arms it on room changes.
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        gl.domElement.tabIndex = 0;
        gl.domElement.focus();
      }}
      style={{
        position: "absolute", inset: 0,
        transition: "filter 0.35s ease",
        filter: dimmed ? "brightness(0.45)" : "brightness(1)",
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <ShadowSync />
    </Canvas>
  );
}
