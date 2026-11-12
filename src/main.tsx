import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { preload } from "react-dom";
import { createRoot } from "react-dom/client";
import blackDog from "./assets/black-dog.webp";
import flowerSprites from "./assets/flower-sprites.webp";
import whiteDog from "./assets/white-dog.webp";
import { AmbientSky } from "./AmbientSky";
import { CatStickers } from "./CatStickers";
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
  filename: path.split("/").pop()!,
}));

const musicFiles = import.meta.glob<string>("./assets/music/*.mp3", {
  eager: true,
  import: "default",
  query: "?url",
});
const backgroundMusic = musicFiles["./assets/music/background.mp3"];

function App() {
  const [stage, setStage] = useState<RevealStage>("closed");
  const [hasReplayed, setHasReplayed] = useState(false);
  const giftButton = useRef<HTMLButtonElement>(null);
  const music = useRef<HTMLAudioElement>(null);
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

  function openGift() {
    if (stage !== "closed") return;

    // Retry within the tap if the browser blocked playback on page load.
    const player = music.current;
    if (player?.paused && !player.ended) {
      void player.play().catch(() => {});
    }
    setStage(reduceMotion ? "revealed" : "opening");
  }

  function replay() {
    if (["#home", "#letter", "#photos", "#games"].includes(window.location.hash)) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    setHasReplayed(true);
    setStage("closed");
  }

  return (
    <MotionConfig reducedMotion="user">
      <AmbientSky paused={isOpening} />
      {backgroundMusic && <audio ref={music} src={backgroundMusic} autoPlay preload="auto" />}
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
          <div className="gift-stage">
            <button
              className="gift-button"
              type="button"
              ref={giftButton}
              aria-disabled={isOpening}
              onClick={openGift}
            >
              <span className="gift-box" aria-hidden="true">
                <span className="gift-halo" />
                <span className="gift-sparkle gift-sparkle-left">✦</span>
                <span className="gift-sparkle gift-sparkle-right">✧</span>
                <span className="gift-body"><span className="gift-heart">♥</span></span>
                {isOpening && (
                  <span className="gift-burst">
                    {["♥", "✦", "✧", "♥", "✦", "✧", "♥", "✦"].map((mark, index) => (
                      <span key={index} style={{
                        "--burst-angle": `${-146 + index * 42}deg`,
                        "--burst-distance": `${44 + (index % 3) * 14}px`,
                      } as CSSProperties}>{mark}</span>
                    ))}
                  </span>
                )}
                <motion.span
                  className="gift-lid"
                  initial={false}
                  animate={isOpening
                    ? {
                      transform: [
                        "translate3d(0, 0, 0) rotate(0deg)",
                        "translate3d(-8px, -48px, 0) rotate(-12deg)",
                        "translate3d(33px, -94px, 0) rotate(22deg)",
                      ],
                      opacity: [1, 1, 0],
                    }
                    : { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: 1 }}
                  transition={{ duration: 0.59, times: [0, 0.46, 1], ease: "easeInOut" }}
                  onAnimationComplete={() => {
                    setStage((current) => current === "opening" ? "blooming" : current);
                  }}
                >
                  <span className="gift-bow"><i /><b /></span>
                </motion.span>
              </span>
              <span className="button-label">{isOpening ? "Opening…" : "Open your gift"}</span>
            </button>
            <CatStickers paused={isOpening} />
          </div>
          {stage === "blooming" && <FlowerCurtain onComplete={() => setStage("revealed")} />}
        </main>
      )}
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
