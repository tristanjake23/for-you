import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import "./flower-curtain.css";

const colors = ["#f48fb8", "#b888ed", "#ffd375", "#f8cae3", "#ef737d", "#a4a7ff"];
const rows = [0, 12, 25, 38, 51, 64, 77, 90, 101];
const columns = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];

const curtain: Variants = {
  hidden: { opacity: 1 },
  finished: {
    opacity: 0,
    transition: { when: "afterChildren", duration: 0.42, delay: 0.23, ease: "easeInOut" },
  },
};

const bloom: Variants = {
  hidden: { opacity: 0, scale: 0.08, y: -70, rotate: -36 },
  finished: ([row, column]: [number, number]) => ({
    opacity: 1,
    scale: [0.08, 1.08, 1],
    y: 0,
    rotate: ((row + column) % 5 - 2) * 12,
    transition: { delay: row * 0.105 + (column % 3) * 0.055, duration: 0.52, ease: "easeOut" },
  }),
};

export function FlowerCurtain({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="flower-curtain"
      aria-hidden="true"
      variants={curtain}
      initial="hidden"
      animate="finished"
      onAnimationComplete={onComplete}
    >
      {rows.flatMap((y, row) => columns.map((x, column) => {
        const index = row * columns.length + column;
        const rosette = index % 3 === 0 || (row + column) % 4 === 0;
        return (
          <motion.span
            className={rosette ? "curtain-flower rosette" : "curtain-flower daisy"}
            key={index}
            custom={[row, column]}
            variants={bloom}
            style={{
              "--x": `${x + (row % 2 ? 4 : -2)}%`,
              "--y": `${y + (column % 3 - 1) * 3}%`,
              "--flower-color": colors[(column * 3 + row * 2 + index % 4) % colors.length],
              "--diameter": `${16 + (index % 5) * 1.9}vmax`,
            } as CSSProperties}
          >
            {Array.from({ length: 9 }, (_, petal) => (
              <i key={petal} style={{ rotate: `${petal * 40}deg` }} />
            ))}
            <b />
          </motion.span>
        );
      }))}
    </motion.div>
  );
}
