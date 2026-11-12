import { useState } from "react";

const songTitle = "I Knew It, I Knew You";
const videoId = "hDU4GB1PTxc";

export function SongCard() {
  const [playerOpen, setPlayerOpen] = useState(false);

  return (
    <section className="song-card" aria-labelledby="song-title">
      <div className="song-row">
        <span className="song-icon" aria-hidden="true">♫</span>
        <div className="song-copy">
          <h2 id="song-title">{songTitle}</h2>
          <p>Taylor Swift</p>
        </div>
        <button
          className="song-button"
          type="button"
          aria-expanded={playerOpen}
          aria-controls="song-player"
          onClick={() => setPlayerOpen((open) => !open)}
        >
          {playerOpen ? "Close player" : "Play song"}
        </button>
      </div>
      <div id="song-player" hidden={!playerOpen}>
        {playerOpen && (
          <>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
              title={`${songTitle} by Taylor Swift`}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
          </>
        )}
      </div>
    </section>
  );
}
