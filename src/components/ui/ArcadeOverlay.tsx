import { useEffect, useRef, useState } from "react";
import { useStore } from "../../store/useStore";

const GRAVITY = 0.35;
const JUMP = -5.8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 115; // was 180 — left only 40px stubs for pipes, invisible as hurdles
const PIPE_SPEED = 2.5;
const PIPE_EVERY = 75; // frames between spawns (was 90)
const CANVAS_W = 360;
const CANVAS_H = 280;
const BIRD_X = 60;
const BIRD_W = 28;
const BIRD_H = 18;

type Phase = "title" | "playing" | "dead";

export interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

/** Pipe height leaves PIPE_GAP for the bird, ≥35px of pipe above and below. */
const makePipe = (x: number): Pipe => ({
  x,
  topH: 35 + Math.random() * (CANVAS_H - PIPE_GAP - 70),
  scored: false,
});

/** Pure collision: does a bird spanning [birdTop, birdBottom] hit this pipe? */
export function hitsPipe(birdTop: number, birdBottom: number, pipe: Pipe): boolean {
  const xOverlap = BIRD_X + BIRD_W > pipe.x && BIRD_X < pipe.x + PIPE_WIDTH;
  const inGap = birdTop >= pipe.topH && birdBottom <= pipe.topH + PIPE_GAP;
  return xOverlap && !inGap;
}

export function ArcadeOverlay() {
  const { setArcadeActive } = useStore();

  const [displayScore, setDisplayScore] = useState(0);
  const [phase, setPhaseState] = useState<Phase>("title");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("title");
  const playerY = useRef(CANVAS_H / 2 - BIRD_H / 2);
  const playerVy = useRef(0);
  const playerRot = useRef(0);
  const frame = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const score = useRef(0);
  const rafRef = useRef(0);

  // One setter keeps the rAF loop's ref and the JSX state in sync.
  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  const start = () => {
    playerY.current = CANVAS_H / 2 - BIRD_H / 2;
    playerVy.current = JUMP; // initial hop — never start by free-falling
    playerRot.current = -0.3;
    pipes.current = [makePipe(CANVAS_W - 30)]; // first hurdle already on screen
    score.current = 0;
    frame.current = 0;
    setDisplayScore(0);
    setPhase("playing");
  };

  // Space / click / tap: jump while playing, start or restart otherwise.
  const action = () => {
    if (phaseRef.current === "playing") {
      playerVy.current = JUMP;
      playerRot.current = -0.3;
    } else {
      start();
    }
  };

  // ── input (registered once; all handlers read refs) ────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "Enter") {
        e.preventDefault();
        action();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest("button")) return; // buttons handle themselves
      action();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  // ── single persistent animation loop ───────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      // ── simulate ────────────────────────────────────────────────────────
      if (phaseRef.current === "playing") {
        frame.current++;

        playerVy.current += GRAVITY;
        playerY.current += playerVy.current;
        playerRot.current += playerVy.current > 0 ? 0.15 : -0.15;
        playerRot.current = Math.max(-0.5, Math.min(0.5, playerRot.current));

        // ceiling clamps (not death); ground is death
        if (playerY.current < 0) {
          playerY.current = 0;
          if (playerVy.current < 0) playerVy.current = 0;
        }

        if (frame.current % PIPE_EVERY === 0) {
          pipes.current.push(makePipe(CANVAS_W + 20));
        }

        for (const pipe of pipes.current) {
          pipe.x -= PIPE_SPEED;
          if (hitsPipe(playerY.current, playerY.current + BIRD_H, pipe)) {
            phaseRef.current = "dead";
            setPhase("dead");
            setDisplayScore(score.current);
            break;
          }
          if (pipe.x + PIPE_WIDTH < BIRD_X && !pipe.scored) {
            pipe.scored = true;
            score.current++;
            setDisplayScore(score.current);
          }
        }
        pipes.current = pipes.current.filter((p) => p.x + PIPE_WIDTH > 0);

        if (playerY.current + BIRD_H >= CANVAS_H) {
          playerY.current = CANVAS_H - BIRD_H;
          phaseRef.current = "dead";
          setPhase("dead");
          setDisplayScore(score.current);
        }
      }

      // ── draw (pipes stay visible frozen behind title/game-over) ─────────
      ctx.fillStyle = "#02080f";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.strokeStyle = "rgba(45,226,230,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
      }

      for (const pipe of pipes.current) {
        ctx.fillStyle = "#e33d3d";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);
        ctx.fillRect(pipe.x, pipe.topH + PIPE_GAP, PIPE_WIDTH, CANVAS_H - pipe.topH - PIPE_GAP);
        // caps so the gap edges read clearly
        ctx.fillStyle = "#ff6b6b";
        ctx.fillRect(pipe.x - 4, pipe.topH - 10, PIPE_WIDTH + 8, 10);
        ctx.fillRect(pipe.x - 4, pipe.topH + PIPE_GAP, PIPE_WIDTH + 8, 10);
      }

      // ground strip so falling out of the world is visible
      ctx.fillStyle = "#0d1420";
      ctx.fillRect(0, CANVAS_H - 6, CANVAS_W, 6);
      ctx.fillStyle = "rgba(45,226,230,0.35)";
      ctx.fillRect(0, CANVAS_H - 7, CANVAS_W, 1);

      // bird
      const by = playerY.current;
      ctx.save();
      ctx.translate(BIRD_X + BIRD_W / 2, by + BIRD_H / 2);
      ctx.rotate(playerRot.current);
      ctx.translate(-(BIRD_X + BIRD_W / 2), -(by + BIRD_H / 2));
      ctx.fillStyle = "#2DE2E6";
      ctx.shadowColor = "#2DE2E6";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(BIRD_X + BIRD_W / 2, by);
      ctx.lineTo(BIRD_X + BIRD_W, by + BIRD_H);
      ctx.lineTo(BIRD_X, by + BIRD_H);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#041018";
      ctx.beginPath();
      ctx.arc(BIRD_X + BIRD_W - 9, by + 6, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (phaseRef.current === "title") {
        ctx.fillStyle = "#2DE2E6";
        ctx.font = "bold 20px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY BIRD", CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.fillStyle = "#8FA2B5";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("SPACE or TAP to jump", CANVAS_W / 2, CANVAS_H / 2);
        ctx.fillStyle = "#40565f";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("fly through the gaps", CANVAS_W / 2, CANVAS_H / 2 + 20);
      } else if (phaseRef.current === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#FF4D6D";
        ctx.font = "bold 22px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 20);
        ctx.fillStyle = "#7ee9f5";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`SCORE: ${score.current}`, CANVAS_W / 2, CANVAS_H / 2 + 8);
        ctx.fillStyle = "#8FA2B5";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("SPACE / ENTER to restart", CANVAS_W / 2, CANVAS_H / 2 + 32);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(2,6,12,0.9)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-2xl overflow-hidden fade-in"
        style={{
          background: "#020810",
          border: "1px solid rgba(255,77,109,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,77,109,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: "rgba(7,17,31,0.8)",
            borderBottom: "1px solid rgba(255,77,109,0.15)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <div className="text-sm font-bold" style={{ color: "#2DE2E6" }}>
            🕊️ FLAPPY BIRD
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#8FA2B5" }}>
            <span>
              SCORE: <span style={{ color: "#7ee9f5" }}>{displayScore}</span>
            </span>
            <button
              onClick={() => setArcadeActive(false)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"
              style={{ color: "#8FA2B5" }}
              aria-label="Close game"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />

          {phase === "title" && (
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <button
                onClick={start}
                className="px-6 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#FF4D6D",
                  background: "rgba(255,77,109,0.1)",
                  border: "1px solid rgba(255,77,109,0.4)",
                  letterSpacing: "0.15em",
                }}
              >
                PRESS START
              </button>
            </div>
          )}

          {phase === "dead" && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <button
                onClick={start}
                style={{
                  padding: "8px 20px",
                  background: "rgba(255,77,109,0.2)",
                  border: "1px solid rgba(255,77,109,0.5)",
                  borderRadius: "6px",
                  color: "#FF4D6D",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                RESTART
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div
          className="px-5 py-2.5 text-center text-xs"
          style={{
            color: "#8FA2B5",
            fontFamily: "JetBrains Mono, monospace",
            borderTop: "1px solid rgba(255,77,109,0.1)",
          }}
        >
          SPACE / CLICK / TAP JUMP &nbsp;|&nbsp; ENTER RESTART
        </div>
      </div>
    </div>
  );
}
