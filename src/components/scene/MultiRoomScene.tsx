import { lazy, Suspense } from "react";
import { ROOMS } from "../../config/rooms";
import { useStore } from "../../store/useStore";
import { Room } from "./Room";
import { OpenWorldFloor } from "./OpenWorldFloor";

// Lazy-load heavy room components — only downloaded when needed
const ProjectLabRoom   = lazy(() => import("../scenes/ProjectLabRoom").then(m => ({ default: m.ProjectLabRoom })));
const KnowledgeLabRoom = lazy(() => import("../scenes/KnowledgeLabRoom").then(m => ({ default: m.KnowledgeLabRoom })));
const TerminalLabRoom  = lazy(() => import("../scenes/TerminalLabRoom").then(m => ({ default: m.TerminalLabRoom })));
const CloudCenterRoom  = lazy(() => import("../scenes/CloudCenterRoom").then(m => ({ default: m.CloudCenterRoom })));
const ContactLoungeRoom = lazy(() => import("../scenes/ContactLoungeRoom").then(m => ({ default: m.ContactLoungeRoom })));

/**
 * Performance strategy:
 * - Main HQ always rendered (it's the hub)
 * - Other rooms only rendered when player is in them
 * - Shared floor/corridors always rendered (lightweight)
 * - Lazy imports for all sub-rooms
 */
export function MultiRoomScene() {
  const { currentRoom } = useStore();

  return (
    <group>
      {/* ── Shared world geometry (floor + corridors + doors + windows) ── */}
      <OpenWorldFloor />

      {/* ── Main HQ — always rendered ── */}
      <group position={ROOMS["main-hq"].worldOffset}>
        <Room />
      </group>

      {/* ── Sub-rooms — only render current room ── */}
      <Suspense fallback={null}>
        {currentRoom === "knowledge-lab" && (
          <group position={ROOMS["knowledge-lab"].worldOffset}><KnowledgeLabRoom /></group>
        )}
        {currentRoom === "terminal-lab" && (
          <group position={ROOMS["terminal-lab"].worldOffset}><TerminalLabRoom /></group>
        )}
        {currentRoom === "project-lab" && (
          <group position={ROOMS["project-lab"].worldOffset}><ProjectLabRoom /></group>
        )}
        {currentRoom === "cloud-center" && (
          <group position={ROOMS["cloud-center"].worldOffset}><CloudCenterRoom /></group>
        )}
        {currentRoom === "contact-lounge" && (
          <group position={ROOMS["contact-lounge"].worldOffset}><ContactLoungeRoom /></group>
        )}
      </Suspense>
    </group>
  );
}
