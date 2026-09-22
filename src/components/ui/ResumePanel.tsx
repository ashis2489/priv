import { useStore } from "../../store/useStore";
import { siteConfig } from "../../config/site";

export function ResumePanel() {
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
          <div className="panel-title">RESUME</div>
          <button onClick={closePanel} className="panel-close">✕</button>
        </div>

        <div className="panel-body space-y-4">
          {/* Resume preview card */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(32,217,232,0.1)" }}>
            {/* Mock document header */}
            <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(4,8,16,0.9)", borderBottom: "1px solid rgba(32,217,232,0.06)" }}>
              {["#FF5F57","#FEBC2E","#28C840"].map((c,i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="text-[10px] text-[#5a6a78] ml-1">vedaa_resume.pdf</span>
            </div>

            {/* Document preview */}
            <div className="p-5" style={{ background: "linear-gradient(160deg, #040e1a 0%, #07111f 100%)", minHeight: "180px" }}>
              <div className="text-xl font-extrabold tracking-wider text-[#2DE2E6] mb-1">VEDAA</div>
              <div className="text-[10px] tracking-widest text-[#20D9E8] mb-4">FULL-STACK DEVELOPER · CS & ENGINEERING</div>

              {[
                { label: "EDUCATION",   items: ["B.Tech CSE — Current Student"] },
                { label: "SKILLS",      items: ["React · Next.js · Node.js · TypeScript", "MongoDB · Supabase · Docker · Git"] },
                { label: "PROJECTS",    items: ["Campus Delivery", "Disha for India", "Nirogitanman"] },
                { label: "CURRENTLY",   items: ["Cloud Architecture · System Design · DSA"] },
              ].map(section => (
                <div key={section.label} className="mb-2.5">
                  <div className="text-[8px] tracking-[0.25em] text-[#20D9E8] mb-1">{section.label}</div>
                  {section.items.map(item => (
                    <div key={item} className="text-[10px] text-[#718096] mb-0.5">{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" className="panel-btn panel-btn-primary text-center">
              VIEW RESUME ↗
            </a>
            <a href={siteConfig.resume} download className="panel-btn panel-btn-secondary text-center">
              DOWNLOAD ↓
            </a>
          </div>

          <p className="text-[10px] text-[#3a5060] text-center">
            Drop your PDF at <code className="text-[#20D9E8]">public/resume.pdf</code> to enable download
          </p>
        </div>
      </div>
    </div>
  );
}
