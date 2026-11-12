import "./cat-stickers.css";

export function CatStickers({ paused = false }: { paused?: boolean }) {
  return (
    <div className={paused ? "cat-pair cats-paused" : "cat-pair"} aria-hidden="true">
      {["peach", "lilac"].map((color) => (
        <span className={`cat-sticker cat-${color}`} key={color}>
          <span className="cat-tail" />
          <span className="cat-ear cat-ear-left" />
          <span className="cat-ear cat-ear-right" />
          <span className="cat-face">
            <i className="cat-eyes" />
            <i className="cat-nose" />
            <i className="cat-paw cat-paw-left" />
            <i className="cat-paw cat-paw-right" />
          </span>
          <span className="cat-charm">♥</span>
        </span>
      ))}
    </div>
  );
}
