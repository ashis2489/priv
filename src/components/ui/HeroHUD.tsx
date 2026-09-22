import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

export function HeroHUD() {
  const { openPanel, pointerLocked, currentRoom } = useStore();
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden]   = useState(false); // soft-hide (not permanent)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Soft-hide after 10s of pointer lock — user can get it back by moving mouse to left
  useEffect(() => {
    if (pointerLocked) {
      const t = setTimeout(() => setHidden(true), 10000);
      return () => clearTimeout(t);
    } else {
      setHidden(false); // restore when pointer released (panel closed etc)
    }
  }, [pointerLocked]);

  if (currentRoom !== "main-hq" || (hidden && pointerLocked)) return null;

  return (
    <div
      className="fixed z-20 pointer-events-none"
      style={{
        left: "22px",
        bottom: "28px",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div
        className="pointer-events-auto"
        style={{
          background: "linear-gradient(145deg, rgba(9,16,26,0.82), rgba(11,18,28,0.64))",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(143,230,234,0.14)",
          borderRadius: "8px",
          padding: "16px 18px",
          maxWidth: "286px",
          boxShadow: "0 18px 42px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "26px",
            fontWeight: 800,
            color: "#f3f7f8",
            letterSpacing: 0,
            lineHeight: 1,
            marginBottom: "6px",
          }}
        >
          VEDAA
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: "#D7E2EA",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          Full-Stack Developer
          <br />
          Computer Science Engineer
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            color: "#93a4b3",
            lineHeight: "1.5",
            margin: "10px 0 14px",
          }}
        >
          Building scalable applications and interactive digital products.
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openPanel("project")}
            aria-label="Explore projects"
            className="btn-hud-primary"
          >
            EXPLORE PROJECTS
          </button>
          <button
            onClick={() => openPanel("about")}
            aria-label="About me"
            className="btn-hud-secondary"
          >
            ABOUT ME
          </button>
        </div>
      </div>
    </div>
  );
}
