// ---------------------------------------------------------------------------
// Météo-France: 1_hour_forecast → twelve 5-minute bars
// ---------------------------------------------------------------------------
import { BARS, STEP } from "./constants.js";

// A rain label of Météo-France → intensity 0 (dry) to 3 (heavy), null for "no data". Météo-France writes French
// ("Temps sec", "Pluie faible", "Pluie modérée", "Pluie forte", "Données indisponibles"), its API can answer in
// English ("Dry weather", "Light rain"…), and the rain codes 1 to 4 (0: no data) may come as numbers.
export const LEVEL_WORDS = [
  [null, /indisponible|unavailable|no data|non disponible|inconnu|unknown|n\/a/],
  [0, /\bsec\b|\bdry\b|no rain|pas de pluie|pas de pr[ée]cipitation|aucune|\bnone\b|trocken|\bseco\b|asciutto/],
  [3, /\bfort|heavy|intense|strong|stark|fuerte|violent/],
  [2, /mod[ée]r|moderate|medium|moyen|m[äa]ßig|moderad|moderat/],
  [1, /faible|light|weak|slight|\bfine\b|bruine|drizzle|leicht|d[ée]bil|liger|debole/],
  [1, /pluie|rain|pr[ée]cipitation|averse|shower|regen|lluvia|pioggia/],
];
export const rainLevel = (raw) => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number" || /^\s*\d+\s*$/.test(String(raw))) {
    const n = Number(raw);
    return n >= 1 && n <= 4 ? n - 1 : null;
  }
  const s = String(raw).toLowerCase().trim();
  if (!s) return null;
  for (const [level, re] of LEVEL_WORDS) if (re.test(s)) return level;
  return null;
};

// Météo-France gives 5-minute steps for the first half hour ("0 min" … "25 min") then 10-minute steps, keyed by
// their middle ("35 min", "45 min", "55 min"): each slot is mapped onto the 5-minute bars it covers. A 10-minute slot
// keyed by its start ("30 min", "40 min", "50 min") is read as well. Returns 12 levels (0–3), null where there is no
// data.
export const mfBars = (forecast) => {
  const spans = Object.entries(forecast && typeof forecast === "object" ? forecast : {})
    .map(([k, v]) => ({ o: Number.parseInt(String(k).replace(/^\D*/, ""), 10), v: rainLevel(v) }))
    .filter((s) => Number.isFinite(s.o))
    .map(({ o, v }) => {
      if (o < 30) return { from: o, to: o + STEP, v };
      const from = o % 10 === 5 ? o - 5 : o;
      return { from, to: from + 10, v };
    });
  return Array.from({ length: BARS }, (_, b) => spans.find((sp) => b * STEP >= sp.from && b * STEP < sp.to)?.v ?? null);
};
