import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

const STAGES = [
  { label: "3D ENVIRONMENT", threshold: 20  },
  { label: "LIGHTING",       threshold: 45  },
  { label: "PROJECTS DATA",  threshold: 70  },
  { label: "SYSTEMS ONLINE", threshold: 100 },
];

const BOOT_LINES = [
  "VEDAA_OS v2.0.4 — Cyber Core",
  "Initializing 3D workspace...",
  "Loading environment geometry...",
  "Mounting developer profile...",
  "Activating interactive systems...",
  "All systems nominal. Welcome.",
];

export function LoadingScreen() {
  const { loadingProgress, isLoading, loadingComplete, setLoading } = useStore();
  const [opacity, setOpacity]     = useState(1);
  const [bootLines, setBootLines] = useState<string[]>([]);

  // Fade out on done
  useEffect(() => {
    if (!isLoading) setOpacity(0);
  }, [isLoading]);

  // Typewriter boot lines
  useEffect(() => {
    let i = 0;
    const add = () => {
      if (i < BOOT_LINES.length) {
        setBootLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
        setTimeout(add, 320);
      }
    };
    const t = setTimeout(add, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#020406",
        opacity,
        transition: "opacity 0.7s ease",
        pointerEvents: isLoading ? "all" : "none",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* CRT scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(32,217,232,0.012) 2px,rgba(32,217,232,0.012) 4px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px", padding: "0 24px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "54px",
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#20D9E8",
            textShadow: "0 0 32px rgba(32,217,232,0.65), 0 0 64px rgba(32,217,232,0.25)",
            lineHeight: 1,
            marginBottom: "8px",
          }}>
            VEDAA
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#3a5060" }}>
            CYBER CORE
          </div>
        </div>

        {/* Boot lines */}
        <div
          style={{
            background: "rgba(2,6,14,0.85)",
            border: "1px solid rgba(32,217,232,0.1)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "24px",
            minHeight: "120px",
          }}
        >
          {bootLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: "11px",
                lineHeight: "1.7",
                color: i === bootLines.length - 1 ? "#20D9E8" : "#3a5060",
              }}
            >
              {i === bootLines.length - 1 ? "> " : "  "}{line}
              {i === bootLines.length - 1 && (
                <span style={{ animation: "blink 1s step-end infinite", color: "#20D9E8" }}>█</span>
              )}
            </div>
          ))}
        </div>

        {/* Stage bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
          {STAGES.map((stage, i) => {
            const stageStart = i * 25;
            const pct = Math.min(100, Math.max(0, ((loadingProgress - stageStart) / 25) * 100));
            return (
              <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "130px", fontSize: "9px", letterSpacing: "0.14em", color: pct > 0 ? "#20D9E8" : "#1a2a3a", flexShrink: 0 }}>
                  {stage.label}
                </div>
                <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(32,217,232,0.07)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    borderRadius: "1px",
                    background: pct >= 100 ? "linear-gradient(90deg,#20D9E8,#61DAFB)" : "#20D9E8",
                    boxShadow: pct > 0 ? "0 0 8px rgba(32,217,232,0.6)" : "none",
                    transition: "width 0.35s ease",
                  }} />
                </div>
                <div style={{ width: "28px", textAlign: "right", fontSize: "9px", color: pct >= 100 ? "#20D9E8" : "#1a2a3a", flexShrink: 0 }}>
                  {pct >= 100 ? "✓" : `${Math.round(pct)}%`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Master bar */}
        <div style={{ height: "2px", borderRadius: "1px", background: "rgba(32,217,232,0.08)", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{
            height: "100%",
            width: `${loadingProgress}%`,
            background: "linear-gradient(90deg,#20D9E8,#8a5ae8)",
            boxShadow: "0 0 10px rgba(32,217,232,0.5)",
            transition: "width 0.4s ease",
            borderRadius: "1px",
          }} />
        </div>

        {/* Enter prompt */}
        {loadingComplete && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease forwards" }}>
            <button
              onClick={() => setLoading(false)}
              style={{
                display: "inline-block",
                padding: "10px 28px",
                borderRadius: "8px",
                border: "1px solid rgba(32,217,232,0.35)",
                background: "rgba(32,217,232,0.05)",
                color: "#20D9E8",
                fontSize: "11px",
                letterSpacing: "0.22em",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(32,217,232,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(32,217,232,0.05)"; }}
            >
              ENTER WORKSPACE →
            </button>
          </div>
        )}

        {/* Controls hint */}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "9px", color: "#1a2530", letterSpacing: "0.1em" }}>
          WASD / ARROWS MOVE &nbsp;·&nbsp; MOUSE LOOK &nbsp;·&nbsp; CLICK INTERACT &nbsp;·&nbsp; ALT+1-9 NAV
        </div>
      </div>
    </div>
  );
}
