import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

export function WelcomeMessage() {
  const [visible, setVisible] = useState(true);
  const { pointerLocked } = useStore();

  // Dismiss after 6s or as soon as pointer lock is acquired
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (pointerLocked) setVisible(false);
  }, [pointerLocked]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      top: "62px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 20,
      pointerEvents: "none",
      animation: "fadeIn 0.4s ease forwards",
    }}>
      <div style={{
        background: "rgba(4,8,16,0.92)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(32,217,232,0.18)",
        borderRadius: "8px",
        padding: "8px 18px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        color: "#8aacba",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
        boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#20D9E8",
          boxShadow: "0 0 8px #20D9E8",
          flexShrink: 0,
          display: "inline-block",
        }} />
        Click canvas to look around &nbsp;·&nbsp; WASD to move
      </div>
    </div>
  );
}
