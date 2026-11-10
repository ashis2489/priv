import { AdaptiveDpr } from "@react-three/drei";
import { MultiRoomScene }   from "./MultiRoomScene";
import { PlayerController } from "../player/PlayerController";
import { Lighting }         from "./Lighting";
import { RoomTeleporter }   from "./RoomTeleporter";
import { ProgressTracker }  from "./ProgressTracker";
import { FloatingParticles } from "./FloatingParticles";
import { AiAssistant }      from "./AiAssistant";

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
      <AiAssistant />
      <PlayerController />
      <RoomTeleporter />
    </>
  );
}
