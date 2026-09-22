import { useStore } from "../../store/useStore";

const STATUS_ITEMS = [
  { state: "ACTIVE",     label: "Cloud Architecture",          color: "#28C840", desc: "Learning cloud-native patterns and AWS fundamentals" },
  { state: "LEARNING",   label: "Advanced System Design",       color: "#2DE2E6", desc: "Distributed systems, caching strategies, scalability" },
  { state: "PRACTICING", label: "Data Structures & Algorithms", color: "#20D9E8", desc: "Daily DSA practice, competitive problem solving" },
  { state: "EXPLORING",  label: "DevOps & Infrastructure",      color: "#9B59B6", desc: "Docker, Nginx, CI/CD pipelines, deployment workflows" },
  { state: "BUILDING",   label: "Portfolio 3D",                 color: "#FF4D6D", desc: "This interactive developer workspace" },
];

export function StatusPanel() {
  const { closePanel } = useStore();

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
          <div className="panel-title">STATUS</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        <div className="panel-body space-y-2.5">
          {STATUS_ITEMS.map((item, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg"
              style={{ background: `${item.color}05`, border: `1px solid ${item.color}15` }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}`,
                    animation: item.state === "ACTIVE" ? "pulseRing 2s infinite" : "none",
                  }}
                />
                <span className="panel-badge" style={{ color: item.color, background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                  {item.state}
                </span>
                <span className="text-[12px] text-[#d7e2ea] font-medium">{item.label}</span>
              </div>
              <p className="text-[11px] text-[#5a6a78] leading-relaxed pl-6">{item.desc}</p>
            </div>
          ))}

          <div className="p-2.5 rounded-lg text-center mt-2" style={{ background: "rgba(32,217,232,0.03)", border: "1px solid rgba(32,217,232,0.08)" }}>
            <span className="text-[10px] text-[#28C840]">● </span>
            <span className="text-[10px] text-[#718096]">Available for opportunities & collaborations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
