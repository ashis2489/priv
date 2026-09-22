import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useStore } from "../../store/useStore";
import { ROOMS } from "../../config/rooms";
import { yawRef } from "../../utils/shared";
import * as THREE from "three";

/**
 * Handles minimap fast-travel — moves camera to selected room spawn.
 * In open-world mode the player normally walks, but minimap still
 * allows instant navigation for convenience.
 */
export function RoomTeleporter() {
  const { camera } = useThree();
  const { transitioning } = useStore();
  const prevTransitioning = useRef(false);
  const pendingRoom = useRef<string | null>(null);

  // Watch for transition completing
  const { currentRoom } = useStore();
  useEffect(() => {
    pendingRoom.current = currentRoom;
  }, [currentRoom]);

  useEffect(() => {
    if (prevTransitioning.current && !transitioning && pendingRoom.current) {
      // Transition just ended — move camera to spawn
      const cfg = ROOMS[pendingRoom.current as keyof typeof ROOMS];
      if (cfg) {
        const [sx, sy, sz] = cfg.spawnPos;
        camera.position.set(sx, sy, sz);
        const euler = new THREE.Euler(0, cfg.spawnYaw, 0, "YXZ");
        camera.quaternion.setFromEuler(euler);
        yawRef.current = cfg.spawnYaw;
      }
    }
    prevTransitioning.current = transitioning;
  }, [transitioning, camera]);

  return null;
}
