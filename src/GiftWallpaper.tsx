import type { CSSProperties } from "react";
import "./gift-wallpaper.css";

const illustrations = [
  ["tabby", 2, 17, 16, -22], ["calico", 22, 22, 13, 12], ["gray", 51, 3, 14, 7],
  ["cream", 76, 18, 15, -14], ["dark", 96, 48, 14, -23], ["dark", 32, 86, 16, 14],
  ["cream", 61, 94, 17, -14], ["calico", 84, 85, 15, 15], ["tabby", 7, 77, 13, 19],
  ["pot", 9, 41, 8, -16], ["pot", 66, 20, 7, 10], ["pot", 78, 61, 8, 10],
  ["pot", 18, 97, 8, 19], ["pot", 46, 64, 6, -15], ["pot", 9, 5, 7, -9],
  ["flowers", 34, 7, 8, -20], ["flowers", 32, 49, 8, 21], ["flowers", 87, 8, 8, 14],
  ["flowers", 72, 95, 9, -15], ["flowers", 6, 57, 8, -9], ["flowers", 94, 70, 7, 19],
  ["butterfly", 17, 61, 7, 24], ["butterfly", 67, 46, 8, -15], ["butterfly", 87, 38, 8, 20],
  ["flowers", 44, 97, 7, -13], ["flowers", 73, 33, 6, 17], ["pot", 96, 13, 7, 14],
] as const;

export function GiftWallpaper({ paused }: { paused: boolean }) {
  return (
    <div className={paused ? "gift-wallpaper wallpaper-paused" : "gift-wallpaper"} aria-hidden="true">
      {[0, 1, 2].map((layer) => (
        <div className="wallpaper-layer" key={layer}>
          {illustrations.map(([kind, x, y, size, tilt], index) => index % 3 === layer && (
            <span key={index} className={`wallpaper-sticker illustrated-sticker art-${kind}`} style={{
              "--sticker-x": `${x}%`,
              "--sticker-y": `${y}%`,
              "--sticker-width": `${size}vw`,
              "--sticker-tilt": `${tilt}deg`,
            } as CSSProperties} />
          ))}
        </div>
      ))}
      <span className="wallpaper-heart wallpaper-heart-one" />
      <span className="wallpaper-heart wallpaper-heart-two" />
      <span className="wallpaper-heart wallpaper-heart-three" />
    </div>
  );
}
