import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";
import { projects } from "../../data/projects";
import { skills, skillCategories } from "../../data/skills";

type Line = { type: "input" | "output" | "error" | "success" | "info"; text: string };

const COMMANDS: Record<string, (args: string[], open: (p: string, d?: unknown) => void) => Line[]> = {
  help: () => [
    { type: "info", text: "╔══════════════════════════════════════╗" },
    { type: "info", text: "║        VEDAA_OS  —  COMMANDS         ║" },
    { type: "info", text: "╚══════════════════════════════════════╝" },
    { type: "output", text: "  about        Who is Vedaa" },
    { type: "output", text: "  projects      List all projects" },
    { type: "output", text: "  open <id>     Open a project (e.g. open campus-delivery)" },
    { type: "output", text: "  skills        Tech stack overview" },
    { type: "output", text: "  experience    Timeline & background" },
    { type: "output", text: "  architecture  System architecture view" },
    { type: "output", text: "  github        GitHub profile" },
    { type: "output", text: "  contact       Contact information" },
    { type: "output", text: "  resume        View / download resume" },
    { type: "output", text: "  status        Currently building" },
    { type: "output", text: "  clear         Clear terminal" },
    { type: "output", text: "" },
    { type: "info", text: "  Tip: ↑↓ arrow keys for history" },
  ],

  about: (_, open) => {
    open("about");
    return [
      { type: "success", text: "Opening ABOUT panel..." },
      { type: "output", text: "" },
      { type: "output", text: "NAME    : Vedaa (Ashish Vibhor)" },
      { type: "output", text: "ROLE    : Full-Stack Developer" },
      { type: "output", text: "FIELD   : Computer Science & Engineering" },
      { type: "output", text: "STATUS  : B.Tech student, open to opportunities" },
      { type: "output", text: "" },
      { type: "output", text: "FOCUS   : Web Dev · DSA · Cloud · UI/UX" },
    ];
  },

  projects: () => [
    { type: "info", text: "── PROJECTS ─────────────────────────────" },
    ...projects.map(p => ({
      type: "output" as const,
      text: `  ${p.number}  ${p.title.padEnd(22)} [${p.status.toUpperCase()}]`,
    })),
    { type: "output", text: "" },
    { type: "info", text: "  Type: open <id> to inspect" },
    { type: "info", text: "  IDs: campus-delivery | disha-for-india | nirogitanman" },
  ],

  open: (args, open) => {
    const id = args[0];
    const project = projects.find(p => p.id === id);
    if (!project) {
      return [
        { type: "error", text: `Project '${id}' not found.` },
        { type: "info", text: "  Available: campus-delivery | disha-for-india | nirogitanman" },
      ];
    }
    open("project", project);
    return [
      { type: "success", text: `Opening ${project.title}...` },
      { type: "output", text: `  Tech: ${project.tech.join(" · ")}` },
      { type: "output", text: `  Status: ${project.status.toUpperCase()}` },
    ];
  },

  skills: (_, open) => {
    open("skills");
    return [
      { type: "success", text: "Opening SKILLS panel..." },
      { type: "output", text: "" },
      ...skillCategories.map(cat => {
        const catSkills = skills.filter(s => s.category === cat.key);
        return {
          type: "output" as const,
          text: `  ${cat.icon} ${cat.label.padEnd(10)} ${catSkills.map(s => s.name).join(", ")}`,
        };
      }),
    ];
  },

  experience: () => [
    { type: "info", text: "── TIMELINE ─────────────────────────────" },
    { type: "output", text: "  2022  Started B.Tech CSE" },
    { type: "output", text: "  2023  First full-stack project" },
    { type: "output", text: "  2024  Built Campus Delivery" },
    { type: "output", text: "  2025  Launched Disha & Nirogitanman" },
    { type: "output", text: "  NOW   Building & Learning" },
  ],

  architecture: (_, open) => {
    open("architecture");
    return [{ type: "success", text: "Opening System Architecture..." }];
  },

  github: (_, open) => {
    open("github");
    return [
      { type: "success", text: "Opening GitHub panel..." },
      { type: "output", text: `  Profile: ${siteConfig.github}` },
      { type: "info", text: "  Repositories: campus-delivery · disha-for-india · nirogitanman" },
    ];
  },

  contact: (_, open) => {
    open("contact");
    return [
      { type: "success", text: "Opening CONTACT panel..." },
      { type: "output", text: `  GitHub  : ${siteConfig.github}` },
      { type: "output", text: `  LinkedIn: ${siteConfig.linkedin}` },
      { type: "output", text: `  Email   : ${siteConfig.email.replace("mailto:", "")}` },
    ];
  },

  resume: (_, open) => {
    open("resume");
    return [{ type: "success", text: "Opening RESUME..." }];
  },

  status: (_, open) => {
    open("status");
    return [
      { type: "info", text: "── CURRENTLY BUILDING ───────────────────" },
      { type: "success", text: "  [ ACTIVE    ]  Cloud Architecture" },
      { type: "output", text: "  [ LEARNING  ]  Advanced System Design" },
      { type: "output", text: "  [ PRACTICING]  Data Structures & Algorithms" },
      { type: "output", text: "  [ EXPLORING ]  DevOps & Infrastructure" },
    ];
  },

  whoami: () => [
    { type: "output", text: "vedaa" },
  ],

  pwd: () => [
    { type: "output", text: "/home/vedaa/workspace" },
  ],

  ls: () => [
    { type: "output", text: "projects/  skills/  architecture/  resume.pdf  contact.json" },
  ],
};

const WELCOME: Line[] = [
  { type: "info", text: "╔══════════════════════════════════════════════╗" },
  { type: "info", text: "║   VEDAA_OS v2.0.4 — Digital Workspace         ║" },
  { type: "info", text: "╚══════════════════════════════════════════════╝" },
  { type: "output", text: "  Type 'help' for available commands." },
  { type: "output", text: "" },
];

const AUTOCOMPLETE_KEYS = Object.keys(COMMANDS).concat(
  projects.map(p => `open ${p.id}`)
);

export function Terminal() {
  const { closePanel, openPanel } = useStore();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Line[]>(WELCOME);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const open = useCallback((p: string, d?: unknown) => {
    openPanel(p as Parameters<typeof openPanel>[0], d as Parameters<typeof openPanel>[1]);
  }, [openPanel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;

    const parts = raw.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    const newHistory: Line[] = [
      ...history,
      { type: "input", text: `$ ${raw}` },
    ];

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      setCmdHistory(prev => [raw, ...prev]);
      setHistIdx(-1);
      return;
    }

    const handler = COMMANDS[cmd];
    if (handler) {
      const output = handler(args, open);
      output.forEach(l => newHistory.push(l));
    } else {
      newHistory.push({ type: "error", text: `Command not found: ${cmd}` });
      newHistory.push({ type: "info", text: "  Type 'help' for available commands." });
    }

    newHistory.push({ type: "output", text: "" });
    setHistory(newHistory);
    setCmdHistory(prev => [raw, ...prev]);
    setHistIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : cmdHistory[idx] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = AUTOCOMPLETE_KEYS.find(k => k.startsWith(input) && k !== input);
      if (match) setInput(match);
    }
  };

  const lineColor = (type: Line["type"]) => {
    switch (type) {
      case "input":   return "#2DE2E6";
      case "error":   return "#FF4D6D";
      case "success": return "#28C840";
      case "info":    return "#20D9E8";
      default:        return "#8FA2B5";
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto rounded-2xl overflow-hidden flex flex-col fade-in"
        style={{
          width: "min(660px, 96vw)",
          height: "min(520px, 84vh)",
          marginTop: "56px",
          background: "rgba(2, 6, 14, 0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(45,226,230,0.18)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(45,226,230,0.04)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 shrink-0"
          style={{
            background: "rgba(5, 14, 26, 0.9)",
            borderBottom: "1px solid rgba(45,226,230,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full cursor-pointer hover:opacity-75"
                style={{ background: c }}
                onClick={i === 0 ? closePanel : undefined}
              />
            ))}
          </div>
          <div style={{ fontSize: "11px", color: "#8FA2B5", letterSpacing: "0.12em" }}>
            VEDAA_OS — terminal
          </div>
          <div style={{ fontSize: "10px", color: "#3a5060" }}>v2.0.4</div>
        </div>

        {/* Output */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-3 pb-2"
          style={{ scrollbarWidth: "thin" }}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: "12px",
                lineHeight: "1.55",
                color: lineColor(line.type),
                whiteSpace: "pre",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center px-4 py-3 shrink-0"
          style={{ borderTop: "1px solid rgba(45,226,230,0.07)" }}
        >
          <span style={{ fontSize: "12px", color: "#2DE2E6", marginRight: "8px" }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: "12px",
              color: "#2DE2E6",
              fontFamily: "'JetBrains Mono', monospace",
              caretColor: "#2DE2E6",
            }}
            placeholder="type a command or 'help'..."
            autoComplete="off"
            spellCheck={false}
          />
          <span style={{ fontSize: "10px", color: "#3a5060" }}>TAB=autocomplete</span>
        </form>
      </div>
    </div>
  );
}
