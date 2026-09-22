import { useEffect, useState, useCallback, useRef } from "react";
import { useStore, type RoomId } from "../../store/useStore";
import { ROOMS, ROOM_ORDER } from "../../config/rooms";

const W = 240, H = 190;
const NW = 52, NH = 28;

const NODE_POS: Record<RoomId, { x: number; y: number }> = {
  "project-lab":    { x: 40,  y: 30  },
  "knowledge-lab":  { x: 120, y: 30  },
  "terminal-lab":   { x: 200, y: 30  },
  "main-hq":        { x: 120, y: 100 },
  "cloud-center":   { x: 40,  y: 160 },
  "contact-lounge": { x: 200, y: 160 },
};

const EDGES: [RoomId, RoomId][] = [
  ["main-hq", "project-lab"],
  ["main-hq", "knowledge-lab"],
  ["main-hq", "terminal-lab"],
  ["main-hq", "cloud-center"],
  ["main-hq", "contact-lounge"],
];

function MapSVG({ currentRoom, navigateTo }: {
  currentRoom: RoomId;
  navigateTo: (id: RoomId) => void;
}) {
  const [hovered, setHovered] = useState<RoomId | null>(null);
  const [flowOffset, setFlowOffset] = useState(0);
  const rafRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    const loop = () => {
      tRef.current += 0.4;
      setFlowOffset(tRef.current % 12);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const playerPos = NODE_POS[currentRoom];

  return (
    <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id="mm-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="mm-glow-strong">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <style>{`
        @keyframes mm-flow { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        @keyframes mm-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          50%  { transform: scale(2);   opacity: 0; }
          100% { transform: scale(1);   opacity: 0.5; }
        }
      `}</style>

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const pa = NODE_POS[a], pb = NODE_POS[b];
        const isActive = a === currentRoom || b === currentRoom;
        return (
          <g key={i}>
            <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={isActive ? "rgba(32,217,232,0.5)" : "rgba(32,217,232,0.12)"}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray={isActive ? "none" : "4 4"}
              strokeDashoffset={-flowOffset}
            />
              {isActive && (
                <circle r={2} fill="#20D9E8" opacity={0.9} filter="url(#mm-glow)"
                  style={{
                    offsetPath: `path('M${pa.x},${pa.y} L${pb.x},${pb.y}')`,
                    offsetDistance: "0%",
                    offsetRotate: "0deg",
                    animation: "mm-flow 2s linear infinite",
                  }} />
              )}
          </g>
        );
      })}

      {/* Room nodes */}
      {ROOM_ORDER.map(roomId => {
        const pos = NODE_POS[roomId];
        const cfg = ROOMS[roomId];
        const isCurrent = roomId === currentRoom;
        const isHov = hovered === roomId;
        const words = cfg.label.split(" ");
        return (
          <g key={roomId}
            style={{ cursor: isCurrent ? "default" : "pointer" }}
            onMouseEnter={() => setHovered(roomId)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigateTo(roomId)}
          >
            {isCurrent && (
              <rect x={pos.x - NW/2 - 3} y={pos.y - NH/2 - 3}
                width={NW + 6} height={NH + 6} rx={7}
                fill={`${cfg.color}15`} filter="url(#mm-glow)" />
            )}
            <rect
              x={pos.x - NW/2} y={pos.y - NH/2}
              width={NW} height={NH} rx={5}
              fill={isCurrent ? `${cfg.color}20` : isHov ? `${cfg.color}10` : "rgba(8,10,16,0.92)"}
              stroke={isCurrent ? cfg.color : isHov ? `${cfg.color}70` : `${cfg.color}30`}
              strokeWidth={isCurrent ? 1.8 : 1}
            />
            <text x={pos.x} y={pos.y - 2}
              fill={isCurrent ? cfg.color : isHov ? "#D7E2EA" : "#8296a2"}
              fontSize={isCurrent ? "8" : "7.5"} textAnchor="middle"
              fontWeight={isCurrent ? "700" : "500"}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {words[0]}
            </text>
            {words.length > 1 && (
              <text x={pos.x} y={pos.y + 7}
                fill={isCurrent ? cfg.color : "#4a5a66"}
                fontSize="5.5" textAnchor="middle"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {words.slice(1).join(" ")}
              </text>
            )}
            {isHov && !isCurrent && (
              <text x={pos.x} y={pos.y + NH/2 + 11}
                fill={cfg.color} fontSize="6.5" textAnchor="middle"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                GO →
              </text>
            )}
          </g>
        );
      })}

      {/* Player dot */}
      <g filter="url(#mm-glow-strong)">
        <circle cx={playerPos.x} cy={playerPos.y - NH/2 - 10}
          r={4} fill={ROOMS[currentRoom].color} />
        <circle cx={playerPos.x} cy={playerPos.y - NH/2 - 10}
          r={7} fill="none" stroke={ROOMS[currentRoom].color}
          strokeWidth={1} opacity={0.4}
          style={{ transformBox: "fill-box", transformOrigin: "center", animation: "mm-pulse 2.2s ease-in-out infinite" }} />
      </g>
      <text x={playerPos.x} y={playerPos.y - NH/2 - 18}
        fill={ROOMS[currentRoom].color} fontSize="6" textAnchor="middle"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        YOU
      </text>
    </svg>
  );
}

export function Minimap() {
  const { showMinimap, toggleMinimap, currentRoom, setCurrentRoom, setTransitioning, setTransitionLabel } = useStore();
  const [cornerVisible, setCornerVisible] = useState(false);
  const cornerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show tiny icon when mouse near bottom-left corner
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const nearCorner = e.clientX < 120 && e.clientY > window.innerHeight - 120;
      if (nearCorner) {
        setCornerVisible(true);
        if (cornerTimer.current) clearTimeout(cornerTimer.current);
        cornerTimer.current = setTimeout(() => {
          if (!showMinimap) setCornerVisible(false);
        }, 2500);
      } else if (!showMinimap) {
        if (cornerTimer.current) clearTimeout(cornerTimer.current);
        cornerTimer.current = setTimeout(() => setCornerVisible(false), 800);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => { window.removeEventListener("mousemove", onMouseMove); if (cornerTimer.current) clearTimeout(cornerTimer.current); };
  }, [showMinimap]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && showMinimap) toggleMinimap(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMinimap, toggleMinimap]);

  const navigateTo = useCallback((roomId: RoomId) => {
    if (roomId === currentRoom) return;
    const cfg = ROOMS[roomId];
    setTransitionLabel(cfg.label);
    setTransitioning(true);
    setTimeout(() => setCurrentRoom(roomId), 400);
    setTimeout(() => setTransitioning(false), 1200);
    if (showMinimap) toggleMinimap();
  }, [currentRoom, setCurrentRoom, setTransitioning, setTransitionLabel, showMinimap, toggleMinimap]);

  const showIcon = cornerVisible || showMinimap;

  return (
    <>
      {/* ── Tiny corner icon (hidden by default, appears on hover) ── */}
      <button
        onClick={toggleMinimap}
        aria-label={showMinimap ? "Hide map" : "Show map"}
        style={{
          position: "fixed",
          bottom: "16px",
          left: "16px",
          zIndex: 25,
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: showMinimap ? "rgba(32,217,232,0.15)" : "rgba(8,10,18,0.85)",
          border: `1px solid ${showMinimap ? "rgba(32,217,232,0.5)" : "rgba(32,217,232,0.2)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          backdropFilter: "blur(8px)",
          boxShadow: showMinimap ? "0 0 12px rgba(32,217,232,0.15)" : "none",
          opacity: showIcon ? 1 : 0,
          transform: showIcon ? "scale(1)" : "scale(0.7)",
          transition: "opacity 0.35s ease, transform 0.35s ease, background 0.2s, border-color 0.2s",
          pointerEvents: showIcon ? "all" : "none",
        }}
        title="Map (hover bottom-left)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" fill="none"
            stroke={showMinimap ? "#20D9E8" : "#4a6a78"} strokeWidth="1.2" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" fill="none"
            stroke={showMinimap ? "#20D9E8" : "#4a6a78"} strokeWidth="1.2" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" fill="none"
            stroke={showMinimap ? "#20D9E8" : "#4a6a78"} strokeWidth="1.2" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" fill="none"
            stroke={showMinimap ? "#20D9E8" : "#4a6a78"} strokeWidth="1.2" />
          <circle cx="8" cy="8" r="1.5"
            fill={showMinimap ? "#20D9E8" : "#3a5560"} />
        </svg>
      </button>

      {/* ── Full minimap panel ── */}
      {showMinimap && (
      <div
        className="fade-in"
        style={{
          position: "fixed",
          bottom: "56px",
          left: "14px",
          zIndex: 25,
          background: "rgba(6,6,10,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(32,217,232,0.18)",
          borderRadius: "16px",
          padding: "14px 14px 10px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 30px rgba(32,217,232,0.04)",
          userSelect: "none",
          pointerEvents: "all",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          transformOrigin: "bottom left",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#20D9E8", letterSpacing: "0.25em" }}>
            HQ OVERVIEW
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "#5a7a86" }}>
              {ROOMS[currentRoom].label}
            </div>
            <button onClick={toggleMinimap}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#5a7a86", fontSize: "12px", lineHeight: 1, padding: "2px 4px" }}>
              ✕
            </button>
          </div>
        </div>

        <MapSVG currentRoom={currentRoom} navigateTo={navigateTo} />

        {/* Legend */}
        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#20D9E8", boxShadow: "0 0 4px #20D9E8" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7px", color: "#5a7a86" }}>YOU</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "14px", height: "1px", borderTop: "1px dashed rgba(32,217,232,0.4)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7px", color: "#5a7a86" }}>CORRIDOR</span>
          </div>
        </div>

        {/* Quick teleport buttons */}
        <div style={{ marginTop: "10px", borderTop: "1px solid rgba(32,217,232,0.08)", paddingTop: "8px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "#5a7a86", letterSpacing: "0.18em", marginBottom: "6px" }}>
            QUICK NAVIGATE
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {ROOM_ORDER.map(roomId => {
              const cfg = ROOMS[roomId];
              const isCurr = roomId === currentRoom;
              return (
                <button key={roomId} onClick={() => navigateTo(roomId)} disabled={isCurr}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.06em",
                    padding: "3px 8px", borderRadius: "5px",
                    border: `1px solid ${isCurr ? cfg.color : `${cfg.color}30`}`,
                    background: isCurr ? `${cfg.color}15` : "transparent",
                    color: isCurr ? cfg.color : "#3a5560",
                    cursor: isCurr ? "default" : "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isCurr) { const el = e.currentTarget as HTMLElement; el.style.background = `${cfg.color}10`; el.style.color = cfg.color; } }}
                  onMouseLeave={e => { if (!isCurr) { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#3a5560"; } }}
                >
                  {isCurr ? "● " : ""}{cfg.label.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Close hint */}
        <div style={{ marginTop: "8px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "7px", color: "#3a4a56" }}>
          ESC or click outside to close
        </div>
      </div>
      )}
    </>
  );
}
