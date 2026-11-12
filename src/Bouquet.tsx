import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import "./bouquet.css";

const flowers = [
  { x: 33, angle: -33, height: 133, size: 56, color: "#c090d4" },
  { x: 42, angle: -16, height: 169, size: 67, color: "#e6a6c7" },
  { x: 50, angle: 0, height: 184, size: 72, color: "#c7a5e7" },
  { x: 58, angle: 17, height: 160, size: 63, color: "#f2bcce" },
  { x: 66, angle: 32, height: 126, size: 55, color: "#aa79c6" },
];

const bouquetVariants: Variants = {
  hidden: {},
  grown: { transition: { when: "afterChildren" } },
};

const stemVariants: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  grown: (index: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.48, delay: index * 0.09, ease: "easeOut" },
  }),
};

const blossomVariants: Variants = {
  hidden: { scale: 0, rotate: -45, opacity: 0 },
  grown: (index: number) => ({
    scale: [0, 1.13, 1],
    rotate: [-45, 9, 0],
    opacity: 1,
    transition: { duration: 0.57, delay: 0.4 + index * 0.13, ease: "easeOut" },
  }),
};

interface BouquetProps {
  reduceMotion: boolean;
  onBloomComplete: () => void;
}

export function Bouquet({ reduceMotion, onBloomComplete }: BouquetProps) {
  return (
    <motion.div
      className="bouquet"
      aria-hidden="true"
      variants={bouquetVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="grown"
      onAnimationComplete={onBloomComplete}
    >
      {flowers.map(({ x, angle, height, size, color }, index) => (
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
          <motion.span className="flower-stem" custom={index} variants={stemVariants}>
            <span className="leaf leaf-left" />
            <span className="leaf leaf-right" />
          </motion.span>
          <motion.span className="blossom" custom={index} variants={blossomVariants}>
            {[0, 60, 120, 180, 240, 300].map((rotation) => (
              <span className="petal" key={rotation} style={{ rotate: `${rotation}deg` }} />
            ))}
            <span className="flower-center" />
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}
