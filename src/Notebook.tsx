import { AnimatePresence, motion, useIsPresent, type Variants } from "motion/react";
import { useState, type ReactNode } from "react";
import captions from "./photo-captions.json";
import "./notebook.css";

const pages = [
  { title: "Little moments", art: "pot", theme: "rose" },
  { title: "Better together", art: "butterfly", theme: "lilac" },
  { title: "Look at us", art: "flowers", theme: "peach" },
  { title: "More to come", art: "flowers", theme: "blue" },
];
const photosPerPage = 5;

const sheetTurn: Variants = {
  enter: (direction: number) => ({ rotateY: 35 * direction, opacity: 0.72, zIndex: 1 }),
  open: {
    rotateY: 0,
    opacity: 1,
    zIndex: 1,
    transition: { duration: 0.44, ease: [0.2, 0.7, 0.25, 1] },
  },
  exit: (direction: number) => ({
    rotateY: -82 * direction,
    opacity: [1, 1, 0.22],
    zIndex: 2,
    transition: { duration: 0.38, ease: [0.38, 0.03, 0.68, 1] },
  }),
};

function NotebookSheet({ theme, direction, reduceMotion, children }: {
  theme: string; direction: number; reduceMotion: boolean; children: ReactNode;
}) {
  const present = useIsPresent();
  return (
    <motion.div
      className={`notebook-paper notebook-${theme}`}
      custom={direction}
      variants={reduceMotion ? undefined : sheetTurn}
      initial={reduceMotion ? false : "enter"}
      animate="open"
      exit={reduceMotion ? undefined : "exit"}
      inert={!present}
      aria-hidden={!present}
    >
      {children}
    </motion.div>
  );
}

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
          <span className="cover-portrait illustrated-sticker art-pot" aria-hidden="true" />
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
          <div className="notebook-sheets">
            <AnimatePresence initial={false} custom={direction}>
              <NotebookSheet key={page} theme={pages[page].theme} direction={direction} reduceMotion={reduceMotion}>
                <span className={`paper-stickers paper-stickers-top illustrated-sticker art-${pages[page].art}`} aria-hidden="true" />
                <span className="paper-stickers paper-stickers-bottom illustrated-sticker art-flowers" aria-hidden="true" />
                <span className="paper-edge-tape" aria-hidden="true" />
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
                        <span className="notebook-placeholder" aria-hidden="true"><i /></span>
                        <figcaption>Photo {String(slot + 1).padStart(2, "0")}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              </NotebookSheet>
            </AnimatePresence>
          </div>
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
