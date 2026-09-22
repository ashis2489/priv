/**
 * Knowledge Lab — SKILLS
 * Exact match to reference image.
 * All text rendered via canvas textures for crisp quality.
 */
import { useMemo } from "react";
import { SHELL } from "../scene/OpenWorldFloor";
import { useStore } from "../../store/useStore";
import { useCursor } from "../../utils/useCursor";
import * as THREE from "three";

const { W, D, H } = SHELL;
const BZ = -D / 2 + 0.05;

// ─── Canvas helper ───────────────────────────────────────────────────────────
function tx(
  fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  w: number, h: number
): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  fn(ctx, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.anisotropy = 8;
  return t;
}

// ─── LEFT PANEL — CATEGORIES ─────────────────────────────────────────────────
function makeLeftTex() {
  return tx((ctx, w, h) => {
    // Background
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, w, h);

    // Header bg strip
    ctx.fillStyle = "#0f1520";
    ctx.fillRect(0, 0, w, 80);

    // "CATEGORIES" heading
    ctx.font = "700 28px 'Arial'";
    ctx.fillStyle = "#20D9E8";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("CATEGORIES", w / 2, 50);

    const cats = [
      "WEB DEVELOPMENT",
      "PROGRAMMING",
      "DSA",
      "DATABASES",
      "SYSTEM DESIGN",
      "DEVOPS",
    ];

    cats.forEach((cat, i) => {
      const y = 100 + i * 92;

      // Row separator
      if (i > 0) {
        ctx.fillStyle = "rgba(32,217,232,0.08)";
        ctx.fillRect(24, y - 14, w - 48, 1);
      }

      // Number — big cyan
      ctx.font = "700 36px Arial";
      ctx.fillStyle = "#20D9E8";
      ctx.textAlign = "left";
      ctx.fillText(`0${i + 1}`, 28, y + 22);

      // Label
      ctx.font = "600 26px Arial";
      ctx.fillStyle = "#c8e0ec";
      ctx.fillText(cat, 28, y + 58);
    });

    // Cyan top + bottom border lines
    ctx.fillStyle = "#20D9E8";
    ctx.fillRect(0, 0, w, 4);
    ctx.fillRect(0, h - 4, w, 4);
    // Left border
    ctx.fillRect(0, 0, 4, h);
  }, 320, 660);
}

// ─── CENTRE PANEL — SKILLS GRID ──────────────────────────────────────────────
function makeCentreTex() {
  return tx((ctx, w, h) => {
    ctx.fillStyle = "#08090e";
    ctx.fillRect(0, 0, w, h);

    // Header section bg
    ctx.fillStyle = "#0c0e18";
    ctx.fillRect(0, 0, w, 110);

    // "SKILLS" heading
    ctx.font = "700 64px Arial";
    ctx.fillStyle = "#eef4f8";
    ctx.textAlign = "center";
    ctx.fillText("SKILLS", w / 2, 64);

    // "KNOWLEDGE LAB" sub
    ctx.font = "500 22px Arial";
    ctx.fillStyle = "#6a8898";
    ctx.letterSpacing = "5px";
    ctx.fillText("KNOWLEDGE LAB", w / 2, 96);

    // Cyan divider
    ctx.fillStyle = "#20D9E8" + "60";
    ctx.fillRect(40, 110, w - 80, 1);

    // "KNOWLEDGE LAB" large label in teal
    ctx.font = "600 32px Arial";
    ctx.fillStyle = "#20D9E8";
    ctx.letterSpacing = "2px";
    ctx.fillText("KNOWLEDGE LAB", w / 2, 148);

    // 2×3 skill grid
    const skills = [
      { icon: "</>",   label: "WEB\nDEVELOPMENT",        sub: "HTML · CSS · JavaScript",  color: "#20D9E8" },
      { icon: "{ }",   label: "PROGRAMMING",               sub: "C++ · Java · Python",      color: "#20D9E8" },
      { icon: "{ }",   label: "DATA STRUCTURES\n& ALGORITHMS", sub: "Arrays · Trees · Graphs", color: "#20D9E8" },
      { icon: "[ db ]",label: "DATABASES",                 sub: "MongoDB · PostgreSQL",     color: "#20D9E8" },
      { icon: "⬡",    label: "SYSTEM DESIGN",             sub: "Microservices · Scalability",color: "#20D9E8" },
      { icon: "∞",    label: "DEVOPS",                    sub: "Docker · AWS · CI/CD",     color: "#20D9E8" },
    ];

    const cols = 3;
    const cw = (w - 48) / cols;
    const topY = 170;
    const ch = (h - topY - 16) / 2;

    skills.forEach((sk, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = 24 + col * cw;
      const cy = topY + row * ch;

      // Cell bg
      ctx.fillStyle = col % 2 === 0 ? "rgba(10,14,24,0.8)" : "rgba(12,16,26,0.8)";
      ctx.fillRect(cx + 4, cy + 4, cw - 8, ch - 8);

      // Border
      ctx.strokeStyle = "rgba(32,217,232,0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 4, cy + 4, cw - 8, ch - 8);

      // Icon circle
      const icx = cx + cw / 2;
      const icy = cy + 44;
      ctx.fillStyle = "#20D9E8" + "14";
      ctx.beginPath();
      ctx.arc(icx, icy, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#20D9E8" + "40";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = "700 20px monospace";
      ctx.fillStyle = "#20D9E8";
      ctx.textAlign = "center";
      ctx.fillText(sk.icon, icx, icy + 7);

      // Label
      ctx.font = "700 20px Arial";
      ctx.fillStyle = "#d0e8f4";
      const lines2 = sk.label.split("\n");
      lines2.forEach((ln, li) => {
        ctx.fillText(ln, icx, cy + 94 + li * 22);
      });

      // Sub
      ctx.font = "400 17px Arial";
      ctx.fillStyle = "#4a6878";
      ctx.fillText(sk.sub, icx, cy + 94 + lines2.length * 22 + 20);
    });

    // Grid lines
    ctx.strokeStyle = "rgba(32,217,232,0.12)";
    ctx.lineWidth = 1;
    // vertical
    [1, 2].forEach(c => {
      const x = 24 + c * cw;
      ctx.beginPath(); ctx.moveTo(x, topY); ctx.lineTo(x, h - 8); ctx.stroke();
    });
    // horizontal mid
    ctx.beginPath();
    ctx.moveTo(24, topY + ch);
    ctx.lineTo(w - 24, topY + ch);
    ctx.stroke();

    // Cyan frame
    ctx.strokeStyle = "#20D9E8";
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, w - 6, h - 6);
  }, 720, 640);
}

// ─── RIGHT PANEL — CURRENTLY LEARNING ────────────────────────────────────────
function makeRightTex() {
  return tx((ctx, w, h) => {
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#0e1020";
    ctx.fillRect(0, 0, w, 70);

    // "CURRENTLY LEARNING"
    ctx.font = "700 22px Arial";
    ctx.fillStyle = "#8a5ae8";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText("CURRENTLY", w / 2, 36);
    ctx.fillText("LEARNING", w / 2, 60);

    const items = [
      { dot: "#20D9E8", label: "React" },
      { dot: "#68A063", label: "Node.js" },
      { dot: "#8a5ae8", label: "System Design" },
      { dot: "#2496ED", label: "Cloud Computing" },
    ];

    items.forEach((item, i) => {
      const y = 95 + i * 62;
      // Dot
      ctx.fillStyle = item.dot;
      ctx.beginPath();
      ctx.arc(28, y + 12, 7, 0, Math.PI * 2);
      ctx.fill();
      // Label
      ctx.font = "500 24px Arial";
      ctx.fillStyle = "#c8e0ec";
      ctx.textAlign = "left";
      ctx.fillText(item.label, 46, y + 18);
      // Row separator
      if (i < items.length - 1) {
        ctx.fillStyle = "rgba(138,90,232,0.12)";
        ctx.fillRect(18, y + 44, w - 36, 1);
      }
    });

    // Divider
    ctx.fillStyle = "rgba(138,90,232,0.35)";
    ctx.fillRect(18, 352, w - 36, 2);

    // "VEDAA"
    ctx.font = "700 52px Arial";
    ctx.fillStyle = "#eef4f8";
    ctx.textAlign = "center";
    ctx.fillText("VEDAA", w / 2, 418);

    // "BUILD | LEARN | GROW"
    ctx.font = "400 19px Arial";
    ctx.fillStyle = "#5a7080";
    ctx.letterSpacing = "2px";
    ctx.fillText("BUILD | LEARN | GROW", w / 2, 448);

    // Social icons
    const socials = ["in", "GH", "✉"];
    socials.forEach((s, i) => {
      const sx = w / 2 - 44 + i * 44;
      ctx.fillStyle = "#8a5ae8" + "20";
      ctx.beginPath(); ctx.arc(sx, 488, 16, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#8a5ae8" + "50";
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.font = "700 14px Arial";
      ctx.fillStyle = "#8a5ae8";
      ctx.textAlign = "center";
      ctx.fillText(s, sx, 493);
    });

    // Purple frame
    ctx.strokeStyle = "#8a5ae8";
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    // Right border thick accent
    ctx.fillStyle = "#8a5ae8";
    ctx.fillRect(w - 4, 0, 4, h);
  }, 320, 530);
}

// ─── LEFT WALL TEXT — BUILD LEARN GROW ────────────────────────────────────────
function makeBuildLearnGrowTex() {
  return tx((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const lines = ["BUILD", "LEARN", "GROW"];
    lines.forEach((line, i) => {
      ctx.font = `700 ${i === 2 ? 88 : 88}px Arial`;
      ctx.fillStyle = i === 2 ? "#eef4f8" : "#c8e0ec";
      ctx.textAlign = "left";
      ctx.fillText(line, 0, 96 + i * 100);
    });
  }, 420, 320);
}

// ─── DAILY REMINDER small panel ───────────────────────────────────────────────
function makeDailyReminderTex() {
  return tx((ctx, w, h) => {
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#20D9E8" + "50";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(3, 3, w - 6, h - 6);
    ctx.font = "700 20px Arial";
    ctx.fillStyle = "#20D9E8";
    ctx.textAlign = "center";
    ctx.letterSpacing = "3px";
    ctx.fillText("DAILY REMINDER", w / 2, 36);
    ctx.fillStyle = "rgba(32,217,232,0.3)";
    ctx.fillRect(16, 46, w - 32, 1);
    const items = ["· FOCUS", "· PLAN", "· CODE", "· REPEAT"];
    items.forEach((item, i) => {
      ctx.font = "400 22px Arial";
      ctx.fillStyle = "#8aacbc";
      ctx.textAlign = "left";
      ctx.fillText(item, 20, 74 + i * 32);
    });
  }, 280, 218);
}

// ─── RIGHT WALL QUOTE ─────────────────────────────────────────────────────────
function makeQuoteTex() {
  return tx((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = "700 38px Arial";
    ctx.fillStyle = "#d0e8f4";
    ctx.textAlign = "left";
    const lines = ["THE BEST WAY", "TO PREDICT", "THE FUTURE", "IS TO", "BUILD IT."];
    lines.forEach((l, i) => {
      if (l === "BUILD IT.") ctx.fillStyle = "#eef4f8";
      ctx.fillText(l, 0, 44 + i * 48);
    });
  }, 340, 280);
}

// ─── RIGHT WALL ICON BOX ──────────────────────────────────────────────────────
function makeIconBoxTex(icon: string, color: string) {
  return tx((ctx, w, h) => {
    ctx.fillStyle = "#080a12";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = color + "60";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, w - 8, h - 8);
    ctx.font = "700 44px monospace";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(icon, w / 2, h / 2 + 16);
  }, 160, 120);
}

// ─── WELCOME PLATFORM LABEL ───────────────────────────────────────────────────
function makeWelcomeTex() {
  return tx((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    // Main title
    ctx.font = "300 52px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "12px";
    ctx.fillText("W E L C O M E", w / 2, h / 2 - 18);
    // Subtitle
    ctx.font = "300 20px Arial";
    ctx.fillStyle = "#a0b0c0";
    ctx.fillText("T O   M Y   P O R T F O L I O", w / 2, h / 2 + 20);
    // Cyan accent line
    ctx.fillStyle = "#20D9E8";
    ctx.fillRect(w / 2 - 30, h / 2 + 48, 60, 2);
  }, 600, 120);
}

// ─── Vertical wood slat panel ─────────────────────────────────────────────────
function WoodSlats({ x, y, z, width = 0.55, height = 2.5, count = 7 }: {
  x: number; y: number; z: number;
  width?: number; height?: number; count?: number;
}) {
  const gap = width / (count - 1);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0, -0.016]}>
        <planeGeometry args={[width + 0.1, height]} />
        <meshStandardMaterial color="#06080e" roughness={0.8} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[-width / 2 + i * gap, 0, 0]} castShadow>
          <boxGeometry args={[0.04, height - 0.04, 0.042]} />
          <meshStandardMaterial color="#1e1208" roughness={0.7} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Circular Welcome Platform ────────────────────────────────────────────────
function HexPlatform() {
  const welcomeTex = useMemo(() => makeWelcomeTex(), []);
  return (
    <group position={[0, 0, -1.2]}>
      {/* Base ring — warm glow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.82, 64]} />
        <meshStandardMaterial color="#FFB84D" emissive="#FFB84D"
          emissiveIntensity={1.8} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0.05, 0]}
        intensity={2.0} color="#FFB84D" distance={3.0} decay={2} />

      {/* Bottom base slab */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.78, 0.08, 64]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Chrome outer ring — reflective */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.2, 64, 1, true]} />
        <meshStandardMaterial color="#c0c8d0" roughness={0.05} metalness={0.95}
          envMapIntensity={1.5} side={2} />
      </mesh>

      {/* Inner dark platform */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.04, 64]} />
        <meshStandardMaterial color="#0a0c12" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Top face — dark matte */}
      <mesh position={[0, 0.162, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 64]} />
        <meshStandardMaterial color="#0d0f15" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Welcome text */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 0.22]} />
        <meshStandardMaterial map={welcomeTex} toneMapped={false} transparent depthWrite={false} />
      </mesh>

      {/* Middle accent ring — warm glow */}
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.68, 0.72, 64]} />
        <meshStandardMaterial color="#FFB84D" emissive="#FFB84D"
          emissiveIntensity={1.2} transparent opacity={0.7} />
      </mesh>

      {/* Top glass ring — transparent */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.70, 0.70, 0.12, 64, 1, true]} />
        <meshStandardMaterial color="#88c8e8" roughness={0.02} metalness={0.1}
          transparent opacity={0.15} side={2} />
      </mesh>

      {/* Top rim — chrome */}
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.68, 0.72, 64]} />
        <meshStandardMaterial color="#d0d8e0" roughness={0.05} metalness={0.95} />
      </mesh>
    </group>
  );
}

export function KnowledgeLabRoom() {
  const { openPanel } = useStore();
  const cursor = useCursor();

  const leftTex    = useMemo(() => makeLeftTex(),    []);
  const centreTex  = useMemo(() => makeCentreTex(),  []);
  const rightTex   = useMemo(() => makeRightTex(),   []);
  const blgTex     = useMemo(() => makeBuildLearnGrowTex(), []);
  const reminderTx = useMemo(() => makeDailyReminderTex(),  []);
  const quoteTex   = useMemo(() => makeQuoteTex(),   []);
  const iconBoxes  = useMemo(() => [
    makeIconBoxTex("</>", "#20D9E8"),
    makeIconBoxTex("{ }", "#8a5ae8"),
    makeIconBoxTex("db",  "#20D9E8"),
    makeIconBoxTex("☁",  "#8a5ae8"),
  ], []);

  // Panel sizes (world units — 1 world unit ≈ 1 metre)
  const leftW  = 1.14, leftH  = 2.34;
  const centW  = 2.58, centH  = 2.34;
  const rightW = 1.14, rightH = 1.95;

  // X positions — centred group
  const totalW   = leftW + centW + rightW + 0.18; // 0.09 gap each
  const startX   = -totalW / 2;
  const leftX    = startX + leftW / 2;
  const centX    = leftX + leftW / 2 + 0.09 + centW / 2;
  const rightX   = centX + centW / 2 + 0.09 + rightW / 2;

  const panelY = (y: number, h: number) => h / 2 + y; // bottom at Y=y

  return (
    <group>
      {/* ── Ceiling recessed light bar ── */}
      <mesh position={[0, H - 0.018, -1.2]}>
        <boxGeometry args={[W - 1.5, 0.036, 0.22]} />
        <meshStandardMaterial color="#101418" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Warm strip inside bar */}
      <mesh position={[0, H - 0.005, -1.2]}>
        <boxGeometry args={[W - 1.8, 0.004, 0.004]} />
        <meshStandardMaterial color="#fff4d8" emissive="#fff4d8"
          emissiveIntensity={3} transparent opacity={0.95} />
      </mesh>
      {/* 2 downlight fixtures */}
      {[-2.2, 2.2].map((x, i) => (
        <group key={i} position={[x, H - 0.012, -1.4]}>
          <mesh>
            <boxGeometry args={[0.22, 0.024, 0.22]} />
            <meshStandardMaterial color="#111418" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.07, 14]} />
            <meshStandardMaterial color="#fff8e8" emissive="#fff8e8" emissiveIntensity={3} />
          </mesh>
          <pointLight position={[0, -0.1, 0]}
            intensity={3.5} color="#fff4e0" distance={5} decay={2} castShadow />
        </group>
      ))}

      {/* ── Floor warm LED strip ── */}
      <mesh position={[0, 0.022, BZ + 0.05]}>
        <boxGeometry args={[W - 0.6, 0.008, 0.008]} />
        <meshStandardMaterial color="#ffcc77" emissive="#ffcc77"
          emissiveIntensity={2.6} transparent opacity={0.88} />
      </mesh>


      {/* ── Left wall decoration ── */}
      {/* "BUILD LEARN GROW" large text */}
      <mesh position={[-W / 2 + 0.03, 1.84, -0.4]}
        rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.45, 1.08]} />
        <meshStandardMaterial map={blgTex} toneMapped={false} transparent />
      </mesh>
      {/* Daily reminder small panel */}
      <mesh position={[-W / 2 + 0.03, 0.9, 1.2]}
        rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.98, 0.76]} />
        <meshStandardMaterial map={reminderTx} toneMapped={false} />
      </mesh>
      {/* Wood slats left */}
      <WoodSlats x={-W / 2 + 0.28} y={1.45} z={-2.2} />

      {/* ── Right wall decoration ── */}
      {/* Quote text — on right wall, facing inward */}
      <mesh position={[W / 2 - 0.03, 2.0, -1.2]}
        rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 1.0]} />
        <meshStandardMaterial map={quoteTex} toneMapped={false} transparent />
      </mesh>
      {/* Icon boxes — flush to right wall, evenly spaced vertically */}
      {iconBoxes.map((itx, i) => (
        <mesh key={i}
          position={[W / 2 - 0.03, 2.55 - i * 0.48, -2.8]}
          rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.56, 0.38]} />
          <meshStandardMaterial map={itx} toneMapped={false} />
        </mesh>
      ))}
      {/* Wood slats right — flush to right wall */}
      <WoodSlats x={W / 2 - 0.28} y={1.45} z={-2.2} />

      {/* ── 3 back wall panels ── */}
      {/* Left panel — CATEGORIES */}
      <mesh position={[leftX, panelY(0.08, leftH), BZ + 0.025]}
        castShadow>
        <planeGeometry args={[leftW, leftH]} />
        <meshStandardMaterial map={leftTex} toneMapped={false}
          emissive="#ffffff" emissiveMap={leftTex} emissiveIntensity={0.22} />
      </mesh>
      {/* Cyan glow border left panel */}
      {([
        [leftX, panelY(0.08, leftH) + leftH / 2 + 0.004, BZ + 0.027, leftW + 0.04, 0.009],
        [leftX, panelY(0.08, leftH) - leftH / 2 - 0.004, BZ + 0.027, leftW + 0.04, 0.009],
        [leftX - leftW / 2 - 0.004, panelY(0.08, leftH), BZ + 0.027, 0.009, leftH + 0.04],
        [leftX + leftW / 2 + 0.004, panelY(0.08, leftH), BZ + 0.027, 0.009, leftH + 0.04],
      ] as [number,number,number,number,number][]).map(([px,py,pz,pw,ph], i) => (
        <mesh key={i} position={[px,py,pz]}>
          <planeGeometry args={[pw, ph]} />
          <meshStandardMaterial color="#20D9E8" emissive="#20D9E8"
            emissiveIntensity={2.4} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Centre panel — SKILLS */}
      <mesh position={[centX, panelY(0.08, centH), BZ + 0.025]}
        {...cursor}
        onClick={() => openPanel("skills")}
        castShadow>
        <planeGeometry args={[centW, centH]} />
        <meshStandardMaterial map={centreTex} toneMapped={false}
          emissive="#ffffff" emissiveMap={centreTex} emissiveIntensity={0.28} />
      </mesh>
      {/* Cyan glow border centre */}
      {([
        [centX, panelY(0.08, centH) + centH / 2 + 0.004, BZ + 0.027, centW + 0.04, 0.009],
        [centX, panelY(0.08, centH) - centH / 2 - 0.004, BZ + 0.027, centW + 0.04, 0.009],
        [centX - centW / 2 - 0.004, panelY(0.08, centH), BZ + 0.027, 0.009, centH + 0.04],
        [centX + centW / 2 + 0.004, panelY(0.08, centH), BZ + 0.027, 0.009, centH + 0.04],
      ] as [number,number,number,number,number][]).map(([px,py,pz,pw,ph], i) => (
        <mesh key={i} position={[px,py,pz]}>
          <planeGeometry args={[pw, ph]} />
          <meshStandardMaterial color="#20D9E8" emissive="#20D9E8"
            emissiveIntensity={2.4} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* Right panel — CURRENTLY LEARNING */}
      <mesh position={[rightX, panelY(0.08, rightH), BZ + 0.025]}
        castShadow>
        <planeGeometry args={[rightW, rightH]} />
        <meshStandardMaterial map={rightTex} toneMapped={false}
          emissive="#ffffff" emissiveMap={rightTex} emissiveIntensity={0.22} />
      </mesh>
      {/* Purple glow border right */}
      {([
        [rightX, panelY(0.08, rightH) + rightH / 2 + 0.004, BZ + 0.027, rightW + 0.04, 0.009],
        [rightX, panelY(0.08, rightH) - rightH / 2 - 0.004, BZ + 0.027, rightW + 0.04, 0.009],
        [rightX - rightW / 2 - 0.004, panelY(0.08, rightH), BZ + 0.027, 0.009, rightH + 0.04],
        [rightX + rightW / 2 + 0.004, panelY(0.08, rightH), BZ + 0.027, 0.009, rightH + 0.04],
      ] as [number,number,number,number,number][]).map(([px,py,pz,pw,ph], i) => (
        <mesh key={i} position={[px,py,pz]}>
          <planeGeometry args={[pw, ph]} />
          <meshStandardMaterial color="#8a5ae8" emissive="#8a5ae8"
            emissiveIntensity={2.4} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* ── Hexagonal welcome platform — pushed back, not blocking walkway ── */}
      <HexPlatform />

      {/* ── Lighting ── */}
      <ambientLight intensity={1.6} color="#b8ccd4" />
    </group>
  );
}
