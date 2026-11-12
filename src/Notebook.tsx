import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import captions from "./photo-captions.json";
import "./notebook.css";

const pages = [
  { title: "Little moments", art: "pot", theme: "rose" },
  { title: "Better together", art: "butterfly", theme: "lilac" },
  { title: "Look at us", art: "flowers", theme: "peach" },
  { title: "More to come", art: "cream", theme: "blue" },
];
const photosPerPage = 5;

const sheetTurn: Variants = {
  enter: (direction: number) => ({ rotateY: 72 * direction, opacity: 0.48 }),
  open: { rotateY: 0, opacity: 1, transition: { duration: 0.36, ease: [0.22, 0.67, 0.29, 1] } },
  exit: (direction: number) => ({
    rotateY: -76 * direction,
    opacity: 0.45,
    transition: { duration: 0.22, ease: "easeIn" },
  }),
};

export interface ScrapbookPhoto {
  url: string;
  label: string;
  filename: string;
}

const photoCaptions: Record<string, string> = captions;

export function Notebook({ photos, reduceMotion }: {
  photos: ScrapbookPhoto[];
  reduceMotion: boolean;
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
          <span className="cover-decoration cover-decoration-top illustrated-sticker art-butterfly" aria-hidden="true" />
          <span className="cover-decoration cover-decoration-bottom illustrated-sticker art-flowers" aria-hidden="true" />
          <span className="cover-portrait illustrated-sticker art-calico" aria-hidden="true" />
          <span className="cover-label">
            <span className="cover-title">Our little<br />scrapbook</span>
            <span className="cover-action">Open notebook <span aria-hidden="true">↗</span></span>
          </span>
        </button>
      ) : (
        <motion.div className="notebook-open"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.26 }}>
          <span className="notebook-binding" aria-hidden="true" />
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              className={`notebook-paper notebook-${pages[page].theme}`}
              custom={direction}
              variants={reduceMotion ? undefined : sheetTurn}
              initial={reduceMotion ? false : "enter"}
              animate="open"
              exit={reduceMotion ? undefined : "exit"}
            >
              <span className={`paper-stickers paper-stickers-top illustrated-sticker art-${pages[page].art}`} aria-hidden="true" />
              <span className="paper-stickers paper-stickers-bottom illustrated-sticker art-flowers" aria-hidden="true" />
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
                      <span className="notebook-placeholder" aria-hidden="true"><i className="illustrated-sticker art-butterfly" /></span>
                      <figcaption>Photo {String(slot + 1).padStart(2, "0")}</figcaption>
                    </figure>
                  );
                })}
              </div>
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
        </motion.div>
      )}
    </section>
  );
}
