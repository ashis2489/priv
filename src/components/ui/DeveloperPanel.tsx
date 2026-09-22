import { useStore } from "../../store/useStore";

const CODE = `const developer = {
  name:   "Vedaa",
  role:   "Full-Stack Developer",
  field:  "CS & Engineering",
  stack: {
    frontend: ["React","Next.js","TypeScript"],
    backend:  ["Node.js","Express.js"],
    database: ["MongoDB","Supabase"],
    cloud:    ["Vercel","Docker"],
  },
  focus: [
    "Web Development",
    "Data Structures & Algorithms",
    "Cloud Architecture",
    "System Design",
  ],
  status:  "Building digital products...",
  openTo:  "Opportunities & Collaborations",
};`;

const STATS = [
  { label: "Projects",     value: "3+",     color: "#2DE2E6" },
  { label: "Technologies", value: "20+",    color: "#7B61FF" },
  { label: "Commits",      value: "500+",   color: "#20D9E8" },
  { label: "Learning",     value: "Always", color: "#4ECDC4" },
];

const tokenize = (line: string) => {
  if (line.trimStart().startsWith("//")) return "#4a6a5a";
  if (/^\s*(const|let|var)\b/.test(line))  return "#c792ea";
  if (/^\s*(frontend|backend|database|cloud|focus|stack|status|openTo|name|role|field):/.test(line))
    return "#82aaff";
  if (/"[^"]*"/.test(line))  return "#c3e88d";
  if (/'[^']*'/.test(line))  return "#7ee9f5";
  if (/[{}[\]]/.test(line))  return "#89ddff";
  return "#a6accd";
};

const QUICK_LINKS = [
  { label: "GitHub Profile", action: "github" as const,  icon: "GH" },
  { label: "Projects Lab",   action: "project" as const, icon: "PJ" },
  { label: "Tech Stack",     action: "skills" as const,  icon: "TS" },
  { label: "Contact",        action: "contact" as const, icon: "CT" },
];

export function DeveloperPanel() {
  const { closePanel, openPanel } = useStore();

  return (
    <div className="panel-overlay">
      <div className="panel-card">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-dots">
            <div className="panel-dot panel-dot--red" onClick={closePanel} />
            <div className="panel-dot panel-dot--yellow" />
            <div className="panel-dot panel-dot--green" />
          </div>
          <div className="panel-title">DEVELOPER MODE</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        <div className="panel-body space-y-3">
          {/* Code block */}
          <div className="rounded-lg overflow-hidden" style={{ background: "rgba(2,4,10,0.9)", border: "1px solid rgba(32,217,232,0.05)" }}>
            <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="w-2 h-2 rounded-full bg-[#2DE2E6] opacity-60" />
              <span className="text-[10px] text-[#3a5060]">developer.ts</span>
            </div>
            <div className="p-3 overflow-x-auto">
              {CODE.split("\n").map((line, i) => (
                <div key={i} className="flex gap-3 leading-relaxed">
                  <span className="text-[10px] text-[#2a3a4a] w-5 text-right flex-shrink-0 select-none">{i + 1}</span>
                  <span className="text-[11px] whitespace-pre" style={{ color: tokenize(line) }}>{line || "\u00A0"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="panel-section-title">Stats</div>
            <div className="grid grid-cols-4 gap-2">
              {STATS.map(s => (
                <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: `${s.color}05`, border: `1px solid ${s.color}12` }}>
                  <div className="text-sm font-bold leading-none" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[8px] mt-1" style={{ color: `${s.color}80` }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <div className="panel-section-title">Quick Access</div>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_LINKS.map(link => (
                <button key={link.label} onClick={() => openPanel(link.action)} className="panel-item gap-2">
                  <span className="text-[8px] text-[#3a5060] w-5 text-center font-mono">{link.icon}</span>
                  <span className="text-[10px] text-[#718096] flex-1 text-left">{link.label}</span>
                  <span className="text-[9px] text-[#3a5060]">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
