import { useEffect, useRef, useState } from "react";
import { flappySecret, signature } from "./content";
import "./flappy.css";

const UNLOCK_KEY = "bembem:flappy-secret";

function readUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false; // storage unavailable
  }
}

/**
 * Put it inside the Flappy Bird frame and pass the score:
 *   {phase !== "playing" && <FlappySecret score={score} />}
 * Once the score reaches `unlockAt` (see content.ts), a button appears after
 * the run ends. It stays unlocked on later visits and never interrupts play.
 */
export default function FlappySecret({ score }: { score: number }) {
  const { unlockAt, title, message } = flappySecret;
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (score < unlockAt || unlocked) return;
    setUnlocked(true);
    setJustUnlocked(true);
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }, [score, unlockAt, unlocked]);

  if (!unlocked) return null;

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="bb-btn bb-secret-btn"
        data-new={justUnlocked}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        {justUnlocked ? "Secret unlocked ♥ Tap to read" : "Read your secret ♥"}
      </button>

      <dialog
        ref={dialogRef}
        className="bb-letter"
        aria-labelledby="bb-secret-title"
        onClose={() => setJustUnlocked(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <article className="bb-paper">
          <button type="button" className="bb-btn bb-close" onClick={close}>
            Close
          </button>
          <div className="bb-paper-body">
            <h3 id="bb-secret-title" className="bb-letter-title">
              {title}
            </h3>
            <p className="bb-letter-text">{message}</p>
            <p className="bb-sign">{signature}</p>
          </div>
        </article>
      </dialog>
    </>
  );
}
