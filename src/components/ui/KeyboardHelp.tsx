import { useEffect, useState } from "react";

const SHORTCUTS = [
  { category: "Movement", items: [
    { keys: "W A S D", desc: "Move around" },
    { keys: "MOUSE", desc: "Look around" },
    { keys: "CLICK", desc: "Interact / Lock cursor" },
    { keys: "ESC", desc: "Release cursor / Close panel" },
  ]},
  { category: "Navigation", items: [
    { keys: "ALT + 1-9", desc: "Open panels" },
    { keys: "ALT + Q W E R T Y", desc: "Teleport to rooms" },
    { keys: "M", desc: "Toggle minimap" },
  ]},
  { category: "Panels", items: [
    { keys: "ALT + 1", desc: "About" },
    { keys: "ALT + 2", desc: "Projects" },
    { keys: "ALT + 3", desc: "Tech Stack" },
    { keys: "ALT + 4", desc: "Architecture" },
    { keys: "ALT + 5", desc: "Terminal" },
    { keys: "ALT + 6", desc: "GitHub" },
    { keys: "ALT + 7", desc: "Contact" },
    { keys: "ALT + 8", desc: "Resume" },
    { keys: "ALT + 9", desc: "Status" },
  ]},
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.key === "/" && !e.altKey && !e.ctrlKey)) {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative glass p-6 max-w-md w-full mx-4 fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-sm text-[#8fe6ea] tracking-wider">KEYBOARD SHORTCUTS</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-md border border-white/10 bg-white/5 text-[#8ea1ad] hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {SHORTCUTS.map(cat => (
            <div key={cat.category}>
              <div className="font-mono text-[9px] text-[#4f6471] tracking-wider mb-2 uppercase">
                {cat.category}
              </div>
              <div className="space-y-1">
                {cat.items.map(item => (
                  <div key={item.keys} className="flex items-center justify-between py-1">
                    <span className="font-mono text-[10px] text-[#8fe6ea] bg-[rgba(32,217,232,0.08)] px-2 py-0.5 rounded border border-[rgba(32,217,232,0.15)]">
                      {item.keys}
                    </span>
                    <span className="font-mono text-[10px] text-[#6a7a84]">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-center">
          <span className="font-mono text-[8px] text-[#3a4a56]">
            Press <span className="text-[#8fe6ea]">?</span> to toggle this overlay
          </span>
        </div>
      </div>
    </div>
  );
}
