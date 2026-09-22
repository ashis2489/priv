import { useState } from "react";
import { useStore } from "../../store/useStore";

interface Book {
  title: string;
  author: string;
  color: string;
  status: "Read" | "Reading" | "In Progress" | "Queue";
  note: string;
  category: "DSA" | "Frontend" | "Backend" | "System Design" | "Engineering";
}

const books: Book[] = [
  { title: "Introduction to Algorithms (CLRS)", author: "Cormen, Leiserson, Rivest, Stein", color: "#FFB84D", status: "In Progress", note: "The DSA bible. Daily practice companion.", category: "DSA" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", color: "#F7DF1E", status: "Read", note: "Reshaped how I think about JS fundamentals.", category: "Frontend" },
  { title: "Clean Code", author: "Robert C. Martin", color: "#2DE2E6", status: "Read", note: "Changed how I name, structure, and document code.", category: "Engineering" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", color: "#2496ED", status: "Reading", note: "Deep dive into distributed systems & databases.", category: "System Design" },
  { title: "Node.js Design Patterns", author: "Mario Casciaro", color: "#68A063", status: "Read", note: "Backend architecture and async patterns mastery.", category: "Backend" },
  { title: "System Design Interview", author: "Alex Xu", color: "#20D9E8", status: "Reading", note: "Scalability, trade-offs, and real-world systems.", category: "System Design" },
  { title: "You Don't Know JS (Series)", author: "Kyle Simpson", color: "#F7DF1E", status: "In Progress", note: "Deep JavaScript internals — scope, closures, async.", category: "Frontend" },
  { title: "Cloud Native Patterns", author: "Cornelia Davis", color: "#4ECDC4", status: "Queue", note: "Next on the list — cloud-native architecture.", category: "System Design" },
];

const STATUS_COLORS: Record<string, string> = { Read: "#28C840", Reading: "#2DE2E6", "In Progress": "#FFB84D", Queue: "#718096" };
const CATEGORY_COLORS: Record<string, string> = { DSA: "#FFB84D", Frontend: "#61DAFB", Backend: "#68A063", "System Design": "#2DE2E6", Engineering: "#9B59B6" };
const ALL_CATEGORIES = ["All", "DSA", "Frontend", "Backend", "System Design", "Engineering"] as const;
type CategoryFilter = typeof ALL_CATEGORIES[number];

export function BookshelfPanel() {
  const { closePanel } = useStore();
  const [filter, setFilter] = useState<CategoryFilter>("All");

  const filtered = filter === "All" ? books : books.filter(b => b.category === filter);
  const readCount = books.filter(b => b.status === "Read").length;
  const readingCount = books.filter(b => b.status === "Reading" || b.status === "In Progress").length;

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
          <div className="panel-title">KNOWLEDGE SHELF</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 px-4 py-2.5 shrink-0" style={{ borderBottom: "1px solid rgba(32,217,232,0.05)" }}>
          {[
            { label: "Total", value: books.length, color: "#718096" },
            { label: "Read", value: readCount, color: "#28C840" },
            { label: "Active", value: readingCount, color: "#FFB84D" },
            { label: "Queued", value: books.length - readCount - readingCount, color: "#3a5060" },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-base font-bold leading-none font-mono" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[7px] text-[#3a5060] tracking-wider font-mono uppercase">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 px-3 py-2 overflow-x-auto shrink-0" style={{ borderBottom: "1px solid rgba(32,217,232,0.05)" }}>
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="shrink-0 px-2.5 py-1 rounded-md text-[9px] font-mono transition-all"
              style={{
                color: filter === cat ? (CATEGORY_COLORS[cat] ?? "#FFB84D") : "#5a6a78",
                background: filter === cat ? `${CATEGORY_COLORS[cat] ?? "#FFB84D"}10` : "transparent",
                border: `1px solid ${filter === cat ? (CATEGORY_COLORS[cat] ?? "#FFB84D") + "25" : "transparent"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Book list */}
        <div className="panel-body space-y-1.5">
          {filtered.map((book, i) => (
            <div key={i} className="panel-item gap-2.5 p-3">
              <div className="w-0.5 rounded-full shrink-0 self-stretch" style={{ background: book.color, boxShadow: `0 0 4px ${book.color}30` }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div>
                    <div className="text-[12px] text-[#d7e2ea] font-medium leading-snug">{book.title}</div>
                    <div className="text-[10px] text-[#718096] mt-0.5">{book.author}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="panel-badge" style={{ color: STATUS_COLORS[book.status], background: `${STATUS_COLORS[book.status]}10`, border: `1px solid ${STATUS_COLORS[book.status]}20` }}>
                      {book.status}
                    </span>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: CATEGORY_COLORS[book.category] ?? "#718096", background: `${CATEGORY_COLORS[book.category] ?? "#718096"}10` }}>
                      {book.category}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-[#4a6a70] italic mt-1 leading-relaxed">"{book.note}"</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid rgba(32,217,232,0.05)" }}>
          <p className="text-[9px] text-[#3a5060] font-mono">
            Always learning — <span className="text-[#FFB84D]">System Design & Cloud</span> next.
          </p>
          <span className="text-[8px] text-[#2a3a48] font-mono tracking-wider">
            {filtered.length}/{books.length}
          </span>
        </div>
      </div>
    </div>
  );
}
