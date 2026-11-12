import { useEffect, useState } from "react";
import type { ScrapbookPhoto } from "./Notebook";
import "./games.css";

const kittenNames = ["The bow kitten", "The letter kitten", "The notebook kitten"];
const clues = ["Look by the pink bow.", "Check the bottom of the letter.", "Try the notebook’s last page."];
const heartPositions = [[40, 30], [76, 67], [20, 60], [70, 23], [47, 75], [23, 25], [80, 43], [53, 35], [19, 72], [66, 64]];

export function KittenToken({ index, found, onFind }: {
  index: number;
  found: boolean;
  onFind: (index: number) => void;
}) {
  return (
    <button className={`kitten-token kitten-token-${index}`} type="button" aria-label={kittenNames[index]} disabled={found} onClick={() => onFind(index)}>
      <span aria-hidden="true">{found ? "✓" : "🐱"}</span>
    </button>
  );
}

export function Games({ active, found, onHunt, rewardPhoto }: {
  active: boolean;
  found: number[];
  onHunt: () => void;
  rewardPhoto?: ScrapbookPhoto;
}) {
  const [caught, setCaught] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const [rewardOpen, setRewardOpen] = useState(false);
  const playing = deadline > 0 && seconds > 0 && caught < heartPositions.length;
  const won = caught === heartPositions.length;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 100);
    return () => window.clearInterval(timer);
  }, [deadline, playing]);

  function startHearts() {
    setCaught(0);
    setSeconds(20);
    setDeadline(Date.now() + 20_000);
  }

  function catchHeart() {
    if (Date.now() < deadline) setCaught((count) => Math.min(count + 1, heartPositions.length));
  }

  return (
    <section className="games-section" id="games" aria-labelledby="games-title">
      <h2 id="games-title">Play with me</h2>
      <div className="game-cards">
        <article className="game-card">
          <h3>Find the 3 kittens <span aria-hidden="true">🐾</span></h3>
          <p>May tatlong kuting na nagtatago sa scrapbook. Hanapin sila para mabuksan yung secret box.</p>
          {!active && <button className="game-button" type="button" onClick={onHunt}>Start kitten hunt</button>}
          {active && (
            <div aria-live="polite">
              <p className="game-score">{found.length} / 3 kittens</p>
              <ul className="kitten-clues">
                {clues.map((clue, index) => <li key={clue}>{found.includes(index) ? "✓ " : ""}{clue}</li>)}
              </ul>
            </div>
          )}
          {found.length === 3 && (
            <button className="game-button" type="button" aria-expanded={rewardOpen} onClick={() => setRewardOpen((open) => !open)}>
              {rewardOpen ? "Close secret box" : "Open secret box 🎁"}
            </button>
          )}
          {rewardOpen && found.length === 3 && (
            <div className="game-reward">
              {rewardPhoto && <img src={rewardPhoto.url} alt={rewardPhoto.label} />}
              <p><strong>Three things I love about you</strong></p>
              <p>Yung lambing mo. Yung tawa mo. At kung paano mo napapasaya kahit ordinaryong araw ko. I love you, Bembem. ♡</p>
            </div>
          )}
        </article>
        <article className="game-card">
          <h3>Catch the Hearts <span aria-hidden="true">💗</span></h3>
          <p>Tap 10 hearts in 20 seconds.</p>
          <div className="heart-score">
            <span aria-live="polite">{caught} / 10 hearts</span>
            <span>{seconds}s</span>
          </div>
          <div className="heart-field">
            {playing ? (
              <button className="catch-heart" type="button" aria-label="Catch heart" onClick={catchHeart}
                style={{ left: `${heartPositions[caught][0]}%`, top: `${heartPositions[caught][1]}%` }}>♥</button>
            ) : (
              <div className="heart-result">
                {won && <p role="status">Nakuha mo lahat! Pati puso ko, sa’yo na. ♡</p>}
                {deadline > 0 && !won && <p role="status">Time’s up! Try ulit, love.</p>}
                <button className="game-button" type="button" onClick={startHearts}>{deadline ? "Play again" : "Start"}</button>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
