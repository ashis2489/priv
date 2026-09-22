import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HintOverlay } from "./HintOverlay";
import { useStore } from "../../store/useStore";

beforeEach(() => {
  useStore.setState({
    pointerLocked: false,
    activePanel: null,
    isLoading: false,
  });
});

describe("HintOverlay", () => {
  it("shows click prompt when pointer not locked", () => {
    render(<HintOverlay />);
    expect(screen.getByText(/Click anywhere/)).toBeTruthy();
  });

  it("hides when panel is active", () => {
    useStore.setState({ activePanel: "about" });
    const { container } = render(<HintOverlay />);
    expect(container.innerHTML).toBe("");
  });

  it("hides when loading", () => {
    useStore.setState({ isLoading: true });
    const { container } = render(<HintOverlay />);
    expect(container.innerHTML).toBe("");
  });
});
