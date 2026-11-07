import { useEffect, useRef, useState } from "react";

type Section = "about" | "experience" | "projects" | "skills" | "contact";
type Msg = { from: "bot" | "user"; text: string };

interface Intent {
  q: string; // chip label — always contains one of its own keys
  keys: string[];
  a: string;
  more?: string;
  go?: Section;
}

// Order = tie priority: content intents first, small talk last.
const INTENTS: Intent[] = [
  { q: "Where's the resume?", keys: ["resume", "cv", "pdf", "download"], go: "contact",
    a: "The full CV is one click away — CONTACT → Resume opens it as a PDF. Opening CONTACT now." },
  { q: "How do I contact him?", keys: ["contact", "email", "mail", "phone", "number", "call", "reach", "linkedin"],
    go: "contact",
    a: "EMAIL ashishvibhor920@gmail.com · PHONE +91 81899 70016 · linkedin.com/in/ashish-vibhor. Opening CONTACT for one-click cards." },
  { q: "Where is he from?", keys: ["location", "where", "from", "live", "lives", "hometown", "city", "panipat", "haryana"],
    a: "Panipat, Haryana, India." },
  { q: "LeetCode?", keys: ["leetcode", "dsa", "coding", "problem", "problems", "competitive", "badge", "rank"],
    a: "Regular LeetCode solver — arrays, strings and DP — with an August LeetCode badge. → leetcode.com/u/2301301008" },
  { q: "Is he available?", keys: ["available", "availability", "hiring", "hire", "job", "opportunity", "opportunities", "freelance"],
    go: "contact",
    a: "Open to full-time roles, internships, freelance projects and interesting collaborations. Opening CONTACT." },
  { q: "What's his experience?", keys: ["experience", "intern", "internship", "education", "degree", "college", "university", "study", "course", "geeta", "talentgro"],
    go: "experience",
    a: "Two internships: Web Dev Intern @ TalentGro Global (Jun–Aug 2026) and Student Intern @ Geeta Technical Hub (Jan–Mar 2024), alongside B.Tech CSE at Geeta University (2023–Present).",
    more: "Coursework: DSA, DBMS, Operating Systems, Computer Networks, Software Engineering, Cloud Computing. At TalentGro he built responsive frontend features in HTML/CSS/JS/React and reusable UI components." },
  { q: "What languages does he speak?", keys: ["speak", "speaking", "hindi", "english"],
    a: "English (professional) and Hindi (native)." },
  { q: "What are his interests?", keys: ["hobby", "hobbies", "interest", "interests", "fun"],
    a: "Technology, product building, problem solving and learning." },
  { q: "Show me the projects", keys: ["project", "projects", "built", "build", "building", "demo", "portfolio", "app", "apps", "showcase"],
    go: "projects",
    a: "Four featured builds: Disha for India, Campus Delivery, Nirogitanman and this portfolio — each with stack, live demo and GitHub link.",
    more: "Disha for India (Next.js/Supabase) is a teen wellness platform; Campus Delivery (React/Node/MongoDB) handles food, riders and bus requests; Nirogitanman is an Ayurvedic brand experience." },
  { q: "What are his skills?", keys: ["skill", "skills", "stack", "tech", "technology", "programming", "framework", "know", "knows", "can"],
    go: "skills",
    a: "Frontend: React, Next.js, Three.js, TypeScript, Tailwind. Backend: Node, Express, REST. Data: MongoDB, Supabase, PostgreSQL — plus DSA and CS fundamentals.",
    more: "Also Python, C++, Java, SQL, Git/GitHub, Docker, AWS basics, VS Code, Postman and Figma." },
  { q: "How do I navigate?", keys: ["navigate", "navigation", "nav", "menu", "section", "sections", "tab", "scroll", "help", "use", "using", "site"],
    a: "Top nav: ABOUT · EXPERIENCE · PROJECTS · SKILLS · CONTACT — click any tab to jump there. The 🤖 GUIDE button reopens me." },
  { q: "What's in the 3D world?", keys: ["3d", "world", "game", "games", "walk", "office", "explore", "vr", "workspace"],
    a: "ENTER 3D (top-right) drops you into a virtual office — WASD to move, mouse to look, click desks and screens to open panels. Esc releases the mouse." },
  { q: "Who is Ashish?", keys: ["who", "about", "bio", "summary", "ashish", "himself", "name", "person", "profile", "does"],
    go: "about",
    a: "Ashish Vibhor — B.Tech CSE student at Geeta University and aspiring Product Engineer who turns ideas into practical, user-focused products.",
    more: "CV summary: enjoys building across the stack, creating responsive interfaces and solving real-world problems with modern web technologies. Curious, hands-on, and always learning." },
  { q: "Hi!", keys: ["hi", "hello", "hey", "yo", "salam"],
    a: "Hey! 👋 Ask me anything — projects, skills, resume, contact — or tap a quick question below." },
  { q: "Thanks!", keys: ["thanks", "thank", "appreciate", "grateful", "thx"],
    a: "Anytime! Ask me anything else." },
  { q: "Bye!", keys: ["bye", "goodbye", "later"],
    a: "See you! Reopen me anytime with the 🤖 GUIDE button." },
];

const GREETING =
  "Hi! I'm the guide bot. New here? Ask me anything below, or tap a quick question.";
const FALLBACK = "I only know the basics — try one of the quick questions below.";
const FOLLOW_UP = /^(more|tell me more|go on|continue|why|how so|details?|elaborate)\b/i;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const stem = (w: string) => (w.length > 4 ? w.replace(/ies$/, "y").replace(/(ing|ed|es|s)$/, "") : w);
const toks = (s: string) => norm(s).split(" ").filter(w => w.length >= 2).map(stem);

/** Weighted overlap between the input and an intent's keywords; order breaks ties. */
function score(input: string, it: Intent): number {
  const iw = toks(input);
  let total = 0;
  for (const key of it.keys) {
    const kw = toks(key);
    if (!kw.length) continue;
    const hits = kw.filter(k => iw.some(t => t === k || (k.length >= 4 && (t.startsWith(k) || k.startsWith(t))))).length;
    if (hits === kw.length) total += kw.length >= 2 ? 3 : 2;
    else if (hits > 0) total += hits;
  }
  return total;
}

function best(text: string): Intent | null {
  let top: Intent | null = null;
  let topScore = 0;
  for (const it of INTENTS) {
    const s = score(text, it);
    if (s > topScore) { topScore = s; top = it; }
  }
  return topScore >= 2 ? top : null;
}

export function GuideBot({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const lastTopic = useRef<Intent | null>(null);

  // Greet first-time visitors once per browser; returning visitors get the FAB only.
  useEffect(() => {
    try {
      if (!localStorage.getItem("guide_seen")) {
        localStorage.setItem("guide_seen", "1");
        setMessages([{ from: "bot", text: GREETING }]);
        setOpen(true);
      }
    } catch {
      /* storage blocked — no auto-greeting */
    }
  }, []);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo?.({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const respond = (userText: string, hit: Intent | null) => {
    if (timer.current) window.clearTimeout(timer.current);
    setMessages(m => [...m, { from: "user", text: userText }]);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text: hit ? hit.a : FALLBACK }]);
    }, 450);
  };

  const askIntent = (it: Intent) => {
    lastTopic.current = it;
    if (it.go) onNavigate(it.go);
    respond(it.q, it);
  };

  const ask = (text: string) => {
    const t = text.trim();
    // Short "tell me more" style follow-ups expand the previous topic.
    if (t.split(/\s+/).length <= 4 && FOLLOW_UP.test(t) && lastTopic.current?.more) {
      const more = lastTopic.current.more;
      if (timer.current) window.clearTimeout(timer.current);
      setMessages(m => [...m, { from: "user", text: t }]);
      setTyping(true);
      timer.current = window.setTimeout(() => {
        setTyping(false);
        setMessages(m => [...m, { from: "bot", text: more }]);
      }, 450);
      return;
    }
    const hit = best(t);
    if (hit) lastTopic.current = hit;
    if (hit?.go) onNavigate(hit.go);
    respond(t, hit);
  };

  if (!open) {
    return (
      <button
        className="btn-toolbar"
        onClick={() => setOpen(true)}
        aria-label="Open guide bot"
        style={{ position: "fixed", bottom: 16, right: 16, zIndex: 120 }}
      >
        🤖 GUIDE
      </button>
    );
  }

  return (
    <div
      className="panel-card"
      role="dialog"
      aria-label="Guide bot"
      style={{
        position: "fixed", bottom: 16, right: 16, margin: 0, zIndex: 120,
        width: "min(340px, calc(100vw - 32px))",
        maxHeight: "min(520px, calc(100vh - 32px))",
      }}
    >
      <div className="panel-header">
        <span className="panel-title" style={{ color: "#20D9E8" }}>
          🤖 GUIDE BOT
        </span>
        <button className="panel-close" onClick={() => setOpen(false)} aria-label="Close guide bot">
          ✕
        </button>
      </div>

      <div className="panel-body" ref={bodyRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                fontSize: "12px", lineHeight: 1.6, padding: "8px 10px",
                fontFamily: "'JetBrains Mono', monospace",
                maxWidth: "92%",
                alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                color: m.from === "user" ? "#D7E2EA" : "#8FA2B5",
                background: m.from === "user" ? "rgba(255,255,255,0.05)" : "rgba(32,217,232,0.06)",
                border: m.from === "user" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(32,217,232,0.14)",
                borderRadius: m.from === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
              }}
            >
              {m.text}
            </div>
          ))}
          {typing && (
            <div style={{
              fontSize: "12px", padding: "8px 10px", alignSelf: "flex-start",
              fontFamily: "'JetBrains Mono', monospace", color: "#8FA2B5",
              background: "rgba(32,217,232,0.06)", border: "1px solid rgba(32,217,232,0.14)",
              borderRadius: "10px 10px 10px 2px",
            }}>
              <span className="blink">•••</span>
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: "flex", gap: "6px", overflowX: "auto", whiteSpace: "nowrap",
        padding: "8px 12px", borderTop: "1px solid rgba(32,217,232,0.08)",
      }}>
        {INTENTS.filter(it => !["Hi!", "Thanks!", "Bye!"].includes(it.q)).map(it => (
          <button key={it.q} className="nav-item" onClick={() => askIntent(it)}>
            {it.q}
          </button>
        ))}
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          const t = draft.trim();
          if (!t) return;
          setDraft("");
          ask(t);
        }}
        style={{ display: "flex", gap: "6px", padding: "0 12px 12px" }}
      >
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type a question…"
          aria-label="Ask the guide bot"
          style={{
            flex: 1, minWidth: 0, padding: "7px 10px", borderRadius: "8px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#D7E2EA", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <button type="submit" className="panel-btn panel-btn-primary">→</button>
      </form>
    </div>
  );
}
