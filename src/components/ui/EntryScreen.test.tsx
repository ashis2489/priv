import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EntryScreen } from "./EntryScreen";

describe("EntryScreen", () => {
  it("renders the name VEDAA", () => {
    render(<EntryScreen onEnter3D={() => {}} onEnterClassic={() => {}} />);
    expect(screen.getByText("VEDAA")).toBeTruthy();
  });

  it("renders role", () => {
    render(<EntryScreen onEnter3D={() => {}} onEnterClassic={() => {}} />);
    expect(screen.getByText("FULL-STACK DEVELOPER")).toBeTruthy();
  });

  it("renders 3D entry button", () => {
    render(<EntryScreen onEnter3D={() => {}} onEnterClassic={() => {}} />);
    expect(screen.getByLabelText("Enter 3D portfolio experience")).toBeTruthy();
  });

  it("renders classic entry button", () => {
    render(<EntryScreen onEnter3D={() => {}} onEnterClassic={() => {}} />);
    expect(screen.getByLabelText("Enter classic 2D portfolio")).toBeTruthy();
  });

  it("renders availability badge", () => {
    render(<EntryScreen onEnter3D={() => {}} onEnterClassic={() => {}} />);
    expect(screen.getByText("AVAILABLE FOR OPPORTUNITIES")).toBeTruthy();
  });
});
