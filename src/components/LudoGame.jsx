import { memo, useReducer, useRef, useState } from "react";
import { COLORS, PATH, SAFE, START_CELLS, canMove, homeCell, tokenXY, trackIndex } from "../ludo/board";
import { DiceButton, useRoll } from "./Dice";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Board = memo(function Board() {
  const bases = [[1, 1], [1, 10], [10, 10], [10, 1]];
  return (
    <div id="board">
      {bases.map(([r, c], p) => (
        <div key={p} className={`base ${COLORS[p]}`} style={{ gridArea: `${r}/${c}/${r + 6}/${c + 6}` }}>
          <div className="in"><u /><u /><u /><u /></div>
        </div>
      ))}
      <div className="ctr" style={{ gridArea: "7/7/10/10" }} />
      {PATH.map(([r, c], i) => {
        const s = START_CELLS.indexOf(i);
        return (
          <div key={i} className={`c ${s >= 0 ? COLORS[s] : ""}`} style={{ gridArea: `${r + 1}/${c + 1}` }}>
            {SAFE.includes(i) && s < 0 ? "★" : ""}
          </div>
        );
      })}
      {[0, 1, 2, 3].flatMap((p) =>
        [1, 2, 3, 4, 5].map((k) => {
          const [r, c] = homeCell(p, k);
          return <div key={`${p}${k}`} className={`c ${COLORS[p]}`} style={{ gridArea: `${r + 1}/${c + 1}` }} />;
        })
      )}
    </div>
  );
});

export default function LudoGame({ players, onExit, onRematch }) {
  const { face, rolling, roll } = useRoll();
  const [, force] = useReducer((x) => x + 1, 0);
  const [winner, setWinner] = useState(null);

  // Game state ref mein rakha hai taaki async animation mein stale closure na aaye
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = { t: players.map(() => [-1, -1, -1, -1]), cur: 0, phase: "roll", d: 0, mv: [] };
  }
  const G = ref.current;
  const me = players[G.cur];

  const next = (bonus) => {
    if (!bonus) G.cur = (G.cur + 1) % players.length;
    G.phase = "roll";
    G.mv = [];
    force();
  };

  const move = async (i) => {
    const c = G.cur, d = G.d, t = G.t, pl = players[c];
    G.phase = "move";
    G.mv = [];
    if (t[c][i] < 0) {
      t[c][i] = 0; force(); await sleep(260);
    } else {
      for (let s = 0; s < d; s++) { t[c][i]++; force(); await sleep(140); }
    }
    let bonus = d === 6;
    const pos = t[c][i];
    if (pos <= 50) {
      const a = trackIndex(pl.p, pos);
      if (!SAFE.includes(a)) {
        players.forEach((o, oi) => {
          if (oi === c) return;
          t[oi].forEach((q, j) => {
            if (q >= 0 && q <= 50 && trackIndex(o.p, q) === a) { t[oi][j] = -1; bonus = true; }
          });
        });
      }
    }
    if (pos === 56) bonus = true;
    force();
    await sleep(220);
    if (t[c].every((x) => x === 56)) return setWinner(pl.name);
    next(bonus);
  };

  const onRoll = async () => {
    if (G.phase !== "roll") return;
    G.phase = "rolling";
    force();
    const d = await roll();
    G.d = d;
    const row = G.t[G.cur];
    const mv = row.map((_, i) => i).filter((i) => canMove(row[i], d));
    if (!mv.length) { await sleep(700); return next(false); }
    if (new Set(mv.map((i) => row[i])).size === 1) return move(mv[0]); // ek hi choice -> auto move
    G.phase = "pick";
    G.mv = mv;
    force();
  };

  // Tokens + stacking offset
  const items = [], cnt = {};
  players.forEach((pl, pi) =>
    G.t[pi].forEach((pos, i) => {
      const [x, y] = tokenXY(pl.p, pos, i);
      const k = pos >= 0 && pos < 56 ? `${x},${y}` : `${pi}-${i}`;
      items.push({ pi, i, x, y, k });
      cnt[k] = (cnt[k] || 0) + 1;
    })
  );
  const seen = {};

  return (
    <section className="scr">
      <button className="back" onClick={onExit}>←</button>
      <div id="who" style={{ background: `var(--${COLORS[me.p]})` }}>{me.name} ki baari</div>
      <DiceButton face={face} rolling={rolling} color={COLORS[me.p]} onClick={onRoll} />
      <div id="bw">
        <Board />
        {items.map((o) => {
          const n = cnt[o.k], j = (seen[o.k] = (seen[o.k] || 0) + 1);
          const off = n > 1 ? (j - (n + 1) / 2) * 0.28 : 0;
          const mv = G.phase === "pick" && o.pi === G.cur && G.mv.includes(o.i);
          return (
            <div
              key={`${o.pi}-${o.i}`}
              className={`tk ${COLORS[players[o.pi].p]} ${mv ? "mv" : ""}`}
              style={{ left: `${((o.x + off) / 15) * 100}%`, top: `${(o.y / 15) * 100}%` }}
              onClick={() => mv && move(o.i)}
            />
          );
        })}
      </div>
      <DiceButton face={face} rolling={rolling} color={COLORS[me.p]} onClick={onRoll} />
      <div id="who" style={{ background: `var(--${COLORS[me.p]})` }}>{me.name} ki baari</div>

      {winner && (
        <div className="scr win">
          <h2>🏆 {winner} jeet gaya!</h2>
          <button className="btn" onClick={onRematch}>Dobara khelo</button>
          <button className="link" onClick={onExit}>Menu</button>
        </div>
      )}
    </section>
  );
}
