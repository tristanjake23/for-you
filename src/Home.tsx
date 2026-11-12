import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Bouquet } from "./Bouquet";
import { Letter } from "./Letter";
import { LittleThings } from "./LittleThings";
import { Notebook, type ScrapbookPhoto } from "./Notebook";
import { FlappyBird } from "./FlappyBird";
import "./home.css";

interface HomeProps {
  photos: ScrapbookPhoto[];
  blackDog: string;
  whiteDog: string;
  reduceMotion: boolean;
  onReplay: () => void;
}

export function Home({ photos, blackDog, whiteDog, reduceMotion, onReplay }: HomeProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, []);

  const dogTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.65, bounce: 0.3 };

  return (
    <motion.div
      className="scrapbook"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
    >
      <header className="scrapbook-header">
        <a className="scrapbook-brand" href="#home">For Bembem <span aria-hidden="true">♥</span></a>
        <nav aria-label="Scrapbook">
          <a href="#home">Home</a>
          <a href="#letter">Letter</a>
          <a href="#photos">Our photos</a>
          <a href="#games">Flappy Bird</a>
        </nav>
      </header>

      <main className="scrapbook-main" id="home">
        <section className="scrapbook-hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <h1 id="home-title" ref={heading} tabIndex={-1}>My favorite <em>person.</em></h1>
            <div className="hero-actions">
              <a className="photo-link" href="#photos">See our photos <span aria-hidden="true">↓</span></a>
              <a className="photo-link photo-link-secondary" href="#little-things">Little things <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="scrapbook-scene">
            <div className="stickers" aria-hidden="true">
              <span className="sticker sticker-star"><i /></span>
              <span className="sticker sticker-disco"><i /></span>
              <span className="sticker sticker-bow"><i /><b /></span>
              <span className="sticker sticker-heart paper-icon paper-icon-heart" />
              <span className="sticker sticker-sparkle paper-icon paper-icon-star" />
              <span className="sticker sticker-lilac-flower paper-icon paper-icon-bloom" />
              <span className="sticker sticker-mini-sparkle paper-icon paper-icon-diamond" />
              <span className="sticker sticker-outline-heart paper-icon paper-icon-butterfly" />
            </div>
            <span className="hero-floral illustrated-sticker art-flowers" aria-hidden="true" />
            <div className="surprise">
              <Bouquet />
              <motion.img
                className="dog dog-black"
                src={blackDog}
                alt="Black dog holding a purple bouquet"
                initial={reduceMotion ? false : { opacity: 0, x: -34, y: 28, rotate: -12, scale: 0.82 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -6, scale: 1 }}
                transition={dogTransition}
              />
              <motion.img
                className="dog dog-white"
                src={whiteDog}
                alt="White dog holding a pink and purple bouquet"
                initial={reduceMotion ? false : { opacity: 0, x: 34, y: 28, rotate: 12, scale: 0.82 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 5, scale: 1 }}
                transition={dogTransition}
              />
            </div>
          </div>
        </section>

        <LittleThings />

        <Letter reduceMotion={reduceMotion} />

        <Notebook photos={photos} reduceMotion={reduceMotion} />

        <FlappyBird />

        <footer className="scrapbook-footer">
          <button className="replay-button" type="button" onClick={onReplay}>Replay surprise</button>
        </footer>
      </main>
    </motion.div>
  );
}
