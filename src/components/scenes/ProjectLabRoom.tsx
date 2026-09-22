/**
 * Project Lab — PROJECTS
 * Gallery/studio aesthetic: three project screens wall-mounted in deep recessed niches,
 * a shared presentation desk running the full width, task lighting per station.
 * Every object is grounded. No floating geometry.
 */
import { useState, useMemo } from "react";
import { SHELL } from "../scene/OpenWorldFloor";
import { projects } from "../../data/projects";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

const { W, D, H } = SHELL;

const WOOD  = "#4a3627";


function makeLabelTex(l1: string, l2: string, c1: string, c2: string): THREE.CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
  const ctx = cv.getContext('2d')!; ctx.clearRect(0, 0, 512, 128);
  ctx.font = '700 52px Arial'; ctx.fillStyle = c1; ctx.textAlign = 'center'; ctx.fillText(l1, 256, 56);
  ctx.font = '400 26px Arial'; ctx.fillStyle = c2; ctx.fillText(l2, 256, 96);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeNumTex(num: string, color: string): THREE.CanvasTexture {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 64;
  const ctx = cv.getContext('2d')!; ctx.clearRect(0, 0, 128, 64);
  ctx.font = '700 36px monospace'; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(num, 64, 44);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ── Canvas texture for each project screen ──────────────────────────────
function makeProjectTex(p: typeof projects[0]): THREE.CanvasTexture {
  const cw = 640, ch = 400;
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, cw, ch);
  bg.addColorStop(0, "#091321");
  bg.addColorStop(0.58, "#101722");
  bg.addColorStop(1, "#080b10");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);

  // Top bar
  ctx.fillStyle = p.color + "18";
  ctx.fillRect(0, 0, cw, 54);
  ctx.fillStyle = p.color;
  ctx.fillRect(0, 52, cw, 2);

  // Number
  ctx.font = "bold 18px monospace";
  ctx.fillStyle = p.color + "90";
  ctx.textAlign = "left";
  ctx.fillText(p.number, 24, 34);

  // Status
  const status = p.status.toUpperCase();
  ctx.font = "bold 12px monospace";
  const statusW = ctx.measureText(status).width + 26;
  ctx.fillStyle = p.color + "22";
  ctx.fillRect(cw - statusW - 24, 17, statusW, 22);
  ctx.strokeStyle = p.color + "55";
  ctx.strokeRect(cw - statusW - 24, 17, statusW, 22);
  ctx.fillStyle = p.color;
  ctx.textAlign = "center";
  ctx.fillText(status, cw - statusW / 2 - 24, 32);
  ctx.textAlign = "left";

  // Title
  ctx.font = "bold 34px Arial";
  ctx.fillStyle = "#f5f1e8";
  ctx.fillText(p.title, 24, 102);

  // Separator
  ctx.fillStyle = p.color + "50";
  ctx.fillRect(24, 118, cw - 48, 1);

  // Description — wrapped
  ctx.font = "16px Arial";
  ctx.fillStyle = "#b5c2cc";
  const words = p.description.split(" ");
  let line = "", y = 148;
  for (const w of words) {
    const t = line + w + " ";
    if (ctx.measureText(t).width > cw - 48 && line) {
      ctx.fillText(line, 24, y); line = w + " "; y += 23;
    } else line = t;
  }
  ctx.fillText(line, 24, y); y += 36;

  // Tech chips
  let cx2 = 24;
  p.tech.slice(0, 5).forEach(t => {
    ctx.font = "12px monospace";
    const tw = ctx.measureText(t).width + 20;
    ctx.fillStyle = p.color + "15";
    ctx.fillRect(cx2, y, tw, 22);
    ctx.strokeStyle = p.color + "50";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx2, y, tw, 22);
    ctx.fillStyle = p.color;
    ctx.textAlign = "center";
    ctx.fillText(t, cx2 + tw / 2, y + 14);
    ctx.textAlign = "left";
    cx2 += tw + 6;
  });
  y += 38;

  // CTA
  ctx.font = "bold 14px monospace";
  ctx.fillStyle = p.color;
  ctx.textAlign = "center";
  ctx.fillText("OPEN PROJECT", cw / 2, ch - 26);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ── Recessed project niche + wall-mounted screen ────────────────────────
function ProjectNiche({
  project, posX,
}: { project: typeof projects[0]; posX: number }) {
  const [hov, setHov] = useState(false);
  const { openPanel } = useStore();
  const tex = useMemo(() => makeProjectTex(project), [project]);
  const numTex = useMemo(() => makeNumTex(project.number, project.color), [project.number, project.color]);

  const Z  = -D / 2 + 0.72;    // staged slightly inside the open room shell
  const NW = 2.72;             // niche width
  const NH = 1.62;             // niche height
  const ND = 0.12;             // niche depth (recess into wall)
  const NY = 1.48;             // niche centre Y

  return (
    <group position={[posX, 0, 0]}>
      {/* Niche recess — dark box cut into wall */}
      <mesh position={[0, NY, Z + ND / 2]}>
        <boxGeometry args={[NW, NH, ND]} />
        <meshStandardMaterial color="#0b111a" roughness={0.82} />
      </mesh>
      {/* Niche top/bottom/side inner reveals */}
      {/* Top reveal */}
      <mesh position={[0, NY + NH / 2 - 0.015, Z + ND / 2]}>
        <boxGeometry args={[NW, 0.03, ND]} />
        <meshStandardMaterial color="#111318" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Bottom reveal */}
      <mesh position={[0, NY - NH / 2 + 0.015, Z + ND / 2]}>
        <boxGeometry args={[NW, 0.03, ND]} />
        <meshStandardMaterial color="#111318" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Left reveal */}
      <mesh position={[-NW / 2 + 0.015, NY, Z + ND / 2]}>
        <boxGeometry args={[0.03, NH, ND]} />
        <meshStandardMaterial color="#111318" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Right reveal */}
      <mesh position={[NW / 2 - 0.015, NY, Z + ND / 2]}>
        <boxGeometry args={[0.03, NH, ND]} />
        <meshStandardMaterial color="#111318" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Monitor frame — wall-mounted inside niche */}
      <mesh position={[0, NY, Z + ND - 0.02]} castShadow>
        <boxGeometry args={[NW - 0.12, NH - 0.12, 0.04]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Screen */}
      <mesh
        position={[0, NY, Z + ND + 0.002]}
        onPointerEnter={() => { setHov(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setHov(false); document.body.style.cursor = "auto"; }}
        onClick={() => openPanel("project", project)}
      >
        <planeGeometry args={[NW - 0.18, NH - 0.18]} />
        <meshBasicMaterial map={tex} color={hov ? "#ffffff" : "#f1f7f8"} toneMapped={false} />
      </mesh>

      {/* Colour accent strip — top of niche */}
      <mesh position={[0, NY + NH / 2 + 0.005, Z + 0.005]}>
        <boxGeometry args={[NW, 0.006, 0.006]} />
        <meshStandardMaterial color={project.color} emissive={project.color}
          emissiveIntensity={1.8} transparent opacity={0.7} />
      </mesh>

      {/* Project number nameplate — below niche */}
      <mesh position={[0, NY - NH / 2 - 0.08, Z + 0.01]}>
        <boxGeometry args={[0.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#111318" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, NY - NH / 2 - 0.08, Z + 0.026]}><planeGeometry args={[0.55, 0.2]} /><meshStandardMaterial map={numTex} toneMapped={false} transparent /></mesh>

    </group>
  );
}

// ── Shared presentation desk ────────────────────────────────────────────
function PresentationDesk() {
  return (
    <group position={[0, 0, -2.15]}>
      {/* Surface — full width */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[W - 1.55, 0.045, 0.36]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} metalness={0.04} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[W - 1.55, 0.14, 0.3]} />
        <meshStandardMaterial color="#33271d" roughness={0.82} metalness={0.03} />
      </mesh>
      {/* Baseboard */}
      <mesh position={[0, 0.225, 0.15]}>
        <boxGeometry args={[W - 1.55, 0.035, 0.03]} />
        <meshStandardMaterial color="#1c1a17" roughness={0.8} />
      </mesh>
      {/* 2 leg dividers */}
      {[-3.2, 3.2].map((x, i) => (
        <mesh key={i} position={[x, 0.37, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.28]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      {/* Under-desk LED strip — warm */}
      <mesh position={[0, 0.415, 0.2]}>
        <boxGeometry args={[W - 1.4, 0.005, 0.005]} />
        <meshStandardMaterial color="#ffe8b0" emissive="#ffe8b0"
          emissiveIntensity={1.0} transparent opacity={0.5} />
      </mesh>
      {/* 3 keyboards on surface */}
      {[-3.0, 0, 3.0].map((x, i) => (
        <mesh key={i} position={[x, 0.447, 0.08]} castShadow>
          <boxGeometry args={[0.4, 0.012, 0.14]} />
          <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function ProjectLabRoom() {
  const posXs = [-3.05, 0, 3.05] as const;
  const titleTex = useMemo(() => makeLabelTex("PROJECT LAB", "FEATURED WORK", "#1d8892", "#61717a"), []);

  return (
    <group>
      {/* room shell rendered by OpenWorldFloor RoomBox */}

      {/* Gallery backing wall, staged inside the open shell */}
      <mesh position={[0, 1.52, -D / 2 + 0.54]} receiveShadow>
        <boxGeometry args={[9.35, 2.26, 0.1]} />
        <meshStandardMaterial color="#d8d4ca" roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.44, -D / 2 + 0.62]}>
        <boxGeometry args={[9.1, 0.08, 0.08]} />
        <meshStandardMaterial color="#25292f" roughness={0.6} metalness={0.12} />
      </mesh>
      <mesh position={[0, H - 0.38, -D / 2 + 0.62]}>
        <boxGeometry args={[9.1, 0.04, 0.08]} />
        <meshStandardMaterial color="#c9b184" roughness={0.5} metalness={0.08} />
      </mesh>

      {/* Room title — canvas plane */}
      <mesh position={[0, H - 0.74, -D / 2 + 0.67]}>
        <planeGeometry args={[2.2, 0.5]} />
        <meshStandardMaterial map={titleTex} toneMapped={false} transparent />
      </mesh>

      {/* Project niches — three wall-mounted screens */}
      {projects.map((p, i) => (
        <ProjectNiche key={p.id} project={p} posX={posXs[i]} />
      ))}

      {/* Dark runner anchors the display area and adds contrast to pale floors */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, -1.75]} receiveShadow>
        <planeGeometry args={[8.6, 2.05]} />
        <meshStandardMaterial color="#303844" roughness={0.92} />
      </mesh>

      {/* Shared presentation desk */}
      <PresentationDesk />

      {/* Wall lighting above screens */}
      <pointLight position={[0, H - 0.4, -D / 2 + 1.0]}
        intensity={2.0} color="#e0dcd4" distance={8} decay={1.6} />
      <pointLight position={[0, 2.2, 1.5]}
        intensity={1.4} color="#e8e4dc" distance={6} decay={2} />
    </group>
  );
}
