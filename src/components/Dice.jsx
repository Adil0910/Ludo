import { useCallback, useState } from "react";

const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

export function Face({ n, color }) {
  return (
    <div className="face" style={color ? { "--c": `var(--${color})` } : undefined}>
      {Array.from({ length: 9 }, (_, i) => (
        <s key={i} className={PIPS[n].includes(i) ? "p" : ""} />
      ))}
    </div>
  );
}

// roll() ek Promise return karta hai -> `const v = await roll()`
export function useRoll() {
  const [face, setFace] = useState(6);
  const [rolling, setRolling] = useState(false);

  const roll = useCallback(
    () =>
      new Promise((resolve) => {
        setRolling(true);
        navigator.vibrate?.(15);
        const final = 1 + Math.floor(Math.random() * 6);
        let count = 0;
        const iv = setInterval(() => {
          setFace(1 + Math.floor(Math.random() * 6));
          if (++count >= 9) {
            clearInterval(iv);
            setFace(final);
            setRolling(false);
            resolve(final);
          }
        }, 70);
      }),
    []
  );

  return { face, rolling, roll };
}

export function DiceButton({ face, rolling, onClick, big, color }) {
  return (
    <button className={`dice ${big ? "big" : ""} ${rolling ? "roll" : ""}`} onClick={onClick}>
      <Face n={face} color={color} />
    </button>
  );
}
