// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
import { STRINGS } from "./i18n/strings.js";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region) when its base
// matches the card language, else that language; a bare "pt" (European Portuguese for Home Assistant) is "pt-PT".
export const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

export const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

// The whole width of an element's text in its own font, an ellipsised one included.
export const textWidth = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
};

export const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

export const TIME_FMT = {};
// "14:35" in the language, in Home Assistant's time zone when the profile asks for the server's, 12 or 24 h as set.
export const fmtTime = (ms, hass, locale) => {
  const tz = hass?.locale?.time_zone === "server" ? hass.config?.time_zone : undefined;
  const tf = hass?.locale?.time_format;
  const hour12 = tf === "12" ? true : tf === "24" ? false : undefined;
  const key = `${locale}|${tz}|${hour12}`;
  TIME_FMT[key] ??= new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", ...(tz ? { timeZone: tz } : {}), ...(hour12 === undefined ? {} : { hour12 }) });
  return TIME_FMT[key].format(ms);
};
