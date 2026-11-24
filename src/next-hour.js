// ---------------------------------------------------------------------------
// The next hour, read from the bars
// ---------------------------------------------------------------------------
import { BARS, MIN, STEP, WINDOW } from "./constants.js";

// { state, level, start, end, windowEnd, pos, index }: state among dry, soon, raining, stopping, stale, unknown and
// unavailable; `pos` the place of now along the ribbon (0 to 12 bars), `index` the bar now falls in.
export const analyse = (fc, now) => {
  const windowEnd = fc.start + WINDOW;
  const pos = Math.max(0, Math.min(BARS, (now - fc.start) / (STEP * MIN)));
  const index = Math.min(BARS - 1, Math.floor(pos));
  const base = { pos, index, windowEnd };
  if (fc.unavailable) return { ...base, state: "unavailable" };
  if (fc.stale || now >= windowEnd) return { ...base, state: "stale" };
  const bars = fc.bars;
  if (bars.slice(index).every((v) => v === null)) return { ...base, state: "unknown" };
  const at = (i) => fc.start + i * STEP * MIN;
  // A shower from bar `from`: its strongest level and its end (null when it lasts past the hour or into bars
  // without data, where the end is not known).
  const episode = (from) => {
    let j = from;
    while (j < BARS && bars[j] > 0) j++;
    return { level: Math.max(...bars.slice(from, j)), end: j < BARS && bars[j] === 0 ? at(j) : null };
  };
  if (bars[index] > 0) {
    const ep = episode(index);
    return { ...base, state: ep.end ? "stopping" : "raining", level: ep.level, end: ep.end ?? windowEnd };
  }
  const next = bars.findIndex((v, i) => i > index && v > 0);
  if (next < 0) return { ...base, state: "dry" };
  const ep = episode(next);
  return { ...base, state: "soon", level: ep.level, start: at(next), end: ep.end };
};
