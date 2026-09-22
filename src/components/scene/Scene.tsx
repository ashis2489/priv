import { AdaptiveDpr } from "@react-three/drei";
import { MultiRoomScene }   from "./MultiRoomScene";
import { PlayerController } from "../player/PlayerController";
import { Lighting }         from "./Lighting";
import { RoomTeleporter }   from "./RoomTeleporter";
import { ProgressTracker }  from "./ProgressTracker";
import { FloatingParticles } from "./FloatingParticles";

export function Scene() {
  return (
    <>
      <AdaptiveDpr pixelated />
      <color attach="background" args={["#05080f"]} />
      <fog attach="fog" args={["#05080f", 40, 95]} />

      <Lighting />
      <ProgressTracker />

      <MultiRoomScene />
      <FloatingParticles />
      <PlayerController />
      <RoomTeleporter />
    </>
  );
}
