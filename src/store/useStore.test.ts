import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "./useStore";

beforeEach(() => {
  useStore.setState({
    isLoading: true,
    loadingProgress: 0,
    loadingComplete: false,
    activePanel: null,
    activePanelData: null,
    currentRoom: "main-hq",
    transitioning: false,
    transitionLabel: "",
    cameraTarget: "entrance",
    isWalking: false,
    explorationMode: true,
    soundEnabled: false,
    showHints: true,
    hoveredObject: null,
    pointerLocked: false,
    showMinimap: false,
    arcadeActive: false,
    terminalHistory: [],
  });
});

describe("loading", () => {
  it("starts as loading", () => {
    expect(useStore.getState().isLoading).toBe(true);
  });

  it("setLoading toggles", () => {
    useStore.getState().setLoading(false);
    expect(useStore.getState().isLoading).toBe(false);
  });

  it("setLoadingProgress updates progress", () => {
    useStore.getState().setLoadingProgress(50);
    expect(useStore.getState().loadingProgress).toBe(50);
  });
});

describe("panels", () => {
  it("openPanel sets active panel", () => {
    useStore.getState().openPanel("about");
    expect(useStore.getState().activePanel).toBe("about");
  });

  it("openPanel with data", () => {
    const data = { id: "test", number: "01", title: "Test", description: "desc", longDescription: "long", tech: [], features: [], architecture: [], challenges: [], github: "", live: "", color: "#000", accentColor: "#000", status: "live" as const };
    useStore.getState().openPanel("project", data);
    expect(useStore.getState().activePanelData).toBe(data);
  });

  it("closePanel clears both", () => {
    useStore.getState().openPanel("about", null);
    useStore.getState().closePanel();
    expect(useStore.getState().activePanel).toBeNull();
    expect(useStore.getState().activePanelData).toBeNull();
  });
});

describe("rooms", () => {
  it("setCurrentRoom updates room", () => {
    useStore.getState().setCurrentRoom("project-lab");
    expect(useStore.getState().currentRoom).toBe("project-lab");
  });

  it("setTransitioning + setTransitionLabel", () => {
    useStore.getState().setTransitioning(true);
    useStore.getState().setTransitionLabel("PROJECTS");
    expect(useStore.getState().transitioning).toBe(true);
    expect(useStore.getState().transitionLabel).toBe("PROJECTS");
  });
});

describe("UI toggles", () => {
  it("toggleSound", () => {
    expect(useStore.getState().soundEnabled).toBe(false);
    useStore.getState().toggleSound();
    expect(useStore.getState().soundEnabled).toBe(true);
    useStore.getState().toggleSound();
    expect(useStore.getState().soundEnabled).toBe(false);
  });

  it("toggleMinimap", () => {
    useStore.getState().toggleMinimap();
    expect(useStore.getState().showMinimap).toBe(true);
    useStore.getState().toggleMinimap();
    expect(useStore.getState().showMinimap).toBe(false);
  });

  it("toggleExplorationMode", () => {
    useStore.getState().toggleExplorationMode();
    expect(useStore.getState().explorationMode).toBe(false);
  });
});

describe("terminal", () => {
  it("addTerminalLine appends", () => {
    useStore.getState().addTerminalLine("hello");
    expect(useStore.getState().terminalHistory).toContain("hello");
  });

  it("clearTerminal empties", () => {
    useStore.getState().addTerminalLine("line1");
    useStore.getState().clearTerminal();
    expect(useStore.getState().terminalHistory).toHaveLength(0);
  });
});
