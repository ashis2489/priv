import { useState } from "react";
import { useStore } from "../../store/useStore";
import { projects, type Project } from "../../data/projects";

type Tab = "overview" | "features" | "architecture" | "tech";

const TAB_LABELS: Tab[] = ["overview", "features", "architecture", "tech"];

// ─── Project card in list ─────────────────────────────────────────────────────
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left p-4 rounded-xl transition-all"
      style={{
        background: hovered ? `${project.color}08` : "rgba(7,17,31,0.5)",
        border: `1px solid ${hovered ? project.color + "40" : "rgba(45,226,230,0.07)"}`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          style={{
            color: project.color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            fontWeight: 700,
            marginTop: "2px",
            flexShrink: 0,
          }}
        >
          {project.number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span style={{ color: "#D7E2EA", fontSize: "14px", fontWeight: 600 }}>
              {project.title}
            </span>
            <span
              style={{
                color: project.status === "live" ? "#28C840" : "#7ee9f5",
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                padding: "2px 8px",
                borderRadius: "4px",
                background: project.status === "live" ? "rgba(40,200,64,0.1)" : "rgba(255,184,77,0.1)",
                border: `1px solid ${project.status === "live" ? "rgba(40,200,64,0.25)" : "rgba(255,184,77,0.25)"}`,
                flexShrink: 0,
              }}
            >
              {project.status.toUpperCase()}
            </span>
          </div>
          <p style={{ color: "#718096", fontSize: "12px", lineHeight: "1.5" }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {project.tech.slice(0, 3).map(t => (
              <span
                key={t}
                style={{
                  color: project.color,
                  background: `${project.color}12`,
                  border: `1px solid ${project.color}25`,
                  fontSize: "10px",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Project detail tabs ──────────────────────────────────────────────────────
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="fade-in">
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          color: "#718096",
          fontSize: "11px",
          fontFamily: "'JetBrains Mono', monospace",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ← PROJECTS
      </button>

      {/* Header */}
      <div className="mb-4">
        <div style={{ color: project.color, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.2em", marginBottom: "4px" }}>
          PROJECT {project.number}
        </div>
        <h2 style={{ color: "#D7E2EA", fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
          {project.title}
        </h2>
        <p style={{ color: "#718096", fontSize: "13px", lineHeight: "1.6" }}>
          {project.longDescription}
        </p>
      </div>

      {/* Mock browser frame — project preview */}
      <div
        className="mb-4 rounded-xl overflow-hidden"
        style={{ border: `1px solid ${project.color}25` }}
      >
        <div
          style={{
            background: "#07111F",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderBottom: `1px solid ${project.color}15`,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              borderRadius: "4px",
              padding: "2px 10px",
              fontSize: "10px",
              color: "#718096",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {project.live}
          </div>
        </div>
        <div
          style={{
            height: "110px",
            background: `linear-gradient(135deg, #07111F 0%, ${project.color}12 60%, ${project.color}22 100%)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <div style={{ color: project.color, fontSize: "20px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
            {project.title}
          </div>
          <div style={{ width: "60px", height: "2px", background: project.color, opacity: 0.5 }} />
          <div style={{ color: "#718096", fontSize: "11px" }}>Full-Stack Application</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {TAB_LABELS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: tab === t ? project.color : "#718096",
              background: tab === t ? `${project.color}10` : "transparent",
              border: `1px solid ${tab === t ? project.color + "30" : "transparent"}`,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="fade-in" style={{ minHeight: "140px" }}>
        {tab === "overview" && (
          <div className="space-y-3">
            <div>
              <div style={{ color: "#718096", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>TECH STACK</div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} style={{ color: project.color, background: `${project.color}10`, border: `1px solid ${project.color}28`, fontSize: "11px", padding: "3px 10px", borderRadius: "5px", fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: "#718096", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>STATUS</div>
              <span style={{ color: project.status === "live" ? "#28C840" : "#7ee9f5", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                ● {project.status === "live" ? "Live & deployed" : project.status === "complete" ? "Complete" : "In Progress"}
              </span>
            </div>
          </div>
        )}

        {tab === "features" && (
          <ul className="space-y-2">
            {project.features.map(f => (
              <li key={f} className="flex items-start gap-2" style={{ fontSize: "13px", color: "#D7E2EA" }}>
                <span style={{ color: project.color, flexShrink: 0, marginTop: "1px" }}>▹</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {tab === "architecture" && (
          <div className="space-y-2">
            {project.architecture.map((layer, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div style={{ width: "80px", flexShrink: 0 }}>
                  <div style={{ color: project.color, fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>{layer.layer}</div>
                </div>
                <div>
                  <div style={{ color: "#D7E2EA", fontSize: "12px", fontWeight: 500 }}>{layer.tech}</div>
                  <div style={{ color: "#718096", fontSize: "11px" }}>{layer.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "tech" && (
          <div className="space-y-3">
            <div style={{ color: "#718096", fontSize: "12px", lineHeight: "1.6" }}>
              {project.challenges.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span style={{ color: "#20D9E8", flexShrink: 0 }}>⚡</span>
                  <span style={{ color: "#D7E2EA" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "#D7E2EA",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            textDecoration: "none",
            letterSpacing: "0.1em",
            transition: "all 0.2s",
          }}
        >
          GitHub →
        </a>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            color: project.color,
            background: `${project.color}0e`,
            border: `1px solid ${project.color}35`,
            textDecoration: "none",
            letterSpacing: "0.1em",
            transition: "all 0.2s",
          }}
        >
          Live Demo →
        </a>
      </div>
    </div>
  );
}

// ─── Panel root ───────────────────────────────────────────────────────────────
export function ProjectPanel() {
  const { closePanel, activePanelData } = useStore();
  const [selected, setSelected] = useState<Project | null>(activePanelData);

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end pointer-events-none">
      <div
        className="pointer-events-auto flex flex-col rounded-2xl overflow-hidden"
        style={{
          width: "min(440px, 95vw)",
          maxHeight: "calc(100vh - 72px)",
          marginTop: "64px",
          marginRight: "12px",
          background: "rgba(4, 12, 22, 0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(45,226,230,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 1px rgba(45,226,230,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(45,226,230,0.07)" }}
        >
          <div>
            <div style={{ color: "#2DE2E6", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.22em", marginBottom: "2px" }}>
              CYBER CORE // PROJECTS
            </div>
            <div style={{ color: "#D7E2EA", fontSize: "15px", fontWeight: 600 }}>
              {selected ? selected.title : "Projects"}
            </div>
          </div>
          <button
            onClick={closePanel}
            style={{ color: "#718096", background: "none", border: "none", cursor: "pointer", fontSize: "18px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5">
          {selected ? (
            <ProjectDetail project={selected} onBack={() => setSelected(null)} />
          ) : (
            <div className="space-y-3 fade-in">
              <p style={{ color: "#718096", fontSize: "12px", marginBottom: "16px" }}>
                Select a project to inspect its architecture and details.
              </p>
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
