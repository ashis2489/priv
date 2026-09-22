import { create } from "zustand";
import type { Project } from "../data/projects";

export type PanelType =
  | "project" | "about" | "skills" | "terminal" | "developer"
  | "bookshelf" | "contact" | "resume" | "architecture" | "github"
  | "status" | null;

export type RoomId =
  | "main-hq" | "project-lab" | "knowledge-lab"
  | "terminal-lab" | "cloud-center" | "contact-lounge";

export type CameraTarget = RoomId | "entrance" | "desk" | null;

interface StoreState {
  // Loading
  isLoading: boolean;
  loadingProgress: number;
  loadingComplete: boolean;
  setLoading: (v: boolean) => void;
  setLoadingProgress: (v: number) => void;
  setLoadingComplete: (v: boolean) => void;

  // Panel
  activePanel: PanelType;
  activePanelData: Project | null;
  openPanel: (type: PanelType, data?: Project | null) => void;
  closePanel: () => void;

  // Room system
  currentRoom: RoomId;
  setCurrentRoom: (r: RoomId) => void;
  transitioning: boolean;
  setTransitioning: (v: boolean) => void;
  transitionLabel: string;
  setTransitionLabel: (s: string) => void;

  // Camera
  cameraTarget: CameraTarget;
  setCameraTarget: (t: CameraTarget) => void;
  isWalking: boolean;
  setIsWalking: (v: boolean) => void;
  explorationMode: boolean;
  toggleExplorationMode: () => void;

  // UI
  soundEnabled: boolean;
  toggleSound: () => void;
  showHints: boolean;
  setShowHints: (v: boolean) => void;
  hoveredObject: string | null;
  setHoveredObject: (id: string | null) => void;
  pointerLocked: boolean;
  setPointerLocked: (v: boolean) => void;
  showMinimap: boolean;
  toggleMinimap: () => void;

  // Arcade
  arcadeActive: boolean;
  setArcadeActive: (v: boolean) => void;

  // Terminal
  terminalHistory: string[];
  addTerminalLine: (line: string) => void;
  clearTerminal: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isLoading: true,
  loadingProgress: 0,
  loadingComplete: false,
  setLoading: (v) => set({ isLoading: v }),
  setLoadingProgress: (v) => set({ loadingProgress: v }),
  setLoadingComplete: (v) => set({ loadingComplete: v }),

  activePanel: null,
  activePanelData: null,
  openPanel: (type, data = null) => set({ activePanel: type, activePanelData: data }),
  closePanel: () => set({ activePanel: null, activePanelData: null }),

  currentRoom: "main-hq",
  setCurrentRoom: (r) => set({ currentRoom: r }),
  transitioning: false,
  setTransitioning: (v) => set({ transitioning: v }),
  transitionLabel: "",
  setTransitionLabel: (s) => set({ transitionLabel: s }),

  cameraTarget: "entrance",
  setCameraTarget: (t) => set({ cameraTarget: t }),
  isWalking: false,
  setIsWalking: (v) => set({ isWalking: v }),
  explorationMode: true,
  toggleExplorationMode: () => set((s) => ({ explorationMode: !s.explorationMode })),

  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  showHints: true,
  setShowHints: (v) => set({ showHints: v }),
  hoveredObject: null,
  setHoveredObject: (id) => set({ hoveredObject: id }),
  pointerLocked: false,
  setPointerLocked: (v) => set({ pointerLocked: v }),
  showMinimap: false,
  toggleMinimap: () => set((s) => ({ showMinimap: !s.showMinimap })),

  arcadeActive: false,
  setArcadeActive: (v) => set({ arcadeActive: v }),

  terminalHistory: [
    "VEDAA_OS v2.0.4 — Digital Workspace Terminal",
    "Type 'help' for commands.",
    "",
  ],
  addTerminalLine: (line) =>
    set((s) => ({ terminalHistory: [...s.terminalHistory, line] })),
  clearTerminal: () => set({ terminalHistory: [] }),
}));
