import { useEffect, useRef, useState } from "react";
import "./flappy.css";

const width = 360;
const height = 420;
const ground = 390;
const birdX = 84;
const radius = 11;
const pipeWidth = 51;
const gap = 137;
const spacing = 177;
const bestKey = "bembem-flappy-best";

type Phase = "ready" | "playing" | "finished";
type Pipe = { x: number; center: number; passed: boolean };
type Flight = { y: number; speed: number; score: number; pipes: Pipe[] };

function makePipe(x: number): Pipe {
  return { x, center: 112 + Math.random() * 151, passed: false };
}

function newFlight(): Flight {
  return { y: 172, speed: 0, score: 0, pipes: [makePipe(width + 16), makePipe(width + 16 + spacing)] };
}

function readBest() {
  try { return Number(localStorage.getItem(bestKey)) || 0; } catch { return 0; }
}

function drawCloud(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  context.beginPath();
  context.ellipse(x, y, 26 * size, 10 * size, 0, 0, Math.PI * 2);
  context.ellipse(x + 11 * size, y - 6 * size, 13 * size, 13 * size, 0, 0, Math.PI * 2);
  context.ellipse(x + 26 * size, y + 1, 15 * size, 10 * size, 0, 0, Math.PI * 2);
  context.fill();
}

function drawFlight(context: CanvasRenderingContext2D, flight: Flight) {
  context.setTransform(2, 0, 0, 2, 0, 0);
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#c2bbef");
  sky.addColorStop(1, "#ffded1");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#fff6e5";
  drawCloud(context, 45, 69, 1.35);
  drawCloud(context, 244, 117, 1.15);
  drawCloud(context, 148, 238, 1.5);
  context.fillStyle = "#efd3ef";
  context.beginPath();
  context.moveTo(0, ground);
  context.bezierCurveTo(68, 251, 122, 379, 183, 332);
  context.bezierCurveTo(256, 274, 291, 311, 360, 365);
  context.lineTo(width, ground);
  context.fill();

  for (const { x, center } of flight.pipes) {
    const top = center - gap / 2;
    const bottom = center + gap / 2;
    context.fillStyle = "#719970";
    context.fillRect(x, 0, pipeWidth, top);
    context.fillRect(x, bottom, pipeWidth, ground - bottom);
    context.fillStyle = "#a9bc83";
    context.fillRect(x + 7, 0, 9, top);
    context.fillRect(x + 7, bottom, 9, ground - bottom);
    context.fillStyle = "#527754";
    context.fillRect(x - 3, top - 10, pipeWidth + 6, 10);
    context.fillRect(x - 3, bottom, pipeWidth + 6, 10);
  }

  context.fillStyle = "#8baa77";
  context.fillRect(0, ground, width, height - ground);
  context.fillStyle = "#f3daa5";
  context.fillRect(0, ground + 7, width, height - ground - 7);

  context.save();
  context.translate(birdX, flight.y);
  context.rotate(Math.min(0.65, Math.max(-0.35, flight.speed / 560)));
  context.fillStyle = "#fff0ad";
  context.strokeStyle = "#9c5c67";
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = "#efac83";
  context.beginPath();
  context.ellipse(-6, 3, 7, 4, -0.25, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#633f63";
  context.beginPath();
  context.arc(6, -3, 2, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#d97968";
  context.beginPath();
  context.moveTo(12, 0);
  context.lineTo(19, 3);
  context.lineTo(12, 6);
  context.fill();
  context.restore();
}

export function FlappyBird() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const flapButton = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const flight = useRef<Flight | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const bestScore = useRef(best);

  function flap() {
    if (flight.current) flight.current.speed = -276;
  }

  function start() {
    flight.current = newFlight();
    setScore(0);
    flap();
    setPhase("playing");
  }

  useEffect(() => {
    const drawingContext = canvas.current?.getContext("2d");
    if (!drawingContext) return;
    const context = drawingContext;
    if (!flight.current) flight.current = newFlight();
    drawFlight(context, flight.current);
    if (phase !== "playing") {
      if (phase === "finished") startButton.current?.focus({ preventScroll: true });
      return;
    }

    flapButton.current?.focus({ preventScroll: true });
    let frame = 0;
    let previous = 0;
    const current = flight.current;

    function tick(now: number) {
      const dt = previous ? Math.min((now - previous) / 1000, 0.025) : 0;
      previous = now;
      current.speed += 784 * dt;
      current.y += current.speed * dt;
      let hit = current.y - radius < 0 || current.y + radius > ground;
      for (const pipe of current.pipes) {
        pipe.x -= 116 * dt;
        const right = pipe.x + pipeWidth + 3;
        if (birdX + radius > pipe.x - 3 && birdX - radius < right &&
          (current.y - radius < pipe.center - gap / 2 || current.y + radius > pipe.center + gap / 2)) {
          hit = true;
        }
        if (!hit && !pipe.passed && right < birdX - radius) {
          pipe.passed = true;
          setScore(++current.score);
        }
      }
      if (current.pipes[0].x < -pipeWidth - 5) {
        current.pipes.shift();
        current.pipes.push(makePipe(current.pipes[current.pipes.length - 1].x + spacing));
      }
      drawFlight(context, current);
      if (hit) {
        const result = Math.max(bestScore.current, readBest(), current.score);
        bestScore.current = result;
        try { localStorage.setItem(bestKey, String(result)); } catch { /* Storage can be disabled. */ }
        setBest(result);
        setPhase("finished");
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  return (
    <section className="flappy-section" id="games" aria-labelledby="flappy-title">
      <h2 id="flappy-title">Flappy Bird</h2>
      <div className="flappy-frame">
        <div className="flappy-score"><span>Score <b>{score}</b></span><span>Best <b>{best}</b></span></div>
        <div className="flappy-field">
          <canvas ref={canvas} width={720} height={840} aria-hidden="true" />
          {phase === "playing" ? (
            <button type="button" className="flappy-input" ref={flapButton} aria-label="Flap bird" onClick={flap}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") { event.preventDefault(); flap(); }
              }} />
          ) : (
            <div className="flappy-overlay">
              {phase === "finished" && <p role="status">Score {score} · Best {best}</p>}
              <button type="button" ref={startButton} onClick={start}>{phase === "ready" ? "Start flying" : "Fly again"}</button>
            </div>
          )}
        </div>
        <p>Tap the sky or press Space / ↑ to flap.</p>
      </div>
    </section>
  );
}
