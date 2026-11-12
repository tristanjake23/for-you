import { motion } from "motion/react";
import type { ReactNode } from "react";
import "./letter.css";

const letterStickers = ["💌", "🦋", "🌷", "🎀", "💖", "🌙", "✨", "🌸"];

export function Letter({ reduceMotion, kitten }: { reduceMotion: boolean; kitten: ReactNode }) {
  return (
    <section className="letter-section" id="letter" aria-labelledby="letter-title">
      <motion.article
        className="love-note letter-paper"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
      >
        <div className="letter-stickers" aria-hidden="true">
          {letterStickers.map((sticker) => <span key={sticker}>{sticker}</span>)}
        </div>
        <span className="letter-stamp" aria-hidden="true">♥</span>
        <h2 id="letter-title">Para sa’yo, Bembem</h2>
        <div className="letter-copy">
          <p>Hi, love.</p>
          <p>Ginawa ko ’to para may mabuksan ka kapag gusto mong kiligin o kapag nami-miss mo ako. Ang saya ko sa’yo, kahit simpleng kwentuhan lang. Minsan nga, isang message mo lang, nakangiti na agad ako.</p>
          <p>Thank you sa lambing mo at sa mga tawa natin. Gusto ko pang gumawa ng maraming memories kasama ka, kahit simpleng lakad lang o tambay na walang plano. Basta kasama kita, game ako.</p>
          <p>Kung nami-miss mo ako ngayon, message mo ’ko. Miss din kita. I love you, Bembem. ♡</p>
          <p className="letter-signature">— Tristan</p>
        </div>
        {kitten}
      </motion.article>
    </section>
  );
}
