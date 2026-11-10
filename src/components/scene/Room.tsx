/**
 * Main HQ — room content.
 * FloatingParticles removed (moved to MultiRoomScene, conditionally).
 */
import { Desk }          from "./Desk";
import { BackWall }      from "./BackWall";
import { LeftWall }      from "./LeftWall";
import { RightWall }     from "./RightWall";
import { Arcade }        from "./Arcade";
import { Whiteboard }    from "./Whiteboard";
import { WallShelf }     from "./WallShelf";
export function Room() {
  return (
    <group>
      <BackWall />
      <LeftWall />
      <RightWall />
      <Desk />
      <Whiteboard />
      <Arcade />
      <WallShelf position={[-1.8, 2.5, -4.45]} scale={1.2} />
    </group>
  );
}
