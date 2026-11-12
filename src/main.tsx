import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { preload } from "react-dom";
import { createRoot } from "react-dom/client";
import blackDog from "./assets/black-dog.webp";
import whiteDog from "./assets/white-dog.webp";
import { Bouquet } from "./Bouquet";
import { FlowerCurtain } from "./FlowerCurtain";
import "./style.css";

type RevealStage = "closed" | "opening" | "blooming" | "revealed";

const photoFiles = import.meta.glob<string>("./assets/photos/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: "?url",
});
const photos = Object.keys(photoFiles).sort().map((path) => photoFiles[path]);

function App() {
  const [stage, setStage] = useState<RevealStage>("closed");
  const reduceMotion = useReducedMotion() ?? false;
  const isOpen = stage !== "closed";
  const showDogs = stage === "revealed";

  preload(blackDog, { as: "image" });
  preload(whiteDog, { as: "image" });

  function toggleEnvelope() {
    setStage((current) => {
      if (current !== "closed") return "closed";
      return reduceMotion ? "revealed" : "opening";
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className={showDogs ? "is-revealed" : undefined}>
        <h1>For you, <em>love.</em></h1>
        <button
          className="envelope-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="letter"
          onClick={toggleEnvelope}
        >
          <span className="envelope" aria-hidden="true">
            <motion.span
              className="envelope-flap"
              initial={false}
              animate={{ rotateX: isOpen ? -180 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              onAnimationComplete={() => {
                setStage((current) => current === "opening" ? "blooming" : current);
              }}
            />
            <motion.span className="seal" animate={{ opacity: isOpen ? 0 : 1 }}>♥</motion.span>
          </span>
          <span className="button-label">{isOpen ? "Close the letter" : "Open when you miss me"}</span>
        </button>
        {stage === "blooming" && (
          <FlowerCurtain onComplete={() => {
            setStage((current) => current === "blooming" ? "revealed" : current);
          }} />
        )}
        <div id="letter" aria-live="polite">
          {showDogs && (
            <div className="surprise">
              <Bouquet />
              <span className="scrap-heart scrap-heart-left" aria-hidden="true">♥</span>
              <span className="scrap-heart scrap-heart-right" aria-hidden="true">✦</span>
              <motion.img
                className="dog dog-black"
                src={blackDog}
                alt="Black dog holding a purple bouquet"
                initial={reduceMotion ? false : { opacity: 0, x: -34, y: 28, rotate: -12, scale: 0.82 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -6, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.65, bounce: 0.3 }}
              />
              <motion.img
                className="dog dog-white"
                src={whiteDog}
                alt="White dog holding a pink and purple bouquet"
                initial={reduceMotion ? false : { opacity: 0, x: 34, y: 28, rotate: 12, scale: 0.82 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 5, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.65, bounce: 0.3 }}
              />
            </div>
          )}
          <AnimatePresence initial={false}>
            {showDogs && (
              <motion.article
                key="message"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.28 }}
              >
                <h2>Hi, love.</h2>
                <p>Kung nami-miss mo ako ngayon, message mo ’ko. Miss din kita.</p>
              </motion.article>
            )}
          </AnimatePresence>
          {showDogs && photos.length > 0 && (
            <section className="photo-grid" aria-label="Our photos">
              {photos.map((photo, index) => (
                <figure className="photo-print" key={photo}>
                  <img src={photo} alt={`Memory ${index + 1}`} loading="lazy" />
                </figure>
              ))}
            </section>
          )}
        </div>
      </main>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
