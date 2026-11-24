// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MIN = 60e3;
export const STEP = 5; // minutes per bar
export const BARS = 12; // 12 × 5 min = the next hour
export const WINDOW = STEP * BARS * MIN;
// Météo-France refreshes its rain forecast every 5 minutes: a reference time older than this is out of date.
export const MF_STALE_MS = 20 * MIN;
// A weather forecast fetched longer ago than this is fetched again (also whenever the weather entity changes).
export const WX_REFRESH_MS = 15 * MIN;
// …and one older than this, which could not be refreshed, is out of date.
export const WX_STALE_MS = 3 * 60 * MIN;
// Rain rate (mm/h) thresholds of the intensities: light, moderate, heavy (the usual 2.5 / 7.6 mm/h scale).
export const RATE_LEVELS = [0.1, 2.5, 7.6];
export const RAINY_CONDITIONS = { rainy: 1, "snowy-rainy": 1, "lightning-rainy": 2, pouring: 3, hail: 2 };
// Integration names shown under the ribbon (the platform of the forecast entity).
export const SOURCE_NAMES = {
  meteo_france: "Météo-France",
  met: "Met.no",
  openweathermap: "OpenWeatherMap",
  accuweather: "AccuWeather",
  pirateweather: "Pirate Weather",
  tomorrowio: "Tomorrow.io",
  buienradar: "Buienradar",
  dwd_weather: "DWD",
  smhi: "SMHI",
  ipma: "IPMA",
  aemet: "AEMET",
  knmi: "KNMI",
  nws: "NWS",
  environment_canada: "Environment Canada",
  meteoswiss: "MeteoSwiss",
  open_meteo: "Open-Meteo",
  google_weather: "Google Weather",
  weatherflow_cloud: "WeatherFlow",
};

// State of the next hour → color class of the pill and the badge.
export const STATE_CLASS = { dry: "ok", soon: "soon", raining: "rain", stopping: "stop", stale: "idle", unknown: "idle", unavailable: "crit" };
