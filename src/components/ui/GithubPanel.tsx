import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";
import { projects } from "../../data/projects";

const REPOS = [
  ...projects.map(p => ({
    name: p.id,
    description: p.description,
    tech: p.tech[0],
    color: p.color,
    url: p.github,
    status: p.status,
  })),
  {
    name: "portfolio-3d",
    description: "Interactive 3D developer portfolio — walkable futuristic HQ.",
    tech: "React Three Fiber",
    color: "#20D9E8",
    url: "https://github.com/ashis2489",
    status: "live" as const,
  },
];

export function GithubPanel() {
  const { closePanel } = useStore();

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end pointer-events-none">
      <div
        className="pointer-events-auto flex flex-col rounded-2xl overflow-hidden fade-in"
        style={{
          width: "min(420px, 95vw)",
          maxHeight: "calc(100vh - 72px)",
          marginTop: "64px",
          marginRight: "12px",
          background: "rgba(4,10,20,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(244,247,250,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(244,247,250,0.06)" }}
        >
          <div>
            <div style={{ color: "#F4F7FA", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.22em", marginBottom: "2px" }}>
              GITHUB // COMMAND CENTER
            </div>
            <div style={{ color: "#D7E2EA", fontSize: "15px", fontWeight: 600 }}>
              @ashis2489
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#2DE2E6",
                fontSize: "11px",
                fontFamily: "'JetBrains Mono', monospace",
                textDecoration: "none",
                padding: "5px 12px",
                border: "1px solid rgba(45,226,230,0.25)",
                borderRadius: "6px",
              }}
            >
              VIEW ↗
            </a>
            <button onClick={closePanel} style={{ color: "#718096", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Profile banner */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(7,17,31,0.9) 0%, rgba(20,30,50,0.9) 100%)",
              border: "1px solid rgba(244,247,250,0.07)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2DE2E6, #1a8a8c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#07111F",
                  fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                }}
              >
                V
              </div>
              <div>
                <div style={{ color: "#D7E2EA", fontSize: "14px", fontWeight: 600 }}>Vedaa (Ashish Vibhor)</div>
                <div style={{ color: "#718096", fontSize: "12px" }}>Full-Stack Developer · CSE Student</div>
              </div>
            </div>
            <p style={{ color: "#8FA2B5", fontSize: "12px", lineHeight: "1.6" }}>
              Building scalable web applications and exploring cloud infrastructure. Open to opportunities.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Repos",   value: `${REPOS.length}+`, color: "#2DE2E6" },
              { label: "Projects",value: "3",                color: "#20D9E8" },
              { label: "Status",  value: "Active",           color: "#28C840" },
            ].map(s => (
              <div
                key={s.label}
                className="p-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div style={{ color: s.color, fontSize: "18px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {s.value}
                </div>
                <div style={{ color: "#718096", fontSize: "10px", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Repositories */}
          <div>
            <div style={{ color: "#718096", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "10px" }}>
              REPOSITORIES
            </div>
            <div className="space-y-2">
              {REPOS.map(repo => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${repo.color}08`)}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                >
                  {/* Repo icon */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: `${repo.color}14`,
                      border: `1px solid ${repo.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span style={{ color: repo.color, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                        {repo.name}
                      </span>
                      <span
                        style={{
                          color: repo.status === "live" ? "#28C840" : "#7ee9f5",
                          fontSize: "9px",
                          fontFamily: "'JetBrains Mono', monospace",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          background: repo.status === "live" ? "rgba(40,200,64,0.1)" : "rgba(255,184,77,0.1)",
                          flexShrink: 0,
                        }}
                      >
                        {repo.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ color: "#718096", fontSize: "11px", marginTop: "2px" }}>
                      {repo.description}
                    </div>
                    <div style={{ color: "#3a5060", fontSize: "10px", marginTop: "3px", fontFamily: "'JetBrains Mono', monospace" }}>
                      ● {repo.tech}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8FA2B5",
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.12em",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#D7E2EA")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8FA2B5")}
          >
            OPEN FULL PROFILE ↗
          </a>
        </div>
      </div>
    </div>
  );
}
