import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuideBot } from "./GuideBot";

beforeEach(() => {
  localStorage.clear();
});

describe("GuideBot", () => {
  it("greets first-time visitors and opens", () => {
    render(<GuideBot onNavigate={() => {}} />);
    expect(screen.getByText("🤖 GUIDE BOT")).toBeTruthy();
    expect(screen.getByText(/New here/)).toBeTruthy();
  });

  it("stays closed for returning visitors, shows reopen button", () => {
    localStorage.setItem("guide_seen", "1");
    render(<GuideBot onNavigate={() => {}} />);
    expect(screen.queryByText(/New here/)).toBeNull();
    expect(screen.getByLabelText("Open guide bot")).toBeTruthy();
  });

  it("answers a chip question and navigates", async () => {
    const go = vi.fn();
    render(<GuideBot onNavigate={go} />);
    fireEvent.click(screen.getByText("Show me the projects"));
    expect(go).toHaveBeenCalledWith("projects");
    expect(await screen.findByText(/four featured builds/i)).toBeTruthy();
  });

  it("understands reworded free-text questions", async () => {
    const go = vi.fn();
    render(<GuideBot onNavigate={go} />);
    const input = screen.getByLabelText("Ask the guide bot");
    fireEvent.change(input, { target: { value: "i would like to see his projects" } });
    fireEvent.submit(input.closest("form")!);
    expect(go).toHaveBeenCalledWith("projects");
    expect(await screen.findByText(/four featured builds/i)).toBeTruthy();
  });

  it("falls back for unknown questions", async () => {
    render(<GuideBot onNavigate={() => {}} />);
    const input = screen.getByLabelText("Ask the guide bot");
    fireEvent.change(input, { target: { value: "zzz unknown" } });
    fireEvent.submit(input.closest("form")!);
    expect(await screen.findByText(/only know the basics/i)).toBeTruthy();
  });

  it("expands the previous topic on 'tell me more'", async () => {
    render(<GuideBot onNavigate={() => {}} />);
    fireEvent.click(screen.getByText("Who is Ashish?"));
    await screen.findByText(/aspiring Product Engineer/i);
    const input = screen.getByLabelText("Ask the guide bot");
    fireEvent.change(input, { target: { value: "tell me more" } });
    fireEvent.submit(input.closest("form")!);
    expect(await screen.findByText(/CV summary/i)).toBeTruthy();
  });
});
