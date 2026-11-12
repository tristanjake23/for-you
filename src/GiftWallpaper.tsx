import type { CSSProperties } from "react";
import closeup from "./assets/opening-dogs/closeup.webp";
import smiling from "./assets/opening-dogs/smiling.webp";
import standing from "./assets/opening-dogs/standing.webp";
import resting from "./assets/opening-dogs/resting.webp";
import "./gift-wallpaper.css";

const dogImages: Partial<Record<string, string>> = { closeup, smiling, standing, resting };

const illustrations = [
  ["resting", 2, 17, 16, -22], ["standing", 22, 22, 13, 12], ["closeup", 51, 3, 14, 7],
  ["smiling", 76, 18, 15, -14], ["closeup", 96, 48, 14, -23], ["resting", 32, 86, 16, 14],
  ["smiling", 61, 94, 17, -14], ["standing", 84, 85, 15, 15], ["closeup", 7, 77, 13, 19],
  ["pot", 9, 41, 8, -16], ["pot", 66, 20, 7, 10], ["pot", 78, 61, 8, 10],
  ["pot", 18, 97, 8, 19], ["pot", 46, 64, 6, -15], ["pot", 9, 5, 7, -9],
  ["flowers", 34, 7, 8, -20], ["flowers", 32, 49, 8, 21], ["flowers", 87, 8, 8, 14],
  ["flowers", 72, 95, 9, -15], ["flowers", 6, 57, 8, -9], ["flowers", 94, 70, 7, 19],
  ["butterfly", 17, 61, 7, 24], ["butterfly", 67, 46, 8, -15], ["butterfly", 87, 38, 8, 20],
  ["flowers", 44, 97, 7, -13], ["flowers", 73, 33, 6, 17], ["pot", 96, 13, 7, 14],
  ["butterfly", 31, 17, 5, -23], ["flowers", 18, 38, 5, -8], ["pot", 27, 70, 6, 13],
  ["flowers", 16, 82, 5, 16], ["flowers", 4, 95, 7, -12], ["butterfly", 34, 64, 5, 13],
  ["flowers", 52, 87, 6, 13], ["butterfly", 74, 74, 5, -8], ["pot", 91, 92, 6, 13],
  ["flowers", 83, 53, 5, -14], ["flowers", 93, 26, 5, 14], ["butterfly", 61, 8, 5, 21],
  ["pot", 43, 14, 5, -19], ["flowers", 39, 30, 5, 16], ["butterfly", 11, 23, 5, -15],
  ["flowers", 72, 7, 6, 9], ["pot", 70, 86, 5, -12], ["flowers", 59, 67, 5, 16],
] as const;

export function GiftWallpaper({ paused }: { paused: boolean }) {
  return (
    <div className={paused ? "gift-wallpaper wallpaper-paused" : "gift-wallpaper"} aria-hidden="true">
      {[0, 1, 2].map((layer) => (
        <div className="wallpaper-layer" key={layer}>
          {illustrations.map(([kind, x, y, size, tilt], index) => {
            if (index % 3 !== layer) return null;

            const style = {
              "--sticker-x": `${x}%`,
              "--sticker-y": `${y}%`,
              "--sticker-width": `${size}vw`,
              "--sticker-tilt": `${tilt}deg`,
            } as CSSProperties;
            const dogImage = dogImages[kind];
            return dogImage ? (
              <img key={index} className="wallpaper-sticker wallpaper-dog" src={dogImage} alt="" style={style} />
            ) : (
              <span key={index} className={`wallpaper-sticker illustrated-sticker art-${kind}`} style={style} />
            );
          })}
        </div>
      ))}
      <span className="wallpaper-heart wallpaper-heart-one" />
      <span className="wallpaper-heart wallpaper-heart-two" />
      <span className="wallpaper-heart wallpaper-heart-three" />
      <span className="cinema-edge cinema-edge-top" />
      <span className="cinema-edge cinema-edge-bottom" />
      <span className="cinema-corner cinema-corner-left" />
      <span className="cinema-corner cinema-corner-right" />
    </div>
  );
}
