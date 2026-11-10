import { useEffect, useRef, useState } from "react";
import { useStore } from "../../store/useStore";

const GRAVITY = 0.35;
const JUMP = -5.8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 2.5;
const CANVAS_W = 360;
const CANVAS_H = 280;
const BIRD_X = 60;
const BIRD_W = 28;
const BIRD_H = 18;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

export function ArcadeOverlay() {
  const { setArcadeActive } = useStore();

  // ── React state for display only ──────────────────────────────────────
  const [displayScore, setDisplayScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // ── canvas ────────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ── game state (refs – mutable, no re-renders needed) ─────────────────
  const playerY = useRef(CANVAS_H / 2);
  const playerVy = useRef(0);
  const playerRot = useRef(0);
  const frame = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const score = useRef(0);
  const rafRef = useRef<number>(0);
  // Phase mirrors of the React state — the rAF loop reads these, not the
  // state itself (the loop's []-deps closure would go stale otherwise).
  const startedRef = useRef(false);
  const gameOverRef = useRef(false);

  // ── jump input ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        playerVy.current = JUMP;
        playerRot.current = -0.3;
      }
      if (e.key === "Enter") {
        if (isGameOver) restart();
        else if (!isStarted) start();
      }
    };
    const onPointer = () => {
      playerVy.current = JUMP;
      playerRot.current = -0.3;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onPointer);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [isStarted, isGameOver]);

  // ── start game ────────────────────────────────────────────────────────
  const start = () => {
    playerY.current = CANVAS_H / 2;
    playerVy.current = 0;
    playerRot.current = 0;
    pipes.current.length = 0;
    score.current = 0;
    frame.current = 0;
    startedRef.current = true;
    gameOverRef.current = false;
    pipes.current.push({
      x: CANVAS_W + 20,
      topH: Math.random() * (CANVAS_H - PIPE_GAP - 80) + 40,
      scored: false,
    });
    setIsStarted(true);
    setIsGameOver(false);
    setDisplayScore(0);
  };

  const restart = () => {
    start();
  };

  // ── main animation loop (persistent) ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctxRef.current = ctx;

    const loop = () => {
      frame.current++;

      // physics only during active play (title screen bird stays put)
      if (startedRef.current && !gameOverRef.current) {
        playerVy.current += GRAVITY;
        playerY.current += playerVy.current;
        playerRot.current += (playerVy.current > 0 ? 0.15 : -0.15);
      }
      playerRot.current = Math.max(-0.5, Math.min(0.5, playerRot.current));

      // clear
      ctx.fillStyle = "#02080f";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // grid
      ctx.strokeStyle = "rgba(45,226,230,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
      }

      if (startedRef.current && !gameOverRef.current) {
        // ── spawn / move pipes ─────────────────────────────────────────────
        if (frame.current % 90 === 0) {
          pipes.current.push({
            x: CANVAS_W + 20,
            topH: Math.random() * (CANVAS_H - PIPE_GAP - 80) + 40,
            scored: false,
          });
        }

        pipes.current.forEach((pipe) => {
          pipe.x -= PIPE_SPEED;

          // draw top pipe
          ctx.fillStyle = "#e33d3d";
          ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);

          // draw bottom pipe
          ctx.fillStyle = "#e33d3d";
          ctx.fillRect(pipe.x, pipe.topH + PIPE_GAP, PIPE_WIDTH, CANVAS_H - pipe.topH - PIPE_GAP);

          // ── collision: bird x range [BIRD_X, BIRD_X+BIRD_W] = [60, 88] ──
          const birdLeft = BIRD_X;
          const birdRight = BIRD_X + BIRD_W;
          const birdTop = playerY.current;
          const birdBottom = playerY.current + BIRD_H;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          const xOverlap = birdRight > pipeLeft && birdLeft < pipeRight;
          const inGap = birdTop >= pipe.topH && birdBottom <= pipe.topH + PIPE_GAP;

          if (xOverlap && !inGap) {
            gameOverRef.current = true;
            setIsGameOver(true);
            return;
          }

          // score when bird passes pipe
          if (pipe.x + PIPE_WIDTH < BIRD_X && !pipe.scored) {
            pipe.scored = true;
            score.current++;
            setDisplayScore(score.current);
          }
        });

        // remove off-screen pipes
        pipes.current = pipes.current.filter(p => p.x + PIPE_WIDTH < 0);

        // ── ground/ceiling collision ─────────────────────────────────────
        if (playerY.current + BIRD_H > CANVAS_H || playerY.current < 0) {
          gameOverRef.current = true;
          setIsGameOver(true);
        }
      }

      // ── draw bird ──────────────────────────────────────────────────────
      const birdY = playerY.current;
      ctx.save();
      ctx.translate(BIRD_X + BIRD_W / 2, birdY + BIRD_H / 2);
      ctx.rotate(playerRot.current);
      ctx.translate(-(BIRD_X + BIRD_W / 2), -(birdY + BIRD_H / 2));

      ctx.fillStyle = "#2DE2E6";
      ctx.shadowColor = "#2DE2E6";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(BIRD_X + BIRD_W / 2, birdY);
      ctx.lineTo(BIRD_X + BIRD_W, birdY + BIRD_H);
      ctx.lineTo(BIRD_X, birdY + BIRD_H);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // ── draw overlays ──────────────────────────────────────────────────
      if (gameOverRef.current) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#FF4D6D";
        ctx.font = "bold 20px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 16);
        ctx.fillStyle = "#7ee9f5";
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.fillText(`SCORE: ${score.current}`, CANVAS_W / 2, CANVAS_H / 2 + 12);
        ctx.fillStyle = "#8FA2B5";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Press ENTER to restart", CANVAS_W / 2, CANVAS_H / 2 + 34);
      } else if (!startedRef.current) {
        ctx.fillStyle = "#2DE2E6";
        ctx.font = "bold 18px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY BIRD", CANVAS_W / 2, CANVAS_H / 2 - 20);
        ctx.fillStyle = "#8FA2B5";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("SPACE or CLICK to jump", CANVAS_W / 2, CANVAS_H / 2 + 10);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // ← runs once on mount, persists

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
            <span>SCORE: <span style={{ color: "#7ee9f5" }}>{displayScore}</span></span>
            <button
              onClick={() => setArcadeActive(false)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"
              style={{ color: "#8FA2B5" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />

          {/* Start overlay */}
          {!isStarted && (
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

          {/* Game over overlay */}
          {isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ color: "#fff", fontFamily: "JetBrains Mono, monospace" }}>
                <div style={{ position: "absolute", top: 20, left: 20 }}>
                  <button
                    onClick={restart}
                    style={{
                      marginTop: "20px",
                      padding: "8px 16px",
                      background: "rgba(255,77,109,0.2)",
                      border: "1px solid rgba(255,77,109,0.5)",
                      borderRadius: "6px",
                      color: "#FF4D6D",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Restart
                  </button>
                </div>
                <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50)", fontSize: "14px" }}>
                  Score: {score.current}
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div
            className="px-5 py-2.5 text-center text-xs"
            style={{
              color: "#8FA2B5",
              fontFamily: "JetBrains Mono, monospace",
              borderTop: "1px solid rgba(255,77,109,0.1)",
            }}
          >
            SPACE or CLICK JUMP &nbsp;|&nbsp; ENTER START/RESTART
          </div>
        </div>
      </div>
    </div>
  );
}