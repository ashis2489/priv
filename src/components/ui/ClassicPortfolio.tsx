import React, { useState } from "react";
import { siteConfig } from "../../config/site";
import { projects } from "../../data/projects";
import { skills, skillCategories } from "../../data/skills";

const S = {
  page: {
    position: "fixed" as const, inset: 0, zIndex: 100,
    background: "#09090b", color: "#D7E2EA",
    fontFamily: "Inter, sans-serif",
    overflowY: "auto" as const,
  },
  nav: {
    position: "sticky" as const, top: 0, zIndex: 10,
    background: "rgba(9,9,11,0.96)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(32,217,232,0.12)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: "56px",
  },
  logo: { fontFamily: "'JetBrains Mono',monospace", color: "#20D9E8", fontSize: "14px", fontWeight: 700, letterSpacing: "0.15em" },
  navLinks: { display: "flex", gap: "4px" },
  navBtn: (active: boolean) => ({
    fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.1em",
    padding: "6px 14px", borderRadius: "6px", border: "none", cursor: "pointer",
    color: active ? "#20D9E8" : "#8a7a60",
    background: active ? "rgba(32,217,232,0.08)" : "transparent",
    transition: "all 0.15s",
  }),
  section: { maxWidth: "900px", margin: "0 auto", padding: "64px 24px" },
  sectionTag: {
    fontFamily: "'JetBrains Mono',monospace", fontSize: "10px",
    color: "#20D9E8", letterSpacing: "0.3em", marginBottom: "8px",
  },
  h2: { fontSize: "32px", fontWeight: 700, color: "#f0e8d8", marginBottom: "16px", lineHeight: 1.2 },
  divider: { width: "48px", height: "2px", background: "#20D9E8", borderRadius: "1px", marginBottom: "32px" },
  card: {
    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(32,217,232,0.1)",
    borderRadius: "12px", padding: "24px",
  },
  chip: (color: string) => ({
    fontFamily: "'JetBrains Mono',monospace", fontSize: "11px",
    padding: "3px 10px", borderRadius: "5px",
    color, background: `${color}12`, border: `1px solid ${color}25`,
  }),
  btn: (primary: boolean): React.CSSProperties => ({
    display: "inline-block", padding: "10px 20px", borderRadius: "8px",
    fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.1em",
    textDecoration: "none", cursor: "pointer",
    color: primary ? "#20D9E8" : "#8a7a60",
    background: primary ? "rgba(32,217,232,0.1)" : "rgba(255,255,255,0.04)",
    border: primary ? "1px solid rgba(32,217,232,0.3)" : "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.2s",
  }),
};

const SECTIONS = ["about", "projects", "skills", "contact"] as const;
type Section = typeof SECTIONS[number];

export function ClassicPortfolio({ onEnter3D }: { onEnter3D: () => void }) {
  const [active, setActive] = useState<Section>("about");

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.logo}>VEDAA <span style={{ color: "#3a3020", fontSize: "11px" }}>// PORTFOLIO</span></div>
        <div style={S.navLinks}>
          {SECTIONS.map(s => (
            <button key={s} style={S.navBtn(active === s)} onClick={() => setActive(s)}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={onEnter3D}
          style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: "0.12em",
            padding: "6px 14px", borderRadius: "7px", cursor: "pointer",
            color: "#20D9E8", background: "rgba(32,217,232,0.08)",
            border: "1px solid rgba(32,217,232,0.25)",
          }}
        >
          ENTER 3D →
        </button>
      </nav>

      {/* About */}
      {active === "about" && (
        <div style={S.section}>
          <div style={S.sectionTag}>01 // ABOUT</div>
          <h2 style={S.h2}>Hi, I'm Vedaa.</h2>
          <div style={S.divider} />
          <p style={{ color: "#9a8870", fontSize: "16px", lineHeight: "1.8", maxWidth: "600px", marginBottom: "32px" }}>
            Computer Science & Engineering student and Full-Stack Developer passionate about building
            meaningful digital products. I love clean code, thoughtful UX, and solving hard problems
            with elegant solutions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Role",     value: "Full-Stack Developer",       color: "#20D9E8" },
              { label: "Field",    value: "CS & Engineering",           color: "#20D9E8" },
              { label: "Status",   value: "Open to Opportunities",      color: "#4caf6a" },
              { label: "Focus",    value: "Web · DSA · Cloud · UI/UX",  color: "#9b80f8" },
            ].map(item => (
              <div key={item.label} style={{ ...S.card, borderColor: `${item.color}20` }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: item.color, letterSpacing: "0.2em", marginBottom: "6px" }}>{item.label.toUpperCase()}</div>
                <div style={{ color: "#D7E2EA", fontSize: "13px", fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
              style={{ ...S.btn(true), border: "1px solid rgba(32,217,232,0.3)", textDecoration: "none" }}>
              GitHub →
            </a>
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer"
              style={{ ...S.btn(false), border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
              LinkedIn →
            </a>
          </div>
        </div>
      )}

      {/* Projects */}
      {active === "projects" && (
        <div style={S.section}>
          <div style={S.sectionTag}>02 // PROJECTS</div>
          <h2 style={S.h2}>Featured Work</h2>
          <div style={S.divider} />
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {projects.map(p => (
              <div key={p.id} style={{ ...S.card, borderColor: `${p.color}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: p.color, letterSpacing: "0.2em", marginBottom: "4px" }}>
                      PROJECT {p.number}
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f0e8d8", margin: 0 }}>{p.title}</h3>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: "9px",
                    padding: "3px 10px", borderRadius: "4px", whiteSpace: "nowrap",
                    color: p.status === "live" ? "#4caf6a" : "#20D9E8",
                    background: p.status === "live" ? "rgba(76,175,106,0.1)" : "rgba(32,217,232,0.1)",
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: "#7a6a50", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                  {p.longDescription}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {p.tech.map(t => <span key={t} style={S.chip(p.color)}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    style={{ ...S.btn(false), border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none", fontSize: "11px" }}>
                    GitHub →
                  </a>
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    style={{ ...S.btn(true), border: `1px solid ${p.color}30`, color: p.color, background: `${p.color}0a`, textDecoration: "none", fontSize: "11px" }}>
                    Live Demo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {active === "skills" && (
        <div style={S.section}>
          <div style={S.sectionTag}>03 // SKILLS</div>
          <h2 style={S.h2}>Tech Stack</h2>
          <div style={S.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "20px" }}>
            {skillCategories.map(cat => (
              <div key={cat.key} style={S.card}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#20D9E8", letterSpacing: "0.2em", marginBottom: "14px" }}>
                  {cat.icon} {cat.label.toUpperCase()}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {skills.filter(s => s.category === cat.key).map(skill => (
                    <div key={skill.name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: skill.color, flexShrink: 0 }} />
                      <span style={{ color: "#D7E2EA", fontSize: "13px", flex: 1 }}>{skill.name}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono',monospace", fontSize: "9px",
                        padding: "2px 7px", borderRadius: "4px",
                        color: skill.level === "advanced" ? "#4caf6a" : skill.level === "comfortable" ? "#20D9E8" : "#20D9E8",
                        background: skill.level === "advanced" ? "rgba(76,175,106,0.1)" : skill.level === "comfortable" ? "rgba(32,217,232,0.1)" : "rgba(32,217,232,0.1)",
                      }}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {active === "contact" && (
        <div style={S.section}>
          <div style={S.sectionTag}>04 // CONTACT</div>
          <h2 style={S.h2}>Let's Build Something</h2>
          <div style={S.divider} />
          <p style={{ color: "#7a6a50", fontSize: "15px", lineHeight: "1.8", maxWidth: "500px", marginBottom: "40px" }}>
            Open to full-time roles, internships, freelance projects, and interesting collaborations.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "16px" }}>
            {[
              { label: "GitHub",   url: siteConfig.github,           color: "#D7E2EA", icon: "GH" },
              { label: "LinkedIn", url: siteConfig.linkedin,         color: "#0A66C2", icon: "LI" },
              { label: "Email",    url: siteConfig.email,            color: "#20D9E8", icon: "✉"  },
              { label: "Resume",   url: siteConfig.resume,           color: "#20D9E8", icon: "CV" },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{
                  ...S.card, display: "flex", alignItems: "center", gap: "12px",
                  textDecoration: "none", borderColor: `${link.color}18`, transition: "all 0.2s",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `${link.color}40`)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = `${link.color}18`)}
              >
                <div style={{
                  width: "38px", height: "38px", borderRadius: "8px", flexShrink: 0,
                  background: `${link.color}12`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px", fontWeight: 700, color: link.color,
                }}>{link.icon}</div>
                <div>
                  <div style={{ color: "#D7E2EA", fontSize: "13px", fontWeight: 500 }}>{link.label}</div>
                  <div style={{ color: link.color, fontSize: "10px" }}>→ Open</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CTA back to 3D */}
      <div style={{ textAlign: "center", padding: "48px 24px 80px", borderTop: "1px solid rgba(32,217,232,0.08)" }}>
        <p style={{ color: "#5a4a30", fontSize: "13px", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "16px" }}>
          Want the full experience?
        </p>
        <button onClick={onEnter3D} style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: "0.18em",
          padding: "12px 28px", borderRadius: "8px", cursor: "pointer",
          color: "#20D9E8", background: "rgba(32,217,232,0.07)", border: "1px solid rgba(32,217,232,0.25)",
          transition: "all 0.2s",
        }}>
          ENTER 3D WORKSPACE →
        </button>
      </div>
    </div>
  );
}
