import type { CSSProperties } from "react";
import "./ambient-sky.css";

const stickerGroups = [
  [
    { mark: "♥", x: 8, y: 20, color: "pink", size: 42, angle: -18 },
    { mark: "✿", x: 16, y: 58, color: "lilac", size: 30, angle: 14 },
    { mark: "✦", x: 32, y: 12, color: "gold", size: 27, angle: 11 },
    { mark: "♡", x: 37, y: 79, color: "peach", size: 30, angle: 18 },
    { mark: "✧", x: 5, y: 77, color: "ice", size: 22, angle: 5 },
    { mark: "✿", x: 88, y: 72, color: "pink", size: 38, angle: 8 },
    { mark: "♥", x: 96, y: 39, color: "lilac", size: 23, angle: 21 },
  ],
  [
    { mark: "✧", x: 6, y: 42, color: "gold", size: 29, angle: -13 },
    { mark: "✿", x: 21, y: 27, color: "peach", size: 22, angle: -21 },
    { mark: "✦", x: 26, y: 91, color: "ice", size: 28, angle: -12 },
    { mark: "♡", x: 69, y: 11, color: "pink", size: 35, angle: 16 },
    { mark: "✿", x: 80, y: 46, color: "lilac", size: 23, angle: 14 },
    { mark: "✦", x: 92, y: 18, color: "gold", size: 36, angle: 12 },
    { mark: "♡", x: 94, y: 87, color: "peach", size: 30, angle: -12 },
  ],
  [
    { mark: "✦", x: 13, y: 7, color: "ice", size: 16, angle: 12 },
    { mark: "♥", x: 13, y: 85, color: "pink", size: 23, angle: -8 },
    { mark: "✧", x: 28, y: 63, color: "gold", size: 18, angle: 15 },
    { mark: "✧", x: 52, y: 88, color: "lilac", size: 21, angle: -10 },
    { mark: "✦", x: 72, y: 77, color: "ice", size: 24, angle: -9 },
    { mark: "✿", x: 84, y: 7, color: "pink", size: 25, angle: 22 },
    { mark: "✧", x: 94, y: 57, color: "gold", size: 21, angle: 9 },
  ],
  [
    { mark: "🎀", x: 12, y: 32, color: "pink", size: 35, angle: -16 },
    { mark: "🌷", x: 22, y: 73, color: "peach", size: 32, angle: -19 },
    { mark: "✿", x: 39, y: 7, color: "gold", size: 24, angle: 11 },
    { mark: "🌙", x: 77, y: 14, color: "gold", size: 28, angle: 13 },
    { mark: "🎀", x: 85, y: 83, color: "pink", size: 30, angle: 14 },
    { mark: "♡", x: 92, y: 31, color: "ice", size: 24, angle: 19 },
    { mark: "🦋", x: 7, y: 64, color: "ice", size: 28, angle: -17 },
    { mark: "💌", x: 25, y: 17, color: "pink", size: 25, angle: 13 },
    { mark: "🌸", x: 34, y: 88, color: "peach", size: 26, angle: -12 },
    { mark: "💖", x: 64, y: 14, color: "pink", size: 29, angle: -8 },
    { mark: "🫧", x: 76, y: 92, color: "ice", size: 28, angle: 11 },
    { mark: "🦋", x: 91, y: 46, color: "lilac", size: 27, angle: 13 },
  ],
];

export function AmbientSky({ paused }: { paused: boolean }) {
  return (
    <div className={paused ? "ambient-sky is-paused" : "ambient-sky"} aria-hidden="true">
      <span className="sky-cloud cloud-upper" />
      <span className="sky-cloud cloud-side" />
      <span className="sky-cloud cloud-low" />
      {stickerGroups.map((group, index) => (
        <div className="sky-sticker-layer" key={index}>
          {group.map(({ mark, x, y, color, size, angle }) => (
            <span
              key={x}
              className={`sky-sticker sky-${color}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                "--sticker-size": `${size}px`,
                "--sticker-angle": `${angle}deg`,
              } as CSSProperties}
            >
              {mark}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
