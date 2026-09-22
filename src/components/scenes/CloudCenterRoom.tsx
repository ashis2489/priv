/**
 * Cloud Center — ABOUT
 * Matches reference: large centre feature wall + left profile card + right quote card
 * + tech row + raised platform with laptop & mug + floor plants + warm spot lighting
 */
import { useMemo, useState } from "react";
import { SHELL } from "../scene/OpenWorldFloor";
import { siteConfig } from "../../config/site";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

const { W, D, H } = SHELL;
const BZ = -D / 2 + 0.04; // back wall Z

// ── canvas texture helpers ────────────────────────────────────────────────

function tex(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  draw(cv.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeFeatureWallTex() {
  return tex((ctx, w, h) => {
    // Dark background
    ctx.fillStyle = "#06080d";
    ctx.fillRect(0, 0, w, h);
    // Subtle radial glow
    const grd = ctx.createRadialGradient(w / 2, h * 0.38, 40, w / 2, h * 0.38, 520);
    grd.addColorStop(0, "rgba(78,205,196,0.08)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // "ABOUT" large ghost text
    ctx.font = "bold 160px Arial";
    ctx.fillStyle = "rgba(78,205,196,0.06)";
    ctx.textAlign = "center";
    ctx.fillText("ABOUT", w / 2, 220);
    // Teal top accent
    ctx.fillStyle = "#4ECDC4";
    ctx.fillRect(w / 2 - 300, 240, 600, 3);
    // Name
    ctx.font = "bold 82px Arial";
    ctx.fillStyle = "#eef4f8";
    ctx.fillText("FULL-STACK DEVELOPER", w / 2, 320);
    // Bio
    ctx.font = "32px Arial";
    ctx.fillStyle = "#6a8898";
    ctx.fillText("I build real products, solve real problems", w / 2, 380);
    ctx.fillText("and love turning ideas into reality.", w / 2, 420);
    // 4 info cards
    const cards = [
      { label: "EDUCATION",  value: "B.Tech CSE",      sub: "Computer Science\n& Engineering", color: "#4ECDC4" },
      { label: "FOCUS",      value: "Full-Stack Dev",   sub: "End-to-end development\nand problem solving", color: "#2DE2E6" },
      { label: "BUILDING",   value: "Real Products",    sub: "Projects that solve\nreal world problems", color: "#4ECDC4" },
      { label: "STATUS",     value: "Open to Work",     sub: "Looking for exciting\nopportunities", color: "#28C840" },
    ];
    const cw = 220, ch = 140, gap = 18;
    const totalW = cards.length * cw + (cards.length - 1) * gap;
    let cx = (w - totalW) / 2;
    const cy = 470;
    cards.forEach(card => {
      ctx.fillStyle = "rgba(14,20,32,0.9)";
      ctx.beginPath();
      ctx.roundRect(cx, cy, cw, ch, 8);
      ctx.fill();
      ctx.strokeStyle = card.color + "40";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = card.color;
      ctx.fillRect(cx, cy, cw, 4);
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "#506878";
      ctx.textAlign = "center";
      ctx.fillText(card.label, cx + cw / 2, cy + 34);
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = card.color;
      ctx.fillText(card.value, cx + cw / 2, cy + 72);
      ctx.font = "18px Arial";
      ctx.fillStyle = "#3a5060";
      const lines = card.sub.split("\n");
      lines.forEach((l, i) => ctx.fillText(l, cx + cw / 2, cy + 100 + i * 20));
      cx += cw + gap;
    });
    // "TECHNOLOGY I WORK WITH"
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "#3a5060";
    ctx.textAlign = "center";
    ctx.fillText("TECHNOLOGY  ", w / 2 - 30, 660);
    ctx.fillStyle = "#4ECDC4";
    ctx.fillText("          I WORK WITH", w / 2 + 30, 660);
    ctx.fillStyle = "#4ECDC4";
    ctx.fillRect(w / 2 - 200, 670, 400, 1.5);
    // Tech icons row
    const techs = ["NEXT.JS","REACT","NODE.JS","TAILWIND","MONGODB","GIT","DOCKER"];
    const tw2 = Math.floor((w - 80) / techs.length);
    techs.forEach((t, i) => {
      const tx2 = 40 + i * tw2 + tw2 / 2;
      ctx.fillStyle = "rgba(14,20,32,0.8)";
      ctx.beginPath();
      ctx.roundRect(40 + i * tw2, 690, tw2 - 12, 90, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(78,205,196,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#4ECDC4";
      ctx.textAlign = "center";
      ctx.fillText(t, tx2, 744);
    });
  }, 1024, 800);
}

function makeProfileCardTex() {
  return tex((ctx, w, h) => {
    ctx.fillStyle = "#060c14";
    ctx.fillRect(0, 0, w, h);
    // Teal border
    ctx.strokeStyle = "#4ECDC4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, w - 8, h - 8, 12);
    ctx.stroke();
    // Avatar circle
    ctx.fillStyle = "#0e1a28";
    ctx.beginPath();
    ctx.arc(w / 2, 110, 72, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4ECDC4";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Initials inside avatar
    ctx.font = "bold 52px Arial";
    ctx.fillStyle = "#4ECDC4";
    ctx.textAlign = "center";
    ctx.fillText("V", w / 2, 125);
    // Name
    ctx.font = "bold 38px Arial";
    ctx.fillStyle = "#eef4f8";
    ctx.fillText(siteConfig.name.toUpperCase(), w / 2, 228);
    // Role
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#4ECDC4";
    ctx.fillText(siteConfig.role.toUpperCase(), w / 2, 262);
    // Divider
    ctx.fillStyle = "#4ECDC4";
    ctx.fillRect(w / 2 - 80, 278, 160, 1.5);
    // Bio
    ctx.font = "20px Arial";
    ctx.fillStyle = "#5a7080";
    const bio = "Passionate developer who loves\nbuilding scalable web applications\nand delightful user experiences.";
    bio.split("\n").forEach((line, i) => ctx.fillText(line, w / 2, 310 + i * 28));
    // Social links
    const socials = ["GH", "in", "✉"];
    socials.forEach((s, i) => {
      const sx = w / 2 - 48 + i * 48;
      ctx.fillStyle = "rgba(78,205,196,0.12)";
      ctx.beginPath();
      ctx.arc(sx, 420, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(78,205,196,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#4ECDC4";
      ctx.fillText(s, sx, 426);
    });
  }, 320, 460);
}

function makeQuoteCardTex() {
  return tex((ctx, w, h) => {
    ctx.fillStyle = "#060c14";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#4ECDC4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, w - 8, h - 8, 12);
    ctx.stroke();
    // Big quote mark
    ctx.font = "bold 80px Georgia";
    ctx.fillStyle = "#4ECDC4";
    ctx.textAlign = "left";
    ctx.fillText("\"", 28, 100);
    // Quote text
    ctx.font = "28px Georgia";
    ctx.fillStyle = "#d0dce8";
    ctx.textAlign = "center";
    const lines = ["Code is not just", "what I write,", "it's how I solve", "problems."];
    lines.forEach((l, i) => ctx.fillText(l, w / 2, 130 + i * 42));
    // Attribution
    ctx.fillStyle = "#4ECDC4";
    ctx.fillRect(w / 2 - 40, 320, 80, 1.5);
    ctx.font = "italic 22px Arial";
    ctx.fillStyle = "#4a7080";
    ctx.fillText("— Vedaa", w / 2, 348);
  }, 320, 380);
}

// ── Side card ─────────────────────────────────────────────────────────────
function SideCard({ texData, w, h, x, y, z }: {
  texData: THREE.CanvasTexture; w: number; h: number;
  x: number; y: number; z: number;
}) {
  const { openPanel } = useStore();
  const [hov, setHov] = useState(false);
  return (
    <mesh position={[x, y, z]}
      onPointerEnter={() => { setHov(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHov(false); document.body.style.cursor = "auto"; }}
      onClick={() => openPanel("about")}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texData} toneMapped={false}
        emissive="#4ECDC4" emissiveIntensity={hov ? 0.12 : 0.04} roughness={0.3} />
    </mesh>
  );
}

// ── Raised platform ───────────────────────────────────────────────────────
function Platform() {
  return (
    <group position={[0, 0, -D / 2 + 1.9]}>
      {/* Main slab */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.28, 1.2]} />
        <meshStandardMaterial color="#0a0c12" roughness={0.45} metalness={0.18} />
      </mesh>
      {/* Front teal LED strip */}
      <mesh position={[0, 0.142, 0.602]}>
        <boxGeometry args={[3.6, 0.008, 0.008]} />
        <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4"
          emissiveIntensity={2.2} transparent opacity={0.85} />
      </mesh>
      {/* Teal glow from strip */}
    

      {/* Laptop on platform */}
      <group position={[0, 0.285, -0.05]}>
        {/* Base */}
        <mesh castShadow>
          <boxGeometry args={[0.52, 0.018, 0.36]} />
          <meshStandardMaterial color="#0e1018" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Lid open ~110° */}
        <group position={[0, 0.018, -0.155]} rotation={[-1.1, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.018, 0.34]} />
            <meshStandardMaterial color="#0e1018" roughness={0.2} metalness={0.85} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.018, 0.01]}>
            <planeGeometry args={[0.47, 0.30]} />
            <meshStandardMaterial color="#010810" emissive="#4ECDC4"
              emissiveIntensity={0.45} roughness={0.05} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* Mug */}
      <group position={[0.72, 0.285, 0.08]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.12, 14]} />
          <meshStandardMaterial color="#1a1418" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.01, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#1a1418" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Coffee surface */}
        <mesh position={[0, 0.058, 0]}>
          <circleGeometry args={[0.055, 14]} />
          <meshStandardMaterial color="#2a1808" roughness={0.9} />
        </mesh>
      </group>

      {/* Small plant */}
      <group position={[-0.76, 0.285, 0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.036, 0.09, 8]} />
          <meshStandardMaterial color="#281c0c" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <sphereGeometry args={[0.065, 7, 5]} />
          <meshStandardMaterial color="#284018" roughness={0.86} />
        </mesh>
      </group>
    </group>
  );
}

// ── Spot light fixture on ceiling ─────────────────────────────────────────
function SpotFixture({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, H - 0.01, z]}>
      <mesh>
        <cylinderGeometry args={[0.055, 0.04, 0.06, 10]} />
        <meshStandardMaterial color="#141414" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, -0.035, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.04, 0.06, 10]} />
        <meshStandardMaterial color="#101010" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.03, 10]} />
        <meshStandardMaterial color="#fff8e8" emissive="#fff8e8" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

export function CloudCenterRoom() {
  const featureTex  = useMemo(() => makeFeatureWallTex(),  []);
  const profileTex  = useMemo(() => makeProfileCardTex(),  []);
  const quoteTex    = useMemo(() => makeQuoteCardTex(),    []);
  const { openPanel } = useStore();

  // Feature wall: centred, spans most of the back wall
  const fwW = 5.8, fwH = 2.55;
  const fwY = fwH / 2 + 0.2;   // bottom of panel at Y=0.2

  // Side cards: same Y range as feature wall
  const cardH = 1.62;
  const cardW = 1.08;
  const cardY = cardH / 2 + 0.2;

  return (
    <group>
      {/* ── Ceiling spot fixtures ── */}
      <SpotFixture x={-1.8} z={-1.2} />
      <SpotFixture x={ 1.8} z={-1.2} />
      <SpotFixture x={ 0}   z={-0.6} />

      {/* ── Ceiling spot lights — warm white hitting the wall ── */}
      <pointLight position={[-1.8, H - 0.08, -0.8]}
        intensity={4.0} color="#fff4e0" distance={5} decay={2} castShadow />
      <pointLight position={[ 1.8, H - 0.08, -0.8]}
        intensity={4.0} color="#fff4e0" distance={5} decay={2} />
      <pointLight position={[0, H - 0.08, -0.5]}
        intensity={3.5} color="#fff4e0" distance={5} decay={2} />

      {/* ── General room fill ── */}
      <ambientLight intensity={1.6} color="#b8c8d4" />

      {/* ── Back wall — dark backing, plane only (no side faces bleeding into corridor) ── */}
      <mesh position={[0, H / 2, BZ - 0.018]}>
        <planeGeometry args={[W - 0.1, H]} />
        <meshStandardMaterial color="#05070c" roughness={0.6} metalness={0.2} side={THREE.FrontSide} />
      </mesh>

      {/* Teal top accent — plane only */}
      <mesh position={[0, H - 0.04, BZ + 0.002]}>
        <planeGeometry args={[W - 0.2, 0.007]} />
        <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4"
          emissiveIntensity={1.8} transparent opacity={0.7} />
      </mesh>
      {/* Teal bottom accent — plane only */}
      <mesh position={[0, 0.04, BZ + 0.002]}>
        <planeGeometry args={[W - 0.2, 0.006]} />
        <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4"
          emissiveIntensity={1.0} transparent opacity={0.5} />
      </mesh>
      {/* Floor base strip — plane only */}
      <mesh position={[0, 0.015, BZ - 0.018]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.1, 0.08]} />
        <meshStandardMaterial color="#030508" roughness={0.5} metalness={0.5} side={THREE.FrontSide} />
      </mesh>

      {/* ── Feature wall canvas (centre) ── */}
      <mesh position={[0, fwY, BZ + 0.025]}
        onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { document.body.style.cursor = "auto"; }}
        onClick={() => openPanel("about")}>
        <planeGeometry args={[fwW, fwH]} />
        <meshStandardMaterial map={featureTex} toneMapped={false}
          emissive="#ffffff" emissiveMap={featureTex} emissiveIntensity={0.4} />
      </mesh>

      {/* Feature wall teal glow edge — top only, as a plane */}
      <mesh position={[0, fwY + fwH / 2 + 0.002, BZ + 0.024]}>
        <planeGeometry args={[fwW + 0.04, 0.008]} />
        <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4"
          emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>

      {/* ── Left profile card ── */}
      <SideCard texData={profileTex}
        w={cardW} h={cardH}
        x={-(fwW / 2 + cardW / 2 + 0.12)} y={cardY} z={BZ + 0.025} />

      {/* ── Right quote card ── */}
      <SideCard texData={quoteTex}
        w={cardW} h={cardH * 0.78}
        x={ fwW / 2 + cardW / 2 + 0.12} y={cardY * 0.88} z={BZ + 0.025} />

      {/* ── Raised platform with laptop, mug ── */}
      <Platform />
    </group>
  );
}
