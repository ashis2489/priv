import React, { useState } from "react";
import { siteConfig } from "../../config/site";
import { projects } from "../../data/projects";
import { skills, skillCategories, levelColors, levelLabel } from "../../data/skills";
import { summary, education, coursework, experience, languages } from "../../data/cv";
import { GuideBot } from "./GuideBot";

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
    color: primary ? "#20D9E8" : "#7d93a6",
    background: primary ? "rgba(32,217,232,0.1)" : "rgba(255,255,255,0.04)",
    border: primary ? "1px solid rgba(32,217,232,0.3)" : "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.2s",
  }),
};

const SECTIONS = ["about", "experience", "projects", "skills", "contact"] as const;
type Section = typeof SECTIONS[number];

export function ClassicPortfolio({ onEnter3D }: { onEnter3D: () => void }) {
  const [active, setActive] = useState<Section>("about");

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.logo}>VEDAA <span style={{ color: "#7d93a6", fontSize: "11px" }}>// PORTFOLIO</span></div>
        <div style={S.navLinks}>
          {SECTIONS.map(s => (
            <button key={s} className={`nav-item${active === s ? " active" : ""}`} onClick={() => setActive(s)}>
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
        <div style={S.section} className="fade-in">
          <div style={S.sectionTag}>01 // ABOUT</div>
          <h2 style={S.h2}>Hi, I'm Ashish Vibhor.</h2>
          <div style={S.divider} />
          <p style={{ color: "#8FA2B5", fontSize: "16px", lineHeight: "1.8", maxWidth: "620px", marginBottom: "12px" }}>
            {summary}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#20D9E8", letterSpacing: "0.12em", marginBottom: "32px" }}>
            "Ideas to Impact through Technology"
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { label: "Role",      value: "Product Engineer",                    color: "#20D9E8" },
              { label: "Education", value: "B.Tech CSE · Geeta University",       color: "#20D9E8" },
              { label: "Status",    value: "Open to Opportunities",               color: "#4caf6a" },
              { label: "Location",  value: siteConfig.location,                  color: "#9b80f8" },
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
            <a href={siteConfig.leetcode} target="_blank" rel="noopener noreferrer"
              style={{ ...S.btn(false), border: "1px solid rgba(255,161,22,0.25)", color: "#FFA116", textDecoration: "none" }}>
              LeetCode →
            </a>
          </div>
        </div>
      )}

      {/* Experience */}
      {active === "experience" && (
        <div style={S.section} className="fade-in">
          <div style={S.sectionTag}>02 // EXPERIENCE</div>
          <h2 style={S.h2}>Where I've Worked</h2>
          <div style={S.divider} />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
            {experience.map(x => (
              <div key={x.company} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f0e8d8", margin: 0 }}>
                    {x.role} <span style={{ color: "#20D9E8" }}>· {x.company}</span>
                  </h3>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#7d93a6", whiteSpace: "nowrap" }}>
                    {x.period}
                  </span>
                </div>
                <ul style={{ margin: "12px 0 0", paddingLeft: "18px" }}>
                  {x.bullets.map(b => (
                    <li key={b} style={{ color: "#8FA2B5", fontSize: "14px", lineHeight: 1.7, marginBottom: "6px" }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={S.sectionTag}>EDUCATION</div>
          <div style={{ ...S.card, marginBottom: "20px" }}>
            {education.map(e => (
              <div key={e.school} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#f0e8d8", margin: 0 }}>{e.degree}</h3>
                  <div style={{ color: "#20D9E8", fontSize: "13px", marginTop: "4px" }}>{e.school}</div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#7d93a6" }}>{e.period}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px" }}>
            <div style={S.card}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#20D9E8", letterSpacing: "0.2em", marginBottom: "12px" }}>
                COURSEWORK
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {coursework.map(c => <span key={c} style={S.chip("#20D9E8")}>{c}</span>)}
              </div>
            </div>
            <div style={S.card}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#20D9E8", letterSpacing: "0.2em", marginBottom: "12px" }}>
                LANGUAGES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {languages.map(l => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9b80f8", flexShrink: 0 }} />
                    <span style={{ color: "#D7E2EA", fontSize: "13px" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {active === "projects" && (
        <div style={S.section} className="fade-in">
          <div style={S.sectionTag}>03 // PROJECTS</div>
          <h2 style={S.h2}>Featured Work</h2>
          <div style={S.divider} />
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {projects.map(p => (
              <div key={p.id} className="card-hover" style={{ ...S.card, borderColor: `${p.color}20` }}>
                <div style={{ height: "3px", borderRadius: "11px 11px 0 0", margin: "-24px -24px 16px", background: `linear-gradient(90deg, ${p.color}, ${p.color}00)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: p.color, letterSpacing: "0.2em", marginBottom: "4px" }}>
                      PROJECT {p.number} · {p.year}
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
                <p style={{ color: "#8FA2B5", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
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
        <div style={S.section} className="fade-in">
          <div style={S.sectionTag}>04 // SKILLS</div>
          <h2 style={S.h2}>Tech Stack</h2>
          <div style={S.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "20px" }}>
            {skillCategories.map(cat => (
              <div key={cat.key} className="card-hover" style={S.card}>
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
                        color: levelColors[skill.level],
                        background: `${levelColors[skill.level]}1a`,
                      }}>
                        {levelLabel[skill.level]}
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
        <div style={S.section} className="fade-in">
          <div style={S.sectionTag}>05 // CONTACT</div>
          <h2 style={S.h2}>Let's Build Something</h2>
          <div style={S.divider} />
          <p style={{ color: "#8FA2B5", fontSize: "15px", lineHeight: "1.8", maxWidth: "500px", marginBottom: "40px" }}>
            Open to full-time roles, internships, freelance projects, and interesting collaborations.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "16px" }}>
            {[
              { label: "GitHub",   url: siteConfig.github,           color: "#D7E2EA", icon: "GH" },
              { label: "LinkedIn", url: siteConfig.linkedin,         color: "#0A66C2", icon: "LI" },
              { label: "LeetCode", url: siteConfig.leetcode,         color: "#FFA116", icon: "LC" },
              { label: "Email",    url: siteConfig.email,            color: "#20D9E8", icon: "✉"  },
              { label: "Phone",    url: `tel:${siteConfig.phone.replace(/\s/g, "")}`, color: "#4caf6a", icon: "PH" },
              { label: "Resume",   url: siteConfig.resume,           color: "#20D9E8", icon: "CV" },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                className="card-hover"
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
        <p style={{ color: "#7d93a6", fontSize: "13px", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em", marginBottom: "16px" }}>
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

      <GuideBot onNavigate={setActive} />
    </div>
  );
}
