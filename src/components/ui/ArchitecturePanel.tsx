import { useRef, useState } from "react";
import { useStore } from "../../store/useStore";

interface Node {
  id: string;
  label: string;
  sublabel: string;
  tech: string;
  role: string;
  color: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  label?: string;
}

const NODES: Node[] = [
  { id: "client",   label: "CLIENT",    sublabel: "Browser / Mobile",  tech: "React · Next.js · TypeScript", role: "Renders UI, manages client state, handles user interactions", color: "#61DAFB", x: 200, y: 40  },
  { id: "api",      label: "API",       sublabel: "REST Endpoints",    tech: "Node.js · Express.js",         role: "Business logic, authentication, request routing, middleware", color: "#68A063", x: 200, y: 145 },
  { id: "db",       label: "DATABASE",  sublabel: "Persistence Layer", tech: "MongoDB · Supabase",           role: "Stores users, data models, orders, content", color: "#4EA94B", x: 80,  y: 255 },
  { id: "auth",     label: "AUTH",      sublabel: "Identity",          tech: "Supabase Auth · JWT",          role: "Handles login, sessions, role-based access control", color: "#20D9E8", x: 320, y: 255 },
  { id: "storage",  label: "STORAGE",   sublabel: "Assets",            tech: "Supabase Storage · CDN",       role: "Images, documents, user uploads, media files", color: "#9B59B6", x: 80,  y: 355 },
  { id: "deploy",   label: "DEPLOY",    sublabel: "Infrastructure",    tech: "Vercel · Docker · GitHub Actions", role: "CI/CD pipeline, edge deployment, containerisation", color: "#2DE2E6", x: 200, y: 355 },
  { id: "notif",    label: "NOTIFY",    sublabel: "Realtime",          tech: "WebSockets · SSE",             role: "Live order updates, notifications, event streaming", color: "#FF4D6D", x: 320, y: 355 },
];

const EDGES: Edge[] = [
  { from: "client",  to: "api",     label: "HTTPS" },
  { from: "api",     to: "db",      label: "Query" },
  { from: "api",     to: "auth",    label: "Verify" },
  { from: "api",     to: "notif",   label: "Emit" },
  { from: "db",      to: "storage", label: "Ref" },
  { from: "api",     to: "deploy",  label: "Deploy" },
  { from: "client",  to: "auth",    label: "Token" },
];

const W = 400;
const H = 420;

export function ArchitecturePanel() {
  const { closePanel } = useStore();
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNode = (id: string) => NODES.find(n => n.id === id)!;
  const activeNode = hovered ? getNode(hovered) : null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto rounded-2xl overflow-hidden flex flex-col fade-in"
        style={{
          width: "min(820px, 97vw)",
          maxHeight: "calc(100vh - 72px)",
          marginTop: "60px",
          background: "rgba(4,10,20,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(45,226,230,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(45,226,230,0.07)" }}
        >
          <div>
            <div style={{ color: "#2DE2E6", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.22em", marginBottom: "2px" }}>
              SYSTEM ARCHITECTURE
            </div>
            <div style={{ color: "#D7E2EA", fontSize: "15px", fontWeight: 600 }}>
              Full-Stack Stack Diagram
            </div>
          </div>
          <button onClick={closePanel} style={{ color: "#718096", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        <div className="flex flex-col md:flex-row overflow-hidden flex-1">
          {/* SVG diagram */}
          <div
            className="flex-1 flex items-center justify-center p-4"
            style={{ minHeight: "360px" }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: "100%", maxWidth: "420px", height: "auto" }}
            >
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="rgba(45,226,230,0.5)" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Edges */}
              {EDGES.map((edge, i) => {
                const a = getNode(edge.from);
                const b = getNode(edge.to);
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const active = hovered === edge.from || hovered === edge.to;
                return (
                  <g key={i}>
                    <line
                      x1={a.x} y1={a.y + 22} x2={b.x} y2={b.y}
                      stroke={active ? "rgba(45,226,230,0.7)" : "rgba(45,226,230,0.18)"}
                      strokeWidth={active ? 1.5 : 1}
                      strokeDasharray={active ? "none" : "4 3"}
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <text
                        x={mx} y={my - 4}
                        fill="rgba(45,226,230,0.45)"
                        fontSize="7"
                        textAnchor="middle"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map(node => {
                const isHovered = hovered === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    filter={isHovered ? "url(#glow)" : "none"}
                  >
                    <rect
                      x={-55} y={-20}
                      width={110} height={42}
                      rx={6}
                      fill={isHovered ? `${node.color}20` : "rgba(7,17,31,0.9)"}
                      stroke={isHovered ? node.color : `${node.color}50`}
                      strokeWidth={isHovered ? 1.5 : 1}
                    />
                    <text
                      y={-4}
                      fill={node.color}
                      fontSize="9"
                      textAnchor="middle"
                      fontWeight="700"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {node.label}
                    </text>
                    <text
                      y={9}
                      fill="rgba(141,162,181,0.8)"
                      fontSize="7"
                      textAnchor="middle"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {node.tech.split("·")[0].trim()}
                    </text>
                    {/* Animated dot */}
                    {isHovered && (
                      <circle cx={48} cy={-12} r={3} fill={node.color} opacity={0.9} />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Info panel */}
          <div
            className="shrink-0 p-5 overflow-y-auto"
            style={{
              width: "min(280px, 100%)",
              borderTop: "1px solid rgba(45,226,230,0.07)",
              borderLeft: "none",
            }}
          >
            {activeNode ? (
              <div className="fade-in space-y-4">
                <div>
                  <div style={{ color: activeNode.color, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.18em", marginBottom: "4px" }}>
                    {activeNode.label}
                  </div>
                  <div style={{ color: "#D7E2EA", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                    {activeNode.sublabel}
                  </div>
                  <div style={{ color: "#718096", fontSize: "12px", lineHeight: "1.6" }}>
                    {activeNode.role}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#718096", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
                    TECHNOLOGIES
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.tech.split("·").map(t => t.trim()).filter(Boolean).map(t => (
                      <span
                        key={t}
                        style={{
                          color: activeNode.color,
                          background: `${activeNode.color}10`,
                          border: `1px solid ${activeNode.color}25`,
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connections */}
                <div>
                  <div style={{ color: "#718096", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "8px" }}>
                    CONNECTS TO
                  </div>
                  {EDGES.filter(e => e.from === activeNode.id || e.to === activeNode.id).map((e, i) => {
                    const other = e.from === activeNode.id ? getNode(e.to) : getNode(e.from);
                    const dir = e.from === activeNode.id ? "→" : "←";
                    return (
                      <div key={i} style={{ color: "#8FA2B5", fontSize: "11px", marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
                        {dir} <span style={{ color: other.color }}>{other.label}</span>
                        {e.label && <span style={{ color: "#3a5060" }}> ({e.label})</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ color: "#3a5060", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", lineHeight: "1.8" }}>
                <div style={{ color: "#718096", marginBottom: "10px" }}>Hover a node to inspect it.</div>
                <div>— CLIENT</div>
                <div>— API</div>
                <div>— DATABASE</div>
                <div>— AUTH</div>
                <div>— STORAGE</div>
                <div>— DEPLOY</div>
                <div>— NOTIFY</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
