import type { CSSProperties } from "react";
import "./bouquet.css";

const flowers = [
  { x: 33, angle: -33, height: 133, size: 56, color: "#c090d4" },
  { x: 42, angle: -16, height: 169, size: 67, color: "#ff9dc5" },
  { x: 50, angle: 0, height: 184, size: 72, color: "#c7a5e7" },
  { x: 58, angle: 17, height: 160, size: 63, color: "#ffd68b" },
  { x: 66, angle: 32, height: 126, size: 55, color: "#aa79c6" },
];

export function Bouquet() {
  return (
    <div className="bouquet" aria-hidden="true">
      {flowers.map(({ x, angle, height, size, color }) => (
        <div
          className="flower"
          key={x}
          style={{
            "--flower-x": `${x}%`,
            "--angle": `${angle}deg`,
            "--height": `${height}px`,
            "--size": `${size}px`,
            "--petal": color,
          } as CSSProperties}
        >
          <span className="flower-stem">
            <span className="leaf leaf-left" />
            <span className="leaf leaf-right" />
          </span>
          <span className="blossom">
            {[0, 60, 120, 180, 240, 300].map((rotation) => (
              <span className="petal" key={rotation} style={{ rotate: `${rotation}deg` }} />
            ))}
            <span className="flower-center" />
          </span>
        </div>
      ))}
    </div>
  );
}
