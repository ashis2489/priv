import { useState, useEffect, useRef, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";
import { ROOMS, ROOM_ORDER } from "../../config/rooms";

const PRIMARY_NAV_ITEMS = [
  { label: "HOME",     action: "home"     },
  { label: "ABOUT",    action: "about"    },
  { label: "PROJECTS", action: "project"  },
  { label: "STACK",    action: "skills"   },
  { label: "CONTACT",  action: "contact"  },
  { label: "TERMINAL", action: "terminal" },
] as const;

const PANEL_ITEMS = [
  { label: "About", action: "about" },
  { label: "Projects", action: "project" },
  { label: "Tech Stack", action: "skills" },
  { label: "Terminal", action: "terminal" },
  { label: "Architecture", action: "architecture" },
  { label: "GitHub", action: "github" },
  { label: "Contact", action: "contact" },
  { label: "Resume", action: "resume" },
] as const;

type NavAction = (typeof PRIMARY_NAV_ITEMS)[number]["action"] | "github";

export function Navigation() {
  const [showQuick, setShowQuick] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [compactNav, setCompactNav] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1080 : false
  );
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    openPanel, closePanel, activePanel, soundEnabled, toggleSound,
    currentRoom, setCurrentRoom, setTransitioning, setTransitionLabel,
    pointerLocked,
  } = useStore();

  useEffect(() => {
    const onResize = () => setCompactNav(window.innerWidth < 1080);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (activePanel || !pointerLocked) {
      setNavVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      return;
    }

    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setNavVisible(false), 4000);
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [pointerLocked, activePanel]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (e.clientY < 80) {
        setNavVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (pointerLocked && !activePanel) {
          hideTimer.current = setTimeout(() => setNavVisible(false), 3000);
        }
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [pointerLocked, activePanel]);

  const navigateToRoom = useCallback((roomId: string) => {
    if (roomId === currentRoom) return;
    const cfg = ROOMS[roomId as keyof typeof ROOMS];
    setTransitionLabel(cfg.label);
    setTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(roomId as any);
      setTransitioning(false);
    }, 400);
    setShowQuick(false);
  }, [currentRoom, setCurrentRoom, setTransitionLabel, setTransitioning]);

  const handleNav = (action: NavAction) => {
    switch (action) {
      case "home":     closePanel(); break;
      case "about":    openPanel("about"); break;
      case "project":  openPanel("project"); break;
      case "skills":   openPanel("skills"); break;
      case "contact":  openPanel("contact"); break;
      case "terminal": openPanel("terminal"); break;
      case "github":   openPanel("github"); break;
    }
  };

  useEffect(() => {
    const SHORTCUTS: { key: string; type: "panel" | "room"; value: string }[] = [
      { key: "1", type: "panel", value: "about" },
      { key: "2", type: "panel", value: "project" },
      { key: "3", type: "panel", value: "skills" },
      { key: "4", type: "panel", value: "architecture" },
      { key: "5", type: "panel", value: "terminal" },
      { key: "6", type: "panel", value: "github" },
      { key: "7", type: "panel", value: "contact" },
      { key: "8", type: "panel", value: "resume" },
      { key: "9", type: "panel", value: "status" },
      { key: "q", type: "room", value: "main-hq" },
      { key: "w", type: "room", value: "project-lab" },
      { key: "e", type: "room", value: "knowledge-lab" },
      { key: "r", type: "room", value: "terminal-lab" },
      { key: "t", type: "room", value: "cloud-center" },
      { key: "y", type: "room", value: "contact-lounge" },
    ];
    const handler = (ev: KeyboardEvent) => {
      if (!ev.altKey) return;
      const sc = SHORTCUTS.find(s => s.key === ev.key);
      if (!sc) return;
      ev.preventDefault();
      if (sc.type === "panel") openPanel(sc.value as any);
      else navigateToRoom(sc.value);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigateToRoom, openPanel]);

  const roomCfg = ROOMS[currentRoom];
  const isActive = (action: NavAction) => {
    if (action === "home") return activePanel === null;
    if (action === "contact") return activePanel === "contact";
    return activePanel === action;
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-30"
        aria-label="Portfolio navigation"
        style={{
          height: compactNav ? "58px" : "56px",
          padding: compactNav ? "0 12px" : "0 22px",
          background: "linear-gradient(180deg, rgba(3,7,13,0.94), rgba(7,13,22,0.74))",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(143,230,234,0.14)",
          boxShadow: "0 16px 36px rgba(0,0,0,0.22)",
          opacity: navVisible ? 1 : 0,
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          pointerEvents: navVisible ? "all" : "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: compactNav ? "1fr auto" : "minmax(210px, 1fr) auto minmax(210px, 1fr)",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div className="flex items-center" style={{ gap: "10px", minWidth: 0 }}>
            <button
              onClick={() => handleNav("home")}
              aria-label="Go home"
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                minWidth: 0,
                padding: 0,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#dff8f9",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 800, letterSpacing: 0, whiteSpace: "nowrap" }}>
                VEDAA
              </span>
              {!compactNav && (
                <span style={{ color: "#5b7684", fontSize: "10px", letterSpacing: 0, whiteSpace: "nowrap" }}>
                  DEV EXPERIENCE
                </span>
              )}
            </button>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: compactNav ? "9px" : "10px",
                letterSpacing: 0,
                color: roomCfg.color,
                background: `${roomCfg.color}14`,
                border: `1px solid ${roomCfg.color}36`,
                borderRadius: "999px",
                padding: compactNav ? "4px 8px" : "4px 10px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: compactNav ? "126px" : "170px",
              }}
            >
              {roomCfg.label}
            </div>
          </div>

          {!compactNav && (
            <div
              className="flex items-center"
              style={{
                justifySelf: "center",
                gap: "2px",
                padding: "4px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(143,230,234,0.1)",
              }}
            >
              {PRIMARY_NAV_ITEMS.map(item => {
                const active = isActive(item.action);
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.action)}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={active ? "page" : undefined}
                    className={`nav-item ${active ? "active" : ""}`}
                    style={{
                      minWidth: item.label === "PROJECTS" ? "78px" : "64px",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center" style={{ justifySelf: "end", gap: "8px" }}>
            {!compactNav && (
              <button
                onClick={() => handleNav("github")}
                aria-label="Open GitHub panel"
                style={{
                  width: "38px",
                  height: "30px",
                  borderRadius: "7px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: isActive("github") ? "rgba(143,230,234,0.12)" : "rgba(255,255,255,0.04)",
                  color: isActive("github") ? "#e8fbfc" : "#8ea1ad",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: 0,
                }}
              >
                GH
              </button>
            )}

            <button
              onClick={() => setShowQuick(v => !v)}
              aria-label="Toggle quick navigation"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#8fe6ea",
                fontSize: "10px",
                letterSpacing: 0,
                minWidth: compactNav ? "56px" : "92px",
                height: "30px",
                padding: "0 12px",
                borderRadius: "7px",
                border: "1px solid rgba(143,230,234,0.3)",
                background: showQuick ? "rgba(143,230,234,0.16)" : "rgba(143,230,234,0.07)",
                cursor: "pointer",
                transition: "background 0.2s ease, border-color 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {compactNav ? (showQuick ? "CLOSE" : "NAV") : showQuick ? "CLOSE" : "QUICK NAV"}
            </button>

            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? "Turn audio off" : "Turn audio on"}
              title={soundEnabled ? "Audio on" : "Audio off"}
              style={{
                background: soundEnabled ? "rgba(255,184,77,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${soundEnabled ? "rgba(255,184,77,0.28)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "7px",
                color: soundEnabled ? "#FFB84D" : "#8ea1ad",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: 0,
                minWidth: compactNav ? "44px" : "72px",
                height: "30px",
                padding: "0 9px",
                whiteSpace: "nowrap",
              }}
            >
              {compactNav ? (soundEnabled ? "ON" : "OFF") : soundEnabled ? "AUDIO ON" : "AUDIO OFF"}
            </button>
          </div>
        </div>
      </nav>

      {showQuick && (
        <aside
          className="fixed z-30 fade-in"
          aria-label="Quick navigation menu"
          style={{
            top: compactNav ? "66px" : "64px",
            right: "12px",
            width: "min(310px, calc(100vw - 24px))",
            maxHeight: compactNav ? "calc(100vh - 78px)" : "calc(100vh - 76px)",
            overflowX: "hidden",
            overflowY: "auto",
            background: "linear-gradient(180deg, rgba(3,8,15,0.98), rgba(5,12,21,0.94))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(32,217,232,0.14)",
            borderRadius: "8px",
            boxShadow: "0 20px 56px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderBottom: "1px solid rgba(32,217,232,0.08)",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#8fe6ea", letterSpacing: 0 }}>
                QUICK NAV
              </div>
              <div style={{ fontSize: "11px", color: "#5f7482", marginTop: "2px" }}>
                Jump between rooms and panels
              </div>
            </div>
            <button
              onClick={() => setShowQuick(false)}
              aria-label="Close quick navigation"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "#8ea1ad",
                cursor: "pointer",
              }}
            >
              x
            </button>
          </div>

          <div style={{ padding: "10px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#4f6471", letterSpacing: 0, margin: "2px 6px 7px" }}>
              ROOMS
            </div>
            {ROOM_ORDER.map((roomId, i) => {
              const cfg = ROOMS[roomId];
              const current = currentRoom === roomId;
              return (
                <button
                  key={roomId}
                  onClick={() => navigateToRoom(roomId)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr auto",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    minHeight: "36px",
                    padding: "7px 9px",
                    borderRadius: "7px",
                    background: current ? `${cfg.color}12` : "transparent",
                    border: `1px solid ${current ? `${cfg.color}34` : "transparent"}`,
                    cursor: current ? "default" : "pointer",
                    color: current ? cfg.color : "#D7E2EA",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: 0,
                    textAlign: "left",
                  }}
                  onMouseEnter={e => {
                    if (!current) e.currentTarget.style.background = "rgba(255,255,255,0.045)";
                  }}
                  onMouseLeave={e => {
                    if (!current) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ color: "#425766", fontSize: "10px" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{cfg.label}</span>
                  {current && <span style={{ fontSize: "9px", color: cfg.color }}>HERE</span>}
                </button>
              );
            })}

            <div style={{ height: "1px", background: "rgba(32,217,232,0.08)", margin: "10px 4px" }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "#4f6471", letterSpacing: 0, margin: "0 6px 7px" }}>
              PANELS
            </div>
            {PANEL_ITEMS.map((item, i) => (
              <button
                key={item.label}
                onClick={() => { openPanel(item.action as any); setShowQuick(false); }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  minHeight: "34px",
                  padding: "7px 9px",
                  borderRadius: "7px",
                  background: activePanel === item.action ? "rgba(32,217,232,0.1)" : "transparent",
                  border: `1px solid ${activePanel === item.action ? "rgba(32,217,232,0.24)" : "transparent"}`,
                  cursor: "pointer",
                  color: activePanel === item.action ? "#8fe6ea" : "#D7E2EA",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: 0,
                  textAlign: "left",
                }}
                onMouseEnter={e => {
                  if (activePanel !== item.action) e.currentTarget.style.background = "rgba(255,255,255,0.045)";
                }}
                onMouseLeave={e => {
                  if (activePanel !== item.action) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ color: "#425766", fontSize: "10px" }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              padding: "11px 14px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#8ea1ad",
              textDecoration: "none",
              borderTop: "1px solid rgba(32,217,232,0.08)",
              background: "rgba(255,255,255,0.025)",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#D7E2EA"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#8ea1ad"; }}
          >
            <span>github.com/ashis2489</span>
            <span>open</span>
          </a>
        </aside>
      )}
    </>
  );
}
