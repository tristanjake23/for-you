import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { createRoot } from "react-dom/client";
import blackDog from "./assets/black-dog.webp";
import flowerSprites from "./assets/flower-sprites.webp";
import whiteDog from "./assets/white-dog.webp";
import { AmbientSky } from "./AmbientSky";
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
  const giftButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isOpening = stage === "opening" || stage === "blooming";

  preload(flowerSprites, { as: "image" });
  preload(blackDog, { as: "image" });
  preload(whiteDog, { as: "image" });

  useEffect(() => {
    if (stage === "closed" && hasReplayed) {
      window.scrollTo({ top: 0, behavior: "instant" });
      giftButton.current?.focus({ preventScroll: true });
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
      <AmbientSky paused={isOpening} />
      {stage === "revealed" ? (
        <Home
          photos={photos}
          blackDog={blackDog}
          whiteDog={whiteDog}
          reduceMotion={reduceMotion}
          onReplay={replay}
        />
      ) : (
        <main className="gift-screen">
          <h1>For you, <em>love.</em></h1>
          <button
            className="gift-button"
            type="button"
            ref={giftButton}
            aria-disabled={isOpening}
            onClick={() => {
              if (stage === "closed") setStage(reduceMotion ? "revealed" : "opening");
            }}
          >
            <span className="gift-box" aria-hidden="true">
              <span className="gift-body"><span className="gift-heart">♥</span></span>
              <motion.span
                className="gift-lid"
                initial={false}
                animate={isOpening
                  ? { transform: "translate3d(22px, -72px, 0) rotate(17deg)", opacity: 0 }
                  : { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: 1 }}
                transition={{ duration: 0.48, ease: "easeInOut" }}
                onAnimationComplete={() => {
                  setStage((current) => current === "opening" ? "blooming" : current);
                }}
              >
                <span className="gift-bow"><i /><b /></span>
              </motion.span>
            </span>
            <span className="button-label">{isOpening ? "Opening…" : "Open your gift"}</span>
          </button>
          {stage === "blooming" && <FlowerCurtain onComplete={() => setStage("revealed")} />}
        </main>
      )}
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
