import { useEffect, Suspense, lazy, useState } from "react";
import { useStore } from "./store/useStore";

import { MobileControls }   from "./components/player/MobileControls";
import { ErrorBoundary }     from "./components/ui/ErrorBoundary";
import { KeyboardHelp }      from "./components/ui/KeyboardHelp";

const Experience = lazy(() => import("./Experience"));

import { EntryScreen }      from "./components/ui/EntryScreen";
import { ClassicPortfolio } from "./components/ui/ClassicPortfolio";
import { LoadingScreen }    from "./components/ui/LoadingScreen";
import { Navigation }       from "./components/ui/Navigation";
import { HeroHUD }          from "./components/ui/HeroHUD";
import { RoomTransition }   from "./components/ui/RoomTransition";
import { Minimap }          from "./components/ui/Minimap";
import { HintOverlay }      from "./components/ui/HintOverlay";
import { WelcomeMessage }   from "./components/ui/WelcomeMessage";

// Panels are heavy (framer-motion / terminal) and only render after entering 3D,
// so keep them out of the initial bundle.
const ProjectPanel      = lazy(() => import("./components/ui/ProjectPanel").then(m => ({ default: m.ProjectPanel })));
const AboutPanel        = lazy(() => import("./components/ui/AboutPanel").then(m => ({ default: m.AboutPanel })));
const SkillsPanel       = lazy(() => import("./components/ui/SkillsPanel").then(m => ({ default: m.SkillsPanel })));
const Terminal          = lazy(() => import("./components/ui/Terminal").then(m => ({ default: m.Terminal })));
const DeveloperPanel    = lazy(() => import("./components/ui/DeveloperPanel").then(m => ({ default: m.DeveloperPanel })));
const BookshelfPanel    = lazy(() => import("./components/ui/BookshelfPanel").then(m => ({ default: m.BookshelfPanel })));
const ContactPanel      = lazy(() => import("./components/ui/ContactPanel").then(m => ({ default: m.ContactPanel })));
const ResumePanel       = lazy(() => import("./components/ui/ResumePanel").then(m => ({ default: m.ResumePanel })));
const ArchitecturePanel = lazy(() => import("./components/ui/ArchitecturePanel").then(m => ({ default: m.ArchitecturePanel })));
const GithubPanel       = lazy(() => import("./components/ui/GithubPanel").then(m => ({ default: m.GithubPanel })));
const StatusPanel       = lazy(() => import("./components/ui/StatusPanel").then(m => ({ default: m.StatusPanel })));
const ArcadeOverlay     = lazy(() => import("./components/ui/ArcadeOverlay").then(m => ({ default: m.ArcadeOverlay })));


import { isMobile, isLowEnd } from "./utils/device";
import { useStore as useZStore } from "./store/useStore";

/** Subtle holographic way-home indicator shown outside the Cyber Core. */
function ReturnToCore() {
  const { currentRoom, activePanel, setCurrentRoom, setTransitioning, setTransitionLabel, isLoading, arcadeActive } = useZStore();
  if (currentRoom === "main-hq" || activePanel || isLoading || arcadeActive) return null;
  const go = () => {
    setTransitionLabel("CYBER CORE");
    setTransitioning(true);
    setTimeout(() => { setCurrentRoom("main-hq"); setTransitioning(false); }, 400);
  };
  return (
    <button onClick={go}
      className="btn-toolbar fixed bottom-4 left-1/2 -translate-x-1/2 z-24">
          RETURN TO CORE
    </button>
  );
}

type Mode = "entry" | "3d" | "classic";

function useResponsiveMobile() {
  const [mobile, setMobile] = useState(() => isMobile());

  useEffect(() => {
    const update = () => setMobile(isMobile());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return mobile;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("entry");
  const { isLoading, activePanel, arcadeActive, closePanel, setLoading, setLoadingProgress } = useStore();
  const mobile = useResponsiveMobile();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closePanel]);

  // Reset loading state when entering 3D mode.
  useEffect(() => {
    if (mode === "3d") {
      setLoadingProgress(0);
      setLoading(true);
    }
  }, [mode, setLoading, setLoadingProgress]);

  // Auto-redirect mobile/low-end users to classic mode for better experience
  useEffect(() => {
    if (mode === "3d" && (mobile || isLowEnd())) {
      setMode("classic");
    }
  }, [mode, mobile]);

  // Entry screen
  if (mode === "entry") {
    return (
      <EntryScreen
        onEnter3D={() => {
          // On mobile/low-end, send straight to classic
          if (mobile || isLowEnd()) { setMode("classic"); return; }
          setMode("3d");
        }}
        onEnterClassic={() => setMode("classic")}
      />
    );
  }

  // Classic portfolio
  if (mode === "classic") {
    return <ClassicPortfolio onEnter3D={() => setMode("3d")} />;
  }

  // 3D experience
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b]">
      {isLoading && <LoadingScreen />}

      {/* 3D Canvas — lazily loaded so three.js isn't in the initial bundle */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </ErrorBoundary>

      <RoomTransition />

      {/* Subtle CRT ambience — static scanlines + slow travelling beam.
          Kept extremely faint: depth, not noise. */}
      {!isLoading && (
        <div aria-hidden className="fixed inset-0 z-15 pointer-events-none">
          <div className="absolute inset-0 opacity-5" style={{
            background: "repeating-linear-gradient(0deg, rgba(45,226,230,0.25) 0px, rgba(45,226,230,0.25) 1px, transparent 1px, transparent 4px)",
          }} />
          <div className="crt-beam absolute left-0 right-0 h-[18vh]" style={{
            background: "linear-gradient(180deg, transparent, rgba(45,226,230,0.022), transparent)",
            animation: "scanline 9s linear infinite",
          }} />
        </div>
      )}

      {!isLoading && (
        <>
          <Navigation />
          {!activePanel && <HeroHUD />}
          <HintOverlay />
          <WelcomeMessage />
          <Minimap />
          <ReturnToCore />

          {/* Classic mode escape hatch */}
          <button
            onClick={() => setMode("classic")}
            className="btn-toolbar fixed bottom-4 right-4 z-22"
            title="Switch to classic portfolio view"
          >
            ≡ CLASSIC
          </button>

          <Suspense fallback={null}>
            {activePanel === "project"      && <ProjectPanel />}
            {activePanel === "about"        && <AboutPanel />}
            {activePanel === "skills"       && <SkillsPanel />}
            {activePanel === "terminal"     && <Terminal />}
            {activePanel === "developer"    && <DeveloperPanel />}
            {activePanel === "bookshelf"    && <BookshelfPanel />}
            {activePanel === "contact"      && <ContactPanel />}
            {activePanel === "resume"       && <ResumePanel />}
            {activePanel === "architecture" && <ArchitecturePanel />}
            {activePanel === "github"       && <GithubPanel />}
            {activePanel === "status"       && <StatusPanel />}

            {arcadeActive && <ArcadeOverlay />}
          </Suspense>
          {mobile && <MobileControls />}
          <KeyboardHelp />

        </>
      )}
    </div>
  );
}
