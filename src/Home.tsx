import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bouquet } from "./Bouquet";
import { CatStickers } from "./CatStickers";
import { Letter } from "./Letter";
import { Notebook, type ScrapbookPhoto } from "./Notebook";
import { Games, KittenToken } from "./Games";
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
  const [huntActive, setHuntActive] = useState(false);
  const [foundKittens, setFoundKittens] = useState<number[]>([]);

  function findKitten(index: number) {
    setFoundKittens((found) => found.includes(index) ? found : [...found, index]);
  }

  function kitten(index: number) {
    return huntActive && <KittenToken index={index} found={foundKittens.includes(index)} onFind={findKitten} />;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, []);

  const dogTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.65, bounce: 0.3 };

  return (
    <div className="scrapbook">
      <header className="scrapbook-header">
        <a className="scrapbook-brand" href="#home">For Bembem <span aria-hidden="true">♥</span></a>
        <nav aria-label="Scrapbook">
          <a href="#home">Home</a>
          <a href="#letter">Letter</a>
          <a href="#photos">Our photos</a>
          <a href="#games">Games</a>
        </nav>
      </header>

      <main className="scrapbook-main" id="home">
        <section className="scrapbook-hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <h1 id="home-title" ref={heading} tabIndex={-1}>My favorite <em>person.</em></h1>
            <a className="photo-link" href="#photos">See our photos <span aria-hidden="true">↓</span></a>
            <a className="hero-games-link" href="#games">Play a game <span aria-hidden="true">↘</span></a>
          </div>

          <div className="scrapbook-scene">
            <div className="stickers" aria-hidden="true">
              <span className="sticker sticker-star"><i /></span>
              <span className="sticker sticker-disco"><i /></span>
              <span className="sticker sticker-bow"><i /><b /></span>
              <span className="sticker sticker-heart">♥</span>
              <span className="sticker sticker-sparkle">✦</span>
              <span className="sticker sticker-lilac-flower">✿</span>
              <span className="sticker sticker-mini-sparkle">✧</span>
              <span className="sticker sticker-outline-heart">♡</span>
            </div>
            <CatStickers />
            {kitten(0)}
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

        <Letter reduceMotion={reduceMotion} kitten={kitten(1)} />

        <Notebook photos={photos} reduceMotion={reduceMotion} kitten={kitten(2)} />

        <Games active={huntActive} found={foundKittens} onHunt={() => setHuntActive(true)} rewardPhoto={photos[0]} />

        <footer className="scrapbook-footer">
          <button className="replay-button" type="button" onClick={onReplay}>Replay surprise</button>
        </footer>
      </main>
    </div>
  );
}
