import { useState } from "react";
import { COLORS, PLAYER_IDS } from "../ludo/board";

export default function Setup({ onBack, onStart }) {
  const [n, setN] = useState(4);
  const [names, setNames] = useState(["", "", "", ""]);
  const ids = PLAYER_IDS(n);

  const setName = (k, v) => setNames((a) => a.map((x, i) => (i === k ? v : x)));
  const start = () =>
    onStart(ids.map((p, k) => ({ p, name: names[k].trim() || `Player ${k + 1}` })));

  return (
    <section className="scr">
      <button className="back" onClick={onBack}>←</button>
      <h1>Kitne Players?</h1>
      <div className="chips">
        {[2, 3, 4].map((x) => (
          <button key={x} className={`chip ${n === x ? "on" : ""}`} onClick={() => setN(x)}>{x}</button>
        ))}
      </div>
      <div className="names">
        {ids.map((p, k) => (
          <label key={p}>
            <span className={`dot ${COLORS[p]}`} />
            <input
              maxLength={12}
              placeholder={`Player ${k + 1}`}
              value={names[k]}
              onChange={(e) => setName(k, e.target.value)}
            />
          </label>
        ))}
      </div>
      <button className="btn" onClick={start}>▶ Start Game</button>
    </section>
  );
}
