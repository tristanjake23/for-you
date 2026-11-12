import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <h1>For you, love.</h1>
        <button
          className="envelope-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="letter"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="envelope" aria-hidden="true">
            <motion.span
              className="envelope-flap"
              initial={false}
              animate={{ rotateX: isOpen && !reduceMotion ? -180 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
            />
            <motion.span className="seal" animate={{ opacity: isOpen ? 0 : 1 }}>♥</motion.span>
          </span>
          <span className="button-label">{isOpen ? "Close the letter" : "Open when you miss me"}</span>
        </button>
        <div id="letter" aria-live="polite">
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.article
                key="message"
                initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.15 }}
              >
                <h2>Hi, love.</h2>
                <p>Kung nami-miss mo ako ngayon, message mo ’ko. Miss din kita.</p>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </main>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
