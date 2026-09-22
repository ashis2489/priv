import { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "../../store/useStore";

const CANVAS_W = 360;
const CANVAS_H = 280;
const PLAYER_W = 28;
const PLAYER_H = 18;
const BUG_SIZE = 18;
const BULLET_W = 4;
const BULLET_H = 10;

interface Bug {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  type: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

export function ArcadeOverlay() {
  const { setArcadeActive } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    player: { x: CANVAS_W / 2 - PLAYER_W / 2, y: CANVAS_H - 40 },
    bullets: [] as Bullet[],
    bugs: [] as Bug[],
    score: 0,
    highScore: 0,
    lives: 3,
    gameOver: false,
    started: false,
    frame: 0,
    keys: { left: false, right: false, space: false },
    bulletId: 0,
    bugId: 0,
    lastShot: 0,
    spawnTimer: 0,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const spawnBug = useCallback(() => {
    const s = stateRef.current;
    const type = Math.floor(Math.random() * 3);
    s.bugs.push({
      id: s.bugId++,
      x: Math.random() * (CANVAS_W - BUG_SIZE),
      y: -BUG_SIZE,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 0.8 + s.score * 0.0008,
      hp: 1,
      type,
    });
  }, []);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.player = { x: CANVAS_W / 2 - PLAYER_W / 2, y: CANVAS_H - 40 };
    s.bullets = [];
    s.bugs = [];
    s.score = 0;
    s.lives = 3;
    s.gameOver = false;
    s.started = true;
    s.frame = 0;
    s.lastShot = 0;
    s.spawnTimer = 0;
    setDisplayScore(0);
    setDisplayLives(3);
    setIsGameOver(false);
    setIsStarted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const down = e.type === "keydown";
      if (e.key === "ArrowLeft"  || e.key === "a") s.keys.left  = down;
      if (e.key === "ArrowRight" || e.key === "d") s.keys.right = down;
      if (e.key === " " || e.key === "ArrowUp") s.keys.space = down;
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const bugLabels = ["🐛", "🦟", "🪲"];

    const loop = () => {
      const s = stateRef.current;
      ctx.fillStyle = "#02080f";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Grid bg
      ctx.strokeStyle = "rgba(45,226,230,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
      }

      if (!s.started) {
        ctx.fillStyle = "#2DE2E6";
        ctx.font = "bold 18px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("DODGE THE BUGS", CANVAS_W / 2, CANVAS_H / 2 - 20);
        ctx.fillStyle = "#8FA2B5";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("← → to move  |  SPACE to shoot", CANVAS_W / 2, CANVAS_H / 2 + 10);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (s.gameOver) {
        ctx.fillStyle = "#FF4D6D";
        ctx.font = "bold 20px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 16);
        ctx.fillStyle = "#7ee9f5";
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.fillText(`SCORE: ${s.score}`, CANVAS_W / 2, CANVAS_H / 2 + 12);
        ctx.fillStyle = "#8FA2B5";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Press ENTER to restart", CANVAS_W / 2, CANVAS_H / 2 + 34);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      s.frame++;
      const speed = 2.8;

      // Move player
      if (s.keys.left  && s.player.x > 0) s.player.x -= speed;
      if (s.keys.right && s.player.x < CANVAS_W - PLAYER_W) s.player.x += speed;

      // Shoot
      if (s.keys.space && s.frame - s.lastShot > 14) {
        s.bullets.push({
          id: s.bulletId++,
          x: s.player.x + PLAYER_W / 2 - BULLET_W / 2,
          y: s.player.y,
        });
        s.lastShot = s.frame;
      }

      // Spawn bugs
      s.spawnTimer++;
      const spawnInterval = Math.max(28, 60 - s.score * 0.05);
      if (s.spawnTimer >= spawnInterval) {
        spawnBug();
        s.spawnTimer = 0;
      }

      // Move bullets
      s.bullets = s.bullets.filter((b) => b.y > -BULLET_H);
      s.bullets.forEach((b) => { b.y -= 6; });

      // Move bugs
      s.bugs.forEach((bug) => {
        bug.x += bug.vx;
        bug.y += bug.vy;
        if (bug.x < 0 || bug.x > CANVAS_W - BUG_SIZE) bug.vx *= -1;
      });

      // Bullet-bug collision
      s.bullets.forEach((bullet) => {
        s.bugs.forEach((bug) => {
          if (
            bullet.x < bug.x + BUG_SIZE &&
            bullet.x + BULLET_W > bug.x &&
            bullet.y < bug.y + BUG_SIZE &&
            bullet.y + BULLET_H > bug.y
          ) {
            bug.hp--;
            bullet.y = -999;
            if (bug.hp <= 0) {
              s.score += 10;
              setDisplayScore(s.score);
            }
          }
        });
      });

      s.bugs = s.bugs.filter((b) => b.hp > 0 && b.y < CANVAS_H + 10);

      // Bug-player collision
      s.bugs.forEach((bug) => {
        if (
          bug.x < s.player.x + PLAYER_W &&
          bug.x + BUG_SIZE > s.player.x &&
          bug.y + BUG_SIZE > s.player.y
        ) {
          s.lives--;
          bug.hp = 0;
          setDisplayLives(s.lives);
          if (s.lives <= 0) {
            s.gameOver = true;
            s.highScore = Math.max(s.highScore, s.score);
            setIsGameOver(true);
          }
        }
      });

      // Draw bullets
      s.bullets.forEach((b) => {
        ctx.fillStyle = "#2DE2E6";
        ctx.shadowColor = "#2DE2E6";
        ctx.shadowBlur = 6;
        ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);
        ctx.shadowBlur = 0;
      });

      // Draw bugs
      s.bugs.forEach((bug) => {
        ctx.font = `${BUG_SIZE}px serif`;
        ctx.textAlign = "left";
        ctx.fillText(bugLabels[bug.type], bug.x, bug.y + BUG_SIZE);
      });

      // Draw player
      ctx.fillStyle = "#2DE2E6";
      ctx.shadowColor = "#2DE2E6";
      ctx.shadowBlur = 10;
      // Ship body
      ctx.beginPath();
      ctx.moveTo(s.player.x + PLAYER_W / 2, s.player.y);
      ctx.lineTo(s.player.x + PLAYER_W, s.player.y + PLAYER_H);
      ctx.lineTo(s.player.x, s.player.y + PLAYER_H);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (stateRef.current.gameOver || !stateRef.current.started) startGame();
      }
    };
    window.addEventListener("keydown", onEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onEnter);
    };
  }, [spawnBug, startGame]);

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
          <div className="text-sm font-bold" style={{ color: "#FF4D6D" }}>
            🎮 DODGE THE BUGS
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#8FA2B5" }}>
            <span>LIVES: <span style={{ color: "#FF4D6D" }}>{"❤".repeat(Math.max(0, displayLives))}</span></span>
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
                onClick={startGame}
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
          ←→ MOVE &nbsp;|&nbsp; SPACE SHOOT &nbsp;|&nbsp; ENTER RESTART
        </div>
      </div>
    </div>
  );
}
