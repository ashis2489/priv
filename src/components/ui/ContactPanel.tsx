import { useState } from "react";
import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";

const LINKS = [
  { label: "GitHub",   value: siteConfig.github,   color: "#d7e2ea", icon: "GH", href: siteConfig.github },
  { label: "LinkedIn", value: siteConfig.linkedin,  color: "#0A66C2", icon: "LI", href: siteConfig.linkedin },
  { label: "Email",    value: siteConfig.email.replace("mailto:", ""), color: "#20D9E8", icon: "✉", href: siteConfig.email },
  { label: "Resume",   value: "View / Download",    color: "#FFB84D", icon: "CV", href: siteConfig.resume },
];

export function ContactPanel() {
  const { closePanel } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
  };

  const inputClass = "w-full bg-[rgba(4,8,16,0.9)] border border-[rgba(32,217,232,0.1)] rounded-md px-3 py-2.5 text-[12px] text-[#d7e2ea] outline-none font-sans transition-colors focus:border-[rgba(32,217,232,0.3)]";

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
          <div className="panel-title">CONTACT</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        <div className="panel-body space-y-4">
          {/* Direct links */}
          <div>
            <div className="panel-section-title">Direct Channels</div>
            <div className="space-y-1.5">
              {LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href ?? link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-item no-underline"
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0 font-mono"
                    style={{ background: `${link.color}12`, color: link.color }}
                  >
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[#d7e2ea] font-medium">{link.label}</div>
                    <div className="text-[10px] text-[#5a6a78] truncate">{link.value}</div>
                  </div>
                  <span className="text-[12px]" style={{ color: link.color }}>↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Message form */}
          <div>
            <div className="panel-section-title">Send Transmission</div>
            {sent ? (
              <div className="text-center py-6 rounded-lg" style={{ background: "rgba(40,200,64,0.04)", border: "1px solid rgba(40,200,64,0.15)" }}>
                <div className="text-lg text-[#28C840] mb-2">✓</div>
                <div className="text-[13px] text-[#d7e2ea] font-medium">Transmission sent!</div>
                <div className="text-[11px] text-[#5a6a78] mt-1">I'll get back to you soon.</div>
              </div>
            ) : (
              <form onSubmit={handleTransmit} className="space-y-2.5">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className={inputClass} required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" aria-label="Your email" className={inputClass} required />
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your message..." aria-label="Your message" rows={3} className={`${inputClass} resize-none`} required />
                <button type="submit" className="w-full panel-btn panel-btn-primary">
                  TRANSMIT MESSAGE →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
