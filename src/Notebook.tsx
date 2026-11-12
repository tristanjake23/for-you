import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import captions from "./photo-captions.json";
import "./notebook.css";

const pages = [
  { title: "Little moments", icons: "🌷 ✧ 💗", theme: "rose" },
  { title: "Better together", icons: "🦋 ♡ 🎀", theme: "lilac" },
  { title: "Look at us", icons: "✨ 🌸 ☁", theme: "peach" },
  { title: "More to come", icons: "🌙 ✦ 💌", theme: "blue" },
];
const photosPerPage = 5;

export interface ScrapbookPhoto {
  url: string;
  label: string;
  filename: string;
}

const photoCaptions: Record<string, string> = captions;

export function Notebook({ photos, reduceMotion, kitten }: {
  photos: ScrapbookPhoto[];
  reduceMotion: boolean;
  kitten: ReactNode;
}) {
  const [page, setPage] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  function turn(next: number | null) {
    setDirection(next === null || (page !== null && next < page) ? -1 : 1);
    setFlipped(null);
    setPage(next);
  }

  return (
    <section className="notebook-section" id="photos" aria-labelledby="photo-title">
      <h2 id="photo-title">Our photos</h2>
      {page === null ? (
        <button className="notebook-cover" type="button" onClick={() => turn(0)}>
          <span className="notebook-binding" aria-hidden="true" />
          <span className="cover-corners" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="cover-decoration cover-decoration-top" aria-hidden="true">🌙 ✧</span>
          <span className="cover-decoration cover-decoration-bottom" aria-hidden="true">🎀 ♡ 🌷</span>
          <span className="cover-label">
            <span className="cover-title">Our little<br />scrapbook</span>
            <span className="cover-action">Open notebook <span aria-hidden="true">↗</span></span>
          </span>
        </button>
      ) : (
        <div className="notebook-open">
          <span className="notebook-binding" aria-hidden="true" />
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              className={`notebook-paper notebook-${pages[page].theme}`}
              initial={reduceMotion ? false : { rotateY: direction * -9, opacity: 0.45 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, rotateY: direction * 7 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <span className="paper-stickers paper-stickers-top" aria-hidden="true">{pages[page].icons}</span>
              <span className="paper-stickers paper-stickers-bottom" aria-hidden="true">♡ ✦ ❀</span>
              <div className="paper-heading">
                <h3>{pages[page].title}</h3>
                <span aria-hidden="true">0{page + 1}</span>
              </div>
              <div className="notebook-photos">
                {Array.from({ length: photosPerPage }, (_, index) => {
                  const slot = page * photosPerPage + index;
                  const photo = photos[slot];
                  const isFlipped = !!photo && flipped === photo.filename;
                  return photo ? (
                    <button
                      type="button"
                      key={photo.filename}
                      className="notebook-print"
                      aria-label={`${isFlipped ? "Show photo" : "Read caption for"} ${photo.label}`}
                      aria-pressed={isFlipped}
                      onClick={() => setFlipped(isFlipped ? null : photo.filename)}
                    >
                      {isFlipped ? (
                        <span className="notebook-caption">{photoCaptions[photo.filename] || "One of my favorite memories with you. ♡"}</span>
                      ) : (
                        <img src={photo.url} alt={photo.label} loading="lazy" />
                      )}
                    </button>
                  ) : (
                    <figure className="notebook-print" key={slot}>
                      <span className="notebook-placeholder" aria-hidden="true">♡</span>
                      <figcaption>Photo {String(slot + 1).padStart(2, "0")}</figcaption>
                    </figure>
                  );
                })}
              </div>
              {page === pages.length - 1 && kitten}
            </motion.div>
          </AnimatePresence>
          <nav className="notebook-nav" aria-label="Notebook pages">
            <button type="button" onClick={() => turn(null)}>Close</button>
            <div className="notebook-page-turn">
              <button type="button" aria-label="Previous page" disabled={page === 0} onClick={() => turn(page - 1)}>←</button>
              <span aria-live="polite">{page + 1} / {pages.length}</span>
              <button type="button" aria-label="Next page" disabled={page === pages.length - 1} onClick={() => turn(page + 1)}>→</button>
            </div>
          </nav>
        </div>
      )}
    </section>
  );
}
