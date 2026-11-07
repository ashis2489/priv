import { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "../../store/useStore";

const GRAVITY = 0.35;
const JUMP = -5.8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 2.5;
const CANVAS_W = 360;
const CANVAS_H = 280;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

export function ArcadeOverlay() {
  const { setArcadeActive } = useStore();

  // ── React state ──────────────────────────────────────────────────────
  const [isStarted, setIsStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  // ── canvas ────────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ── game state (ref – imperative) ────────────────────────────────────
  const player = useRef({ y: CANVAS_H / 2, vy: 0, rotated: 0 });
  const frame = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const score = useRef(0);
  const highScore = useRef(0);

  // ── input: space / click to jump ──────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        player.current.vy = JUMP;
        player.current.rotated = -0.3;
      }
    };
    const onPointer = () => {
      player.current.vy = JUMP;
      player.current.rotated = -0.3;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onPointer);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  // ── spawn first pipe when game starts ─────────────────────────────────
  useEffect(() => {
    if (isStarted && pipes.current.length === 0) {
      pipes.current.push({
        x: CANVAS_W,
        topH: Math.random() * (CANVAS_H - PIPE_GAP - 80) + 40,
        scored: false,
      });
    }
  }, [isStarted]);

  // ── animation loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isStarted && !isGameOver) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      ctxRef.current = canvas.getContext("2d")!;

      const loop = () => {
        frame.current++;

        // gravity
        player.current.vy += GRAVITY;
        player.current.y += player.current.vy;
        // tilt based on velocity
        player.current.rotated +=
          (player.current.vy > 0 ? 0.15 : -0.15) || 0.05;
        player.current.rotated = Math.max(
          -0.5,
          Math.min(0.5, player.current.rotated),
        );

        // clear
        ctxRef.current!.fillStyle = "#02080f";
        ctxRef.current!.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // grid bg
        ctxRef.current!.strokeStyle = "rgba(45,226,230,0.05)";
        ctxRef.current!.lineWidth = 1;
        for (let x = 0; x < CANVAS_W; x += 30) {
          ctxRef.current!.beginPath(); ctxRef.current!.moveTo(x, 0); ctxRef.current!.lineTo(x, CANVAS_H); ctxRef.current!.stroke();
        }
        for (let y = 0; y < CANVAS_H; y += 30) {
          ctxRef.current!.beginPath(); ctxRef.current!.moveTo(0, y); ctxRef.current!.lineTo(CANVAS_W, y); ctxRef.current!.stroke();
        }

        // ── spawn / move pipes ─────────────────────────────────────────────
        if (frame.current % 90 === 0) {
          pipes.current.push({
            x: CANVAS_W + 20,
            topH: Math.random() * (CANVAS_H - PIPE_GAP - 80) + 40,
            scored: false,
          });
        }

        pipes.current.forEach((pipe, _pi) => {
          pipe.x -= PIPE_SPEED;

          // top pipe
          ctxRef.current!.fillStyle = "#e33d3d";
          ctxRef.current!.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);

          // bottom pipe
          ctxRef.current!.fillStyle = "#e33d3d";
          ctxRef.current!.fillRect(
            pipe.x,
            pipe.topH + PIPE_GAP,
            PIPE_WIDTH,
            CANVAS_H - pipe.topH - PIPE_GAP,
          );

          // collision
          if (
            pipe.x < 36 &&
            pipe.x + PIPE_WIDTH > 0 &&
            (player.current.y < pipe.topH ||
              player.current.y > pipe.topH + PIPE_GAP)
          ) {
            setIsGameOver(true);
            highScore.current = Math.max(highScore.current, score.current);
            setDisplayScore(score.current);
          }

          // score when bird passes
          if (
            pipe.x + PIPE_WIDTH < 30 &&
            !pipe.scored
          ) {
            pipe.scored = true;
            score.current++;
            setDisplayScore(score.current);
          }
        });

        // remove off-screen pipes
        pipes.current = pipes.current.filter(p => p.x + PIPE_WIDTH < 0);

        // ── draw player (bird) ─────────────────────────────────────────────
        const birdX = 60;
        const birdY = player.current.y;
        const birdW = 28;
        const birdH = 18;

        ctxRef.current!.save();
        ctxRef.current!.translate(birdX + birdW / 2, birdY + birdH / 2);
        ctxRef.current!.rotate(player.current.rotated);
        ctxRef.current!.translate(-(birdX + birdW / 2), -(birdY + birdH / 2));

        ctxRef.current!.fillStyle = "#2DE2E6";
        ctxRef.current!.shadowColor = "#2DE2E6";
        ctxRef.current!.shadowBlur = 10;

        // body
        ctxRef.current!.beginPath();
        ctxRef.current!.moveTo(birdX + birdW / 2, birdY);
        ctxRef.current!.lineTo(birdX + birdW, birdY + birdH);
        ctxRef.current!.lineTo(birdX, birdY + birdH);
        ctxRef.current!.closePath();
        ctxRef.current!.fill();

        ctxRef.current!.shadowBlur = 0;
        ctxRef.current!.restore();

        // ── game over overlay ──────────────────────────────────────────────
        if (isGameOver) {
          ctxRef.current!.fillStyle = "rgba(0,0,0,0.7)";
          ctxRef.current!.fillRect(0, 0, CANVAS_W, CANVAS_H);

          ctxRef.current!.fillStyle = "#FF4D6D";
          ctxRef.current!.font = "bold 20px 'JetBrains Mono', monospace";
          ctxRef.current!.textAlign = "center";
          ctxRef.current!.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 16);

          ctxRef.current!.fillStyle = "#7ee9f5";
          ctxRef.current!.font = "13px 'JetBrains Mono', monospace";
          ctxRef.current!.fillText(
            `SCORE: ${score.current}`,
            CANVAS_W / 2,
            CANVAS_H / 2 + 12,
          );

          ctxRef.current!.fillStyle = "#8FA2B5";
          ctxRef.current!.font = "11px 'JetBrains Mono', monospace";
          ctxRef.current!.fillText(
            "Press ENTER to restart",
            CANVAS_W / 2,
            CANVAS_H / 2 + 34,
          );
        }

        // ── start overlay ──────────────────────────────────────────────────
        if (!isStarted) {
          ctxRef.current!.fillStyle = "#2DE2E6";
          ctxRef.current!.font = "bold 18px 'JetBrains Mono', monospace";
          ctxRef.current!.textAlign = "center";
          ctxRef.current!.fillText("FLAPPY BIRD", CANVAS_W / 2, CANVAS_H / 2 - 20);
          ctxRef.current!.fillStyle = "#8FA2B5";
          ctxRef.current!.font = "12px 'JetBrains Mono', monospace";
          ctxRef.current!.fillText(
            "← → or SPACE to jump",
            CANVAS_W / 2,
            CANVAS_H / 2 + 10,
          );
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    }
  }, [isStarted, isGameOver]);

  // ── restart ────────────────────────────────────────────────────────────
  const restartGame = useCallback(() => {
    player.current.y = CANVAS_H / 2;
    player.current.vy = 0;
    player.current.rotated = 0;
    pipes.current.length = 0;
    score.current = 0;
    setIsGameOver(false);
    setDisplayScore(0);
    if (!isStarted) setIsStarted(true);
  }, [isStarted]);

  // ── arcade close ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      setIsGameOver(false);
      setIsStarted(false);
      pipes.current.length = 0;
      score.current = 0;
      player.current.y = CANVAS_H / 2;
      player.current.vy = 0;
    };
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
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
          />

          {/* Start overlay */}
          {!isStarted && ((
            <div className="absolute inset-0 flex items-end justify-center pb-6">
              <button
                onClick={() => setIsStarted(true)}
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
          ))}

          {/* Game over overlay */}
          {isGameOver && ((
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ color: "#fff", fontFamily: "JetBrains Mono, monospace" }}>
                <div style={{ position: "absolute", top: 20, left: 20, fontSize: "14px" }}>
                  <button
                    onClick={() => restartGame()}
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
          ))}

          {/* Controls */}
          <div
            className="px-5 py-2.5 text-center text-xs"
            style={{
              color: "#8FA2B5",
              fontFamily: "JetBrains Mono, monospace",
              borderTop: "1px solid rgba(255,77,109,0.1)",
            }}
          >
            ←→ MOVE &nbsp;|&nbsp; SPACE/JUMP &nbsp;|&nbsp; ENTER RESTART
          </div>
        </div>
      </div>
    </div>
  );
}