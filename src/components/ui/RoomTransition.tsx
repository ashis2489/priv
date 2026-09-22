import { useEffect, useRef, useState } from "react";
import { useStore } from "../../store/useStore";
import { ROOMS } from "../../config/rooms";

export function RoomTransition() {
  const { transitioning, transitionLabel } = useStore();
  const [phase, setPhase] = useState<"hidden" | "in" | "label" | "out">("hidden");
  const [display, setDisplay] = useState<{ label: string; sub: string; color: string } | null>(null);
  // Only the newest transition's timers may set phase; phases always run to
  // completion so the overlay never gets stuck when `transitioning` clears early.
  const seq = useRef(0);

  useEffect(() => {
    if (!transitioning) return;
    const id = ++seq.current;
    const cfg = Object.values(ROOMS).find(r => r.label === transitionLabel);
    setDisplay({
      label: transitionLabel,
      sub: cfg?.sublabel ?? "",
      color: cfg?.color ?? "#20D9E8",
    });
    setPhase("in");
    const at = (p: typeof phase, ms: number) =>
      setTimeout(() => { if (seq.current === id) setPhase(p); }, ms);
    at("label", 350);
    at("out", 900);
    at("hidden", 1250);
  }, [transitioning, transitionLabel]);

  if (phase === "hidden" || !display) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        background: `rgba(2,4,6,${phase === "in" ? 0.95 : phase === "label" ? 0.9 : 0})`,
        transition: phase === "out" ? "background 0.35s ease" : "background 0.3s ease",
      }}
    >
      {phase === "label" && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.25s ease forwards" }}>
          {/* Corner accents */}
          <div style={{ display: "flex", gap: "300px", marginBottom: "4px" }}>
            <div style={{ width: "30px", height: "2px", background: display.color, opacity: 0.6 }} />
            <div style={{ width: "30px", height: "2px", background: display.color, opacity: 0.6 }} />
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: display.color,
            letterSpacing: "0.35em",
            marginBottom: "10px",
            opacity: 0.7,
          }}>
            ENTERING
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "32px",
            fontWeight: 800,
            color: display.color,
            letterSpacing: "0.2em",
            textShadow: `0 0 30px ${display.color}80, 0 0 60px ${display.color}30`,
            marginBottom: "8px",
          }}>
            {display.label}
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#718096",
            letterSpacing: "0.2em",
          }}>
            {display.sub}
          </div>

          {/* Scan line */}
          <div style={{
            marginTop: "20px",
            width: "200px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${display.color}, transparent)`,
            margin: "16px auto 0",
          }} />

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            color: "#3a5060",
            letterSpacing: "0.25em",
            marginTop: "8px",
          }}>
            SYSTEM MODULE LOADED
          </div>
        </div>
      )}
    </div>
  );
}
