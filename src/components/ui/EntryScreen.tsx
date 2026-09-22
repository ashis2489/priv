import { useEffect, useState } from "react";
import { siteConfig } from "../../config/site";

interface EntryScreenProps {
  onEnter3D:      () => void;
  onEnterClassic: () => void;
}

export function EntryScreen({ onEnter3D, onEnterClassic }: EntryScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#05080f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
    }}>
      {/* Radial ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(32,217,232,0.055) 0%, transparent 68%)",
      }} />
      {/* Very faint grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.018,
        backgroundImage:
          "linear-gradient(rgba(32,217,232,1) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(32,217,232,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center", padding: "0 28px",
        maxWidth: "480px", width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}>
        {/* Logo mark */}
        <div style={{
          width: "52px", height: "52px", borderRadius: "12px",
          background: "rgba(32,217,232,0.08)",
          border: "1px solid rgba(32,217,232,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 0 28px rgba(32,217,232,0.1)",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "20px", fontWeight: 800, color: "#20D9E8",
          }}>V</span>
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(34px, 8vw, 48px)",
          fontWeight: 800, letterSpacing: "0.14em",
          color: "#eef4f5", marginBottom: "8px", lineHeight: 1,
        }}>
          VEDAA
        </h1>

        {/* Role */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px", letterSpacing: "0.3em",
          color: "#20D9E8", marginBottom: "4px",
        }}>
          FULL-STACK DEVELOPER
        </p>

        {/* Field */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", letterSpacing: "0.22em",
          color: "#3a5460", marginBottom: "14px",
        }}>
          COMPUTER SCIENCE & ENGINEERING
        </p>

        {/* Tagline */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", letterSpacing: "0.3em",
          color: "#2a3e48", marginBottom: "28px",
        }}>
          {siteConfig.tagline}
        </p>

        {/* Short bio */}
        <p style={{
          fontSize: "14px", color: "#6a7a84",
          lineHeight: "1.72", marginBottom: "36px",
          maxWidth: "380px", margin: "0 auto 36px",
        }}>
          Building scalable web applications, interactive experiences,
          and practical digital products.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>

          {/* Primary */}
          <button
            onClick={onEnter3D}
            aria-label="Enter 3D portfolio experience"
            className="btn-entry-primary"
          >
            ⬡ &nbsp;EXPLORE 3D PORTFOLIO
          </button>

          {/* Secondary */}
          <button
            onClick={onEnterClassic}
            aria-label="Enter classic 2D portfolio"
            className="btn-entry-secondary"
          >
            ≡ &nbsp;2D CLASSIC PORTFOLIO
          </button>
        </div>

        {/* Availability badge */}
        <div style={{
          marginTop: "38px",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "7px",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#4caf6a",
            boxShadow: "0 0 8px rgba(76,175,106,0.65)",
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px", color: "#2a4030",
            letterSpacing: "0.22em",
          }}>
            AVAILABLE FOR OPPORTUNITIES
          </span>
        </div>
      </div>
    </div>
  );
}
