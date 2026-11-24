// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
import { SOURCE_NAMES } from "./constants.js";

// A Météo-France next rain sensor: its 60-minute forecast attribute, or its registry entry (an unavailable sensor has
// no attributes left).
export const isMf = (s, hass) => {
  if (!s?.entity_id.startsWith("sensor.")) return false;
  if (s.attributes?.["1_hour_forecast"] !== undefined) return true;
  const e = hass?.entities?.[s.entity_id];
  return e?.platform === "meteo_france" && e.translation_key === "next_rain";
};
export const HOURLY = 2; // WeatherEntityFeature.FORECAST_HOURLY

// The forecast entity: the `entity` option, else the first Météo-France next rain sensor, else the first weather
// entity with an hourly forecast (or a forecast attribute), in the order of the entity ids.
export const isWx = (s) => s?.entity_id.startsWith("weather.") && (s.attributes?.supported_features & HOURLY || Array.isArray(s.attributes?.forecast));

export const scanSource = (hass) => {
  const all = Object.values(hass.states || {}).sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  const mf = all.find((s) => isMf(s, hass) && !hass.entities?.[s.entity_id]?.hidden);
  if (mf) return { id: mf.entity_id };
  const wx = all.find(isWx);
  return wx ? { id: wx.entity_id } : { error: "no_source" };
};

// The automatic scan sorts every state of the instance: it is kept while the entity registry and the number of
// states stay the same and the entity found still qualifies, so that a state change elsewhere costs no new scan.
export let sourceCache = null;
export const findSource = (hass, config) => {
  if (config.entity) return hass.states[config.entity] ? { id: config.entity } : { error: "unknown_entity" };
  const count = Object.keys(hass.states || {}).length;
  const c = sourceCache;
  if (c && c.hass === hass) return c.result;
  if (c && c.entities === hass.entities && c.count === count) {
    const s = c.result.id && hass.states[c.result.id];
    const still = c.result.id ? (c.result.id.startsWith("weather.") ? isWx(s) : isMf(s, hass)) : true;
    if (still) {
      c.hass = hass;
      return c.result;
    }
  }
  const result = scanSource(hass);
  sourceCache = { hass, entities: hass.entities, count, result };
  return result;
};

// The city of a Météo-France device ("Météo-France forecast for city Lyon - Rhône (69) - FR" → "Lyon").
export const cityOf = (name) => String(name ?? "").match(/(?:for city|pour la ville)\s+(.+?)(?:\s+-\s+|$)/i)?.[1] ?? "";

// The place the forecast is for: the `location` option, the city of the Météo-France device, the name of a weather
// entity without its device's name in front ("Forecast Home" → kept as is), else Home Assistant's location name.
export const locationOf = (hass, config, id) => {
  if (config.location) return config.location;
  const ent = hass.entities?.[id];
  const dev = ent?.device_id ? hass.devices?.[ent.device_id] : undefined;
  const city = cityOf(dev?.name);
  if (city) return city;
  const fn = String(hass.states[id]?.attributes?.friendly_name ?? "");
  if (id.startsWith("weather.") && fn) {
    const devName = dev?.name_by_user || dev?.name || "";
    const rest = devName && fn.startsWith(devName) ? fn.slice(devName.length).trim() : fn;
    return rest || fn;
  }
  return hass.config?.location_name || "";
};

export const sourceName = (hass, id) => {
  const p = hass.entities?.[id]?.platform;
  if (p) return SOURCE_NAMES[p] || p.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return isMf(hass.states[id], hass) ? SOURCE_NAMES.meteo_france : hass.states[id]?.attributes?.friendly_name || id;
};
