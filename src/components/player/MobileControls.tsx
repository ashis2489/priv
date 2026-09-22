import { useEffect, useRef } from "react";
import { useStore } from "../../store/useStore";
import { mobileInput } from "../../utils/shared";

export function MobileControls() {
  const { openPanel, activePanel } = useStore();

  if (activePanel) return null;

  return (
    <div
      className="fixed left-0 right-0 flex justify-between items-end z-40 pointer-events-none"
      style={{
        bottom: "max(18px, env(safe-area-inset-bottom))",
        padding: "0 18px",
      }}
    >
      <div className="pointer-events-auto">
        <Joystick />
      </div>

      <div className="pointer-events-auto flex flex-col" style={{ gap: "7px", alignItems: "flex-end" }}>
        {[
          { label: "About",    action: () => openPanel("about") },
          { label: "Projects", action: () => openPanel("project") },
          { label: "Stack",    action: () => openPanel("skills") },
          { label: "Terminal", action: () => openPanel("terminal") },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              minWidth: "94px",
              minHeight: "36px",
              padding: "0 12px",
              borderRadius: "8px",
              background: "rgba(5,12,21,0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(45,226,230,0.22)",
              color: "#8fe6ea",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "11px",
              letterSpacing: 0,
              boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Joystick() {
  const stickRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const touchId = useRef<number | null>(null);

  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;

    const getCenter = () => {
      const rect = base.getBoundingClientRect();
      return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (touchId.current !== null) return;
      touchId.current = e.changedTouches[0].identifier;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchId.current === null) return;
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchId.current
      );
      if (!touch) return;
      const { cx, cy } = getCenter();
      const dx = touch.clientX - cx;
      const dy = touch.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 32;
      const clamped = Math.min(dist, maxDist);
      const angle = Math.atan2(dy, dx);
      mobileInput.dx = (Math.cos(angle) * clamped) / maxDist;
      mobileInput.dz = (Math.sin(angle) * clamped) / maxDist;
      if (stickRef.current) {
        stickRef.current.style.transform = `translate(calc(-50% + ${Math.cos(angle) * clamped}px), calc(-50% + ${Math.sin(angle) * clamped}px))`;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchId.current
      );
      if (!touch) return;
      touchId.current = null;
      mobileInput.dx = 0;
      mobileInput.dz = 0;
      if (stickRef.current) {
        stickRef.current.style.transform = "translate(-50%, -50%)";
      }
    };

    base.addEventListener("touchstart", onTouchStart, { passive: false });
    base.addEventListener("touchmove", onTouchMove, { passive: false });
    base.addEventListener("touchend", onTouchEnd);
    base.addEventListener("touchcancel", onTouchEnd);

    return () => {
      base.removeEventListener("touchstart", onTouchStart);
      base.removeEventListener("touchmove", onTouchMove);
      base.removeEventListener("touchend", onTouchEnd);
      base.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={baseRef}
      className="relative w-20 h-20 rounded-full"
      style={{
        width: "76px",
        height: "76px",
        borderRadius: "50%",
        background: "rgba(5,12,21,0.66)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(45,226,230,0.26)",
        boxShadow: "0 14px 32px rgba(0,0,0,0.26), inset 0 0 22px rgba(45,226,230,0.08)",
        touchAction: "none",
      }}
    >
      <div
        ref={stickRef}
        className="absolute w-9 h-9 rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(45,226,230,0.28)",
          border: "1px solid rgba(143,230,234,0.56)",
          boxShadow: "0 0 14px rgba(45,226,230,0.24)",
          transition: "transform 0.05s",
        }}
      />
    </div>
  );
}
