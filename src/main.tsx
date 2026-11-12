import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { createRoot } from "react-dom/client";
import blackDog from "./assets/black-dog.webp";
import whiteDog from "./assets/white-dog.webp";
import { FlowerCurtain } from "./FlowerCurtain";
import { Home } from "./Home";
import "./style.css";

type RevealStage = "closed" | "opening" | "blooming" | "revealed";

const photoFiles = import.meta.glob<string>("./assets/photos/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: "?url",
});
const photos = Object.keys(photoFiles).sort().map((path, index) => ({
  url: photoFiles[path],
  label: `Memory ${index + 1}`,
}));

function App() {
  const [stage, setStage] = useState<RevealStage>("closed");
  const [hasReplayed, setHasReplayed] = useState(false);
  const envelopeButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isOpening = stage === "opening" || stage === "blooming";

  preload(blackDog, { as: "image" });
  preload(whiteDog, { as: "image" });

  useEffect(() => {
    if (stage === "closed" && hasReplayed) {
      window.scrollTo({ top: 0, behavior: "instant" });
      envelopeButton.current?.focus({ preventScroll: true });
    }
  }, [stage, hasReplayed]);

  function replay() {
    if (window.location.hash === "#home" || window.location.hash === "#photos") {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    setHasReplayed(true);
    setStage("closed");
  }

  return (
    <MotionConfig reducedMotion="user">
      {stage === "revealed" ? (
        <Home
          photos={photos}
          blackDog={blackDog}
          whiteDog={whiteDog}
          reduceMotion={reduceMotion}
          onReplay={replay}
        />
      ) : (
        <main className="envelope-screen">
          <h1>For you, <em>love.</em></h1>
          <button
            className="envelope-button"
            type="button"
            ref={envelopeButton}
            aria-disabled={isOpening}
            onClick={() => {
              if (stage === "closed") setStage(reduceMotion ? "revealed" : "opening");
            }}
          >
            <span className="envelope" aria-hidden="true">
              <motion.span
                className="envelope-flap"
                initial={false}
                animate={{ rotateX: isOpening ? -180 : 0 }}
                transition={{ duration: 0.45 }}
                onAnimationComplete={() => {
                  setStage((current) => current === "opening" ? "blooming" : current);
                }}
              />
              <motion.span className="seal" animate={{ opacity: isOpening ? 0 : 1 }}>♥</motion.span>
            </span>
            <span className="button-label">{isOpening ? "Opening…" : "Open when you miss me"}</span>
          </button>
          {stage === "blooming" && <FlowerCurtain onComplete={() => setStage("revealed")} />}
        </main>
      )}
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
