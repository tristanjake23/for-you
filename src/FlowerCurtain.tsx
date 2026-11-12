import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import "./flower-curtain.css";

const colors = ["#f48fb8", "#b888ed", "#ffd375", "#f8cae3", "#ef737d", "#a4a7ff"];
const rows = [0, 22, 45, 68, 90];
const columns = [0, 16, 33, 50, 67, 84, 100];

const curtain: Variants = {
  hidden: { opacity: 1 },
  finished: {
    opacity: 0,
    transition: { when: "afterChildren", duration: 0.38, delay: 0.14, ease: "easeInOut" },
  },
};

const bloom: Variants = {
  hidden: { opacity: 0, scale: 0.08, y: -70, rotate: -36 },
  finished: ([row, column]: [number, number]) => ({
    opacity: 1,
    scale: [0.08, 1.08, 1],
    y: 0,
    rotate: ((row + column) % 5 - 2) * 12,
    transition: { delay: row * 0.17 + (column % 3) * 0.08, duration: 0.62, ease: "easeOut" },
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
        const rosette = index % 3 === 0;
        return (
          <motion.span
            className={rosette ? "curtain-flower rosette" : "curtain-flower daisy"}
            key={index}
            custom={[row, column]}
            variants={bloom}
            style={{
              "--x": `${x + (row % 2 ? 6 : -3)}%`,
              "--y": `${y + (column % 3 - 1) * 5}%`,
              "--flower-color": colors[(column * 3 + row * 2 + index % 4) % colors.length],
              "--diameter": `${19 + (index % 5) * 2}vmax`,
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
