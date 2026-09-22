import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingComponent(): JSX.Element {
  throw new Error("test error");
}

describe("ErrorBoundary", () => {
  it("renders children normally", () => {
    render(
      <ErrorBoundary>
        <div>child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("child content")).toBeTruthy();
  });

  it("renders fallback on error", () => {
    // Suppress expected console error from React
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("WebGL crashed")).toBeTruthy();
    expect(screen.getByText("RETRY")).toBeTruthy();
    spy.mockRestore();
  });
});
