import { useState } from "react";
import { useStore } from "../../store/useStore";
import { skills, skillCategories, levelColors, levelLabel, type SkillLevel } from "../../data/skills";

export function SkillsPanel() {
  const { closePanel } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("frontend");

  const filtered = skills.filter(s => s.category === activeCategory);
  const levelOrder: SkillLevel[] = ["advanced", "comfortable", "learning"];

  return (
    <div className="panel-overlay" style={{ justifyContent: "flex-end" }}>
      <div className="panel-card" style={{ marginRight: "12px" }}>
        {/* Header */}
        <div className="panel-header">
          <div className="panel-dots">
            <div className="panel-dot panel-dot--red" onClick={closePanel} />
            <div className="panel-dot panel-dot--yellow" />
            <div className="panel-dot panel-dot--green" />
          </div>
          <div className="panel-title">TECH STACK</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid rgba(32,217,232,0.05)", background: "rgba(255,255,255,0.01)" }}>
          {levelOrder.map(lvl => (
            <div key={lvl} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: levelColors[lvl] }} />
              <span className="text-[9px] text-[#5a6a78] font-mono">{levelLabel[lvl]}</span>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-1 px-3 py-2.5 shrink-0" style={{ borderBottom: "1px solid rgba(32,217,232,0.05)" }}>
          {skillCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-md text-[9px] font-mono transition-all"
              style={{
                color: activeCategory === cat.key ? "#7B61FF" : "#5a6a78",
                background: activeCategory === cat.key ? "rgba(123,97,255,0.1)" : "transparent",
                border: `1px solid ${activeCategory === cat.key ? "rgba(123,97,255,0.25)" : "transparent"}`,
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills */}
        <div className="panel-body space-y-2">
          {filtered.map(skill => (
            <div key={skill.name} className="panel-item">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: levelColors[skill.level], boxShadow: `0 0 4px ${levelColors[skill.level]}50` }} />
              <div className="flex-1 text-[12px] text-[#d7e2ea]">{skill.name}</div>
              <div className="w-16 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: skill.level === "advanced" ? "90%" : skill.level === "comfortable" ? "65%" : "35%",
                    background: `linear-gradient(90deg, ${skill.color}60, ${skill.color})`,
                  }}
                />
              </div>
              <span className="panel-badge" style={{ color: levelColors[skill.level], background: `${levelColors[skill.level]}10`, border: `1px solid ${levelColors[skill.level]}20` }}>
                {levelLabel[skill.level]}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 shrink-0" style={{ borderTop: "1px solid rgba(32,217,232,0.05)" }}>
          <p className="text-[10px] text-[#3a5060] font-mono">
            Currently exploring: <span className="text-[#7B61FF]">Cloud · System Design · DevOps</span>
          </p>
        </div>
      </div>
    </div>
  );
}
