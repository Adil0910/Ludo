// Colors: 0 red (top-left), 1 green (top-right), 2 yellow (bottom-right), 3 blue (bottom-left)
export const COLORS = ["r", "g", "y", "b"];
export const SAFE = [0, 13, 26, 39, 8, 21, 34, 47];
export const START_CELLS = [0, 13, 26, 39];
export const PLAYER_IDS = (n) => [[0, 2], [0, 1, 2], [0, 1, 2, 3]][n - 2];

// 52 cells ka clockwise path (row, col) 15x15 grid par
export const PATH = [];
const add = (r, c) => PATH.push([r, c]);
for (let c = 1; c <= 5; c++) add(6, c);
for (let r = 5; r >= 0; r--) add(r, 6);
add(0, 7); add(0, 8);
for (let r = 1; r <= 5; r++) add(r, 8);
for (let c = 9; c <= 14; c++) add(6, c);
add(7, 14); add(8, 14);
for (let c = 13; c >= 9; c--) add(8, c);
for (let r = 9; r <= 14; r++) add(r, 8);
add(14, 7); add(14, 6);
for (let r = 13; r >= 9; r--) add(r, 6);
for (let c = 5; c >= 0; c--) add(8, c);
add(7, 0); add(6, 0);

export const homeCell = (p, k) => [[7, k], [k, 7], [7, 14 - k], [14 - k, 7]][p];

// Token position: -1 base, 0..50 track, 51..55 home column, 56 finished
export const canMove = (pos, d) => (pos < 0 ? d === 6 : pos + d <= 56);
export const trackIndex = (p, pos) => (13 * p + pos) % 52;

export function tokenXY(p, pos, i) {
  if (pos < 0) {
    const [r, c] = [[0, 0], [0, 9], [9, 9], [9, 0]][p];
    return [c + 2 + (i % 2) * 2, r + 2 + (i >> 1) * 2];
  }
  if (pos <= 50) {
    const [r, c] = PATH[trackIndex(p, pos)];
    return [c + 0.5, r + 0.5];
  }
  if (pos < 56) {
    const [r, c] = homeCell(p, pos - 50);
    return [c + 0.5, r + 0.5];
  }
  const [dx, dy] = [[-0.6, 0], [0, -0.6], [0.6, 0], [0, 0.6]][p];
  return [7.5 + dx + (i - 1.5) * 0.1, 7.5 + dy];
}
