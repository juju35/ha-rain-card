// Mock Home Assistant registries and states shaped like the Météo-France integration (its next rain sensor, with the
// 60-minute forecast in 5- then 10-minute steps) and a met.no weather entity, used to render the screenshots and by
// the tests. Entity ids are in French on purpose (the cards never rely on them); the names shown are in English.
// Every time is relative to NOW (14:22 in Paris), which the screenshot script freezes the page clock at.
export const NOW = Date.UTC(2026, 10, 10, 13, 22, 0);
export const TIME_ZONE = "Europe/Paris";
export const states = {};
export const entities = {};
export const devices = {};

const iso = (ms) => new Date(ms).toISOString();
const MIN = 60e3;
// Reference time of the Météo-France forecast: the 5-minute step before NOW (14:20).
export const REF = NOW - 2 * MIN;

const OFFSETS = ["0 min", "5 min", "10 min", "15 min", "20 min", "25 min", "35 min", "45 min", "55 min"];
const S = "Temps sec";
const F = "Pluie faible";
const M = "Pluie modérée";
const H = "Pluie forte";

// The attributes of the next rain sensor for nine labels, and its state: the time of the first rain, else unknown.
const rain = (labels, ref = REF) => {
  const first = labels.findIndex((l) => l !== S);
  const off = first < 0 ? null : Number.parseInt(OFFSETS[first], 10);
  return {
    state: off === null ? "unknown" : iso(ref + off * MIN),
    attributes: {
      forecast_time_ref: iso(ref),
      "1_hour_forecast": Object.fromEntries(OFFSETS.map((o, i) => [o, labels[i]])),
      attribution: "Data provided by Météo-France",
      device_class: "timestamp",
      friendly_name: "Météo-France forecast for city Lyon - Rhône (69) - FR Lyon Next rain",
    },
    last_changed: iso(ref - 3 * MIN),
    last_updated: iso(ref - MIN),
  };
};

export const MF = "sensor.meteo_france_prevision_lyon_prochaine_pluie";
export const WX = "weather.prevision_maison";

devices.mf = { id: "mf", name: "Météo-France forecast for city Lyon - Rhône (69) - FR", manufacturer: "Météo-France", model: "Météo-France mobile API", name_by_user: null };
entities[MF] = { entity_id: MF, device_id: "mf", platform: "meteo_france", translation_key: "next_rain" };
// Rain at 14:35, light then moderate, dry again from 15:00.
states[MF] = { entity_id: MF, ...rain([S, S, S, F, M, M, F, S, S]) };

devices.met = { id: "met", name: "Home", manufacturer: "Met.no", model: "Forecast", name_by_user: null };
entities[WX] = { entity_id: WX, device_id: "met", platform: "met", translation_key: null };
states[WX] = {
  entity_id: WX,
  state: "cloudy",
  attributes: { temperature: 11, supported_features: 3, friendly_name: "Home", attribution: "Weather forecast from met.no" },
  last_changed: iso(NOW - 40 * MIN),
  last_updated: iso(NOW - 10 * MIN),
};

// Hourly forecast of the weather entity (weather.get_forecasts, type hourly): dry, then rain building up.
const HOUR = 60 * MIN;
const hour0 = Math.floor(NOW / HOUR) * HOUR;
export const hourly = [
  [-1, 0, "cloudy"],
  [0, 0, "cloudy"],
  [1, 3.2, "rainy"],
  [2, 6.4, "pouring"],
  [3, 1.1, "rainy"],
].map(([h, precipitation, condition]) => ({ datetime: iso(hour0 + h * HOUR), condition, precipitation, precipitation_probability: precipitation ? 80 : 10, temperature: 11 }));

// The answer of the call_service message for weather.get_forecasts.
export const forecastResponse = (msg) => ({ context: {}, response: { [msg.target.entity_id]: { forecast: hourly } } });

// Overrides of the next rain sensor for the other states.
export const dry = { [MF]: rain([S, S, S, S, S, S, S, S, S]) };
export const raining = { [MF]: rain([F, M, M, H, H, M, M, F, F]) };
export const stopping = { [MF]: rain([H, M, M, F, F, S, S, S, S]) };
export const stale = { [MF]: rain([S, F, M, M, F, S, S, S, S], REF - 2 * HOUR) };
