import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import "./flower-curtain.css";

const rowPositions = [0, 12, 25, 38, 51, 64, 77, 90, 101];
const columnPositions = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
const spriteColumns = 6;

const flowerRows = rowPositions.map((position, row) => ({
  position,
  flowers: columnPositions.map((x, column) => {
    const index = row * columnPositions.length + column;
    const spriteColumn = (column * 3 + row * 2 + index % 4) % spriteColumns;
    const isRosette = index % 3 === 0 || (row + column) % 4 === 0;
    const style = {
      "--x": `${x + (row % 2 ? 4 : -2)}%`,
      "--offset": `${(column % 3 - 1) * 3}vh`,
      "--diameter": `${16 + (index % 5) * 1.9}vmax`,
      "--tilt": `${((row + column) % 5 - 2) * 12}deg`,
      "--sprite-x": `${spriteColumn / (spriteColumns - 1) * 100}%`,
      "--sprite-y": isRosette ? "100%" : "0%",
    } as CSSProperties;
    return { x, style };
  }),
}));

const curtain: Variants = {
  hidden: { opacity: 1 },
  finished: {
    opacity: 0,
    transition: { when: "afterChildren", duration: 0.38, delay: 0.18, ease: "easeInOut" },
  },
};

const rowBloom: Variants = {
  hidden: { opacity: 0, transform: "translateY(-35px) scale(0.86)" },
  finished: (row: number) => ({
    opacity: 1,
    transform: [
      "translateY(-35px) scale(0.86)",
      "translateY(3px) scale(1.025)",
      "translateY(0px) scale(1)",
    ],
    transition: { delay: row * 0.09, duration: 0.48, ease: "easeOut" },
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
      {flowerRows.map(({ position, flowers }, row) => (
        <motion.div
          className="flower-row"
          key={position}
          custom={row}
          variants={rowBloom}
          style={{ top: `${position}%` }}
        >
          {flowers.map(({ x, style }) => (
            <span className="curtain-flower" key={x} style={style} />
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}
