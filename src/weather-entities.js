// ---------------------------------------------------------------------------
// Weather entities: hourly (or finer) precipitation → twelve 5-minute bars
// ---------------------------------------------------------------------------
import { BARS, MIN, RAINY_CONDITIONS, RATE_LEVELS, STEP } from "./constants.js";

export const rateLevel = (rate) => (rate < RATE_LEVELS[0] ? 0 : rate < RATE_LEVELS[1] ? 1 : rate < RATE_LEVELS[2] ? 2 : 3);

// Forecast entries ({ datetime, precipitation, condition }) → 12 levels from `start`. Each bar takes the entry whose
// period covers its middle (an hour for an hourly forecast): its precipitation turned into a rate in mm/h, else, when
// it gives none, its condition (rainy, pouring…). No interpolation: an hourly forecast does not tell when in the hour
// the rain falls, so a rainy hour reads as rain from its start, which is what the card says ("hourly forecast").
// null where no entry covers the bar.
export const weatherBars = (entries, start) => {
  const list = (Array.isArray(entries) ? entries : [])
    .map((e) => ({ t: Date.parse(e?.datetime), p: e?.precipitation === null || e?.precipitation === undefined ? null : Number(e.precipitation), c: e?.condition }))
    .map((e) => ({ ...e, p: Number.isFinite(e.p) ? e.p : null }))
    .filter((e) => Number.isFinite(e.t))
    .sort((a, b) => a.t - b.t);
  if (!list.length) return { bars: Array(BARS).fill(null), coarse: false };
  const gaps = list.slice(1).map((e, i) => e.t - list[i].t);
  const period = gaps.length ? Math.min(...gaps) : 60 * MIN;
  const bars = Array.from({ length: BARS }, (_, b) => {
    const at = start + (b * STEP + STEP / 2) * MIN;
    // The current period may be missing (a forecast starting at the next hour): the first one stands for it.
    const cover = list.find((e) => at >= e.t && at < e.t + period) ?? (at < list[0].t && list[0].t - at < period ? list[0] : null);
    if (!cover) return null;
    return cover.p === null ? (RAINY_CONDITIONS[cover.c] ?? 0) : rateLevel((cover.p * 60 * MIN) / period);
  });
  return { bars, coarse: period >= 30 * MIN };
};
