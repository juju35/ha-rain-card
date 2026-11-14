// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one)
// that shows exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
import { dry, raining, stale, stopping, WX } from "./mock-states.mjs";

const pair = (file, type, width, config = {}, extra = {}, first = "light") => {
  const second = first === "light" ? "dark" : "light";
  return [
    { file, type, theme: first, width, config, ...extra },
    { file: `${file}-${second}`, type, theme: second, width, config, ...extra },
  ];
};

export const shots = [
  ...pair("card", "rain-card", 420),
  ...pair("mini-card", "rain-mini-card", 360),
  ...pair("mini-card-zoom", "rain-mini-card", 420, {}, { clicks: [".zoom"] }),
  ...pair("card-weather", "rain-card", 420, { entity: WX }, {}, "dark"),
  ...pair("card-stale", "rain-card", 420, {}, { overrides: stale }, "dark"),
  // Narrow cards: the full card at 6 of 12 columns of a phone's Sections view, the mini card at ~170 px.
  ...pair("card-narrow", "rain-card", 238, {}, { overrides: raining }),
  ...pair("mini-card-narrow", "rain-mini-card", 170),
];

// One looping GIF per state of the next hour, each with its own animation (the bars grow at the start of each loop,
// as they do whenever the forecast changes):
//   dry       — thin neutral bars, the now marker's halo breathing
//   rain-soon — the bars of the coming shower glowing
//   raining   — drops falling from the cloud of the badge and onto the rainy bars
//   stopping  — the same until the rain stops, dry bars after
export const gifs = [
  ...pair("dry", "rain-card", 420, {}, { overrides: dry }),
  ...pair("rain-soon", "rain-card", 420),
  ...pair("raining", "rain-card", 420, {}, { overrides: raining }, "dark"),
  ...pair("stopping", "rain-card", 420, {}, { overrides: stopping }, "dark"),
];
