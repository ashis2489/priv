import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";

const TIMELINE = [
  { year: "2022", label: "Started B.Tech Computer Science & Engineering", active: false },
  { year: "2023", label: "Built first full-stack project",                active: false },
  { year: "2024", label: "Developed Campus Delivery platform",             active: false },
  { year: "2025", label: "Launched Disha for India & Nirogitanman",        active: false },
  { year: "NOW",  label: "Building, learning, shipping every day",          active: true  },
];

const FOCUS = [
  { icon: "⚛",  label: "Full-Stack Development",          color: "#2DE2E6" },
  { icon: "🧮",  label: "Data Structures & Algorithms",    color: "#20D9E8" },
  { icon: "☁",  label: "Cloud Computing",                  color: "#2496ED" },
  { icon: "🎨",  label: "UI/UX Design",                    color: "#9B59B6" },
  { icon: "🏗",  label: "System Architecture",             color: "#28C840" },
];

const WHAT_IM_BUILDING = [
  "A scalable campus delivery and transport platform used by real students",
  "Mental health and wellness tools for Indian teenagers",
  "Premium e-commerce experiences with modern full-stack architecture",
];

const LOOKING_FOR = [
  "Full-stack or backend engineering roles",
  "Internships or collaborative open-source projects",
  "Opportunities to work on products that matter",
];

export function AboutPanel() {
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
          <div className="panel-title">ABOUT</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        <div className="panel-body space-y-4">
          {/* Bio */}
          <div className="p-3.5 rounded-lg" style={{ background: "rgba(32,217,232,0.03)", border: "1px solid rgba(32,217,232,0.08)" }}>
            <p className="text-[13px] text-[#d7e2ea] leading-relaxed">
              Computer Science &amp; Engineering student and Full-Stack Developer passionate
              about building meaningful digital products. I love clean code, thoughtful UX,
              system architecture, and solving hard problems with elegant solutions.
            </p>
          </div>

          {/* Focus areas */}
          <div>
            <div className="panel-section-title">Current Focus</div>
            <div className="space-y-1.5">
              {FOCUS.map(item => (
                <div key={item.label} className="panel-item">
                  <span className="text-sm w-5 text-center shrink-0">{item.icon}</span>
                  <span className="text-[12px] text-[#d7e2ea] flex-1">{item.label}</span>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="p-3.5 rounded-lg" style={{ background: "rgba(32,217,232,0.03)", border: "1px solid rgba(32,217,232,0.08)" }}>
            <div className="panel-section-title" style={{ color: "#20D9E8" }}>Education</div>
            <div className="text-[13px] text-[#d7e2ea] font-semibold">B.Tech — Computer Science &amp; Engineering</div>
            <div className="text-[11px] text-[#5a6a78] mt-1">Current Student</div>
          </div>

          {/* What I'm building */}
          <div>
            <div className="panel-section-title">What I'm Building</div>
            <div className="space-y-1.5">
              {WHAT_IM_BUILDING.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[10px] text-[#2DE2E6] shrink-0 mt-0.5">▹</span>
                  <span className="text-[12px] text-[#a6accd] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open to */}
          <div className="p-3.5 rounded-lg" style={{ background: "rgba(40,200,64,0.03)", border: "1px solid rgba(40,200,64,0.1)" }}>
            <div className="panel-section-title" style={{ color: "#28C840" }}>Open To</div>
            <div className="space-y-1.5">
              {LOOKING_FOR.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[9px] text-[#28C840] shrink-0 mt-1">●</span>
                  <span className="text-[12px] text-[#8aacba]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="panel-section-title">Timeline</div>
            <div className="relative pl-4">
              <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: "rgba(32,217,232,0.15)" }} />
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div
                    className="absolute -left-3 top-1 rounded-full"
                    style={{
                      width: item.active ? "8px" : "6px",
                      height: item.active ? "8px" : "6px",
                      background: item.active ? "#2DE2E6" : "#0e2030",
                      border: `1px solid ${item.active ? "#2DE2E6" : "rgba(32,217,232,0.3)"}`,
                      boxShadow: item.active ? "0 0 8px rgba(32,217,232,0.5)" : "none",
                    }}
                  />
                  <div className="flex items-baseline gap-3">
                    <span className={`text-[10px] font-mono w-8 shrink-0 ${item.active ? "text-[#2DE2E6]" : "text-[#3a5060]"}`}>
                      {item.year}
                    </span>
                    <span className={`text-[12px] ${item.active ? "text-[#d7e2ea]" : "text-[#718096]"}`}>
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-2 pt-1">
            <button onClick={() => openPanel("project")} className="panel-btn panel-btn-primary flex-1">
              View Projects →
            </button>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="panel-btn panel-btn-secondary flex-1">
              GitHub ↗
            </a>
            <button onClick={() => openPanel("contact")} className="panel-btn" style={{ background: "rgba(255,184,77,0.07)", border: "1px solid rgba(255,184,77,0.2)", color: "#FFB84D", flex: 1 }}>
              Contact →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
