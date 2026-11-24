// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------
import { lang, t } from "./helpers.js";

export const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

// Keeps the YAML minimal: drops empty values and options left at their default.
export const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (const [k, v] of Object.entries(config)) {
    if (v === "" || v === undefined || v === null || (k in defaults && v === defaults[k])) delete config[k];
  }
  return config;
};

export class RainCardEditor extends HTMLElement {
  // [name, default]
  static get toggles() {
    return [
      ["illustration", true],
      ["show_title", true],
      ["show_subtitle", true],
      ["show_details", true],
      ["show_ribbon", true],
      ["show_source", true],
    ];
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // Default values, dropped from the YAML: the toggles and the illustration theme (automatic: the sun or the dark theme).
  _defaults() {
    return { ...Object.fromEntries(this.constructor.toggles), illustration_theme: "auto" };
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "entity", selector: { entity: { filter: [{ domain: "sensor", integration: "meteo_france" }, { domain: "weather" }] } } },
      { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "location", selector: { text: {} } }] },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      {
        name: "illustration_theme",
        selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((value) => ({ value, label: tr(`theme_${value}`) })) } },
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => t(this._hass, this._config, s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : s.name === "entity" ? t(this._hass, this._config, "entity_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, this._defaults());
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this._config };
    for (const [name, def] of Object.entries(this._defaults())) if (data[name] === undefined) data[name] = def;
    this._form.hass = this._hass;
    if (this._dataFor !== this._config) {
      this._dataFor = this._config;
      this._form.data = data;
    }
    const l = lang(this._hass, this._config);
    if (this._schemaLang !== l) {
      this._schemaLang = l;
      this._form.schema = this._schema();
    }
  }
}

// The options of the full card, which the unfolded view uses, and the detail button.
export class RainMiniCardEditor extends RainCardEditor {
  static get toggles() {
    return [...RainCardEditor.toggles, ["zoom", true]];
  }
}
