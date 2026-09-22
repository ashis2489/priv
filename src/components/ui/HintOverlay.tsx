import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

export function HintOverlay() {
  const { pointerLocked, activePanel, isLoading } = useStore();
  const [dismissed, setDismissed] = useState(false);

  // Auto-dismiss 8 seconds after pointer lock is acquired
  useEffect(() => {
    if (pointerLocked) {
      const t = setTimeout(() => setDismissed(true), 8000);
      return () => clearTimeout(t);
    }
  }, [pointerLocked]);

  // Never show during loading or when a panel is open
  if (isLoading || activePanel || dismissed) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "60px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 20,
      pointerEvents: "none",
      textAlign: "center",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {!pointerLocked ? (
        /* ── Click prompt — shown until pointer lock is granted ── */
        <div style={{
          background: "rgba(4,8,16,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          padding: "12px 24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}>
          <div style={{
            fontSize: "13px",
            color: "#e8e4dc",
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}>
            🖱 &nbsp;<strong>Click anywhere</strong> to enable mouse-look
          </div>
          <div style={{
            fontSize: "11px",
            color: "#6a7a90",
            letterSpacing: "0.04em",
          }}>
            WASD / Arrow keys to move &nbsp;·&nbsp; Esc to release mouse
          </div>
        </div>
      ) : (
        /* ── Controls reminder — shown briefly after lock acquired ── */
        <div style={{
          background: "rgba(4,8,16,0.78)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "6px 18px",
          fontSize: "11px",
          color: "#6a7a90",
          letterSpacing: "0.05em",
        }}>
          WASD move &nbsp;·&nbsp; Mouse look &nbsp;·&nbsp; Shift sprint &nbsp;·&nbsp; Esc release
        </div>
      )}
    </div>
  );
}
