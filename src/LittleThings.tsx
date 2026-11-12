import "./little-things.css";

const notes = [
  { title: "Your laugh", kind: "heart", message: "Ang saya marinig ng tawa mo. Kahit corny yung joke ko, gusto pa rin kitang patawanin." },
  { title: "Your lambing", kind: "bow", message: "Kahit isang simpleng message mo lang, gumagaan na yung araw ko." },
  { title: "Time with you", kind: "star", message: "Kahit wala tayong plano at nagkukwentuhan lang, gusto ko yung ganung oras kasama ka." },
];

export function LittleThings() {
  return (
    <section className="little-things" id="little-things" aria-labelledby="little-things-title">
      <h2 id="little-things-title">Little things I love</h2>
      <div className="little-note-grid">
        {notes.map(({ title, kind, message }) => (
          <details className="little-note" key={title}>
            <summary>
              <span className={`paper-icon paper-icon-${kind}`} aria-hidden="true" />
              <span>{title}</span>
            </summary>
            <p>{message}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
