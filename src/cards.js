// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
import { ICONS } from "./icons.js";
import { BARS, MF_STALE_MS, MIN, STATE_CLASS, STEP, WX_REFRESH_MS, WX_STALE_MS } from "./constants.js";
import { esc, fmtTime, intlLocale, svgIcon, t, textWidth } from "./helpers.js";
import { mfBars } from "./m-t-o.js";
import { weatherBars } from "./weather-entities.js";
import { analyse } from "./next-hour.js";
import { findSource, locationOf, sourceName } from "./sources.js";
import { morph } from "./dom-patching.js";
import { BASE_STYLE, FULL_STYLE, MINI_STYLE } from "./styles.js";
import { BANNER_STYLE, SCENE_KIND, isNight, rainSceneSvg } from "./illustration.js";
import { sameDeps, watchOutside } from "./outside-clicks.js";

export let cardUid = 0;

export class RainCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._gen = 0;
    this._uid = ++cardUid;
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // Enter / Space on an element with the button role acts as a click, as on a <button>.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
  }

  static getConfigElement() {
    return document.createElement("rain-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  // Home Assistant pushes a new hass on every state change of the whole instance: the card is only redrawn when
  // something it shows changed (see _deps).
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass: the forecast entity, the registries, language and time settings, the weather
  // forecast fetched and the minute (the now marker moves on).
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const { id, error } = findSource(h, this._config);
    // No source: the error card only changes with the error (a source that appears ends it) and the language.
    if (!id) return [error, h.language, h.locale, h.config, h.themes?.darkMode];
    return [h.states[id], h.entities, h.devices, h.language, h.locale, h.config, h.themes?.darkMode, this._wx, this._minute];
  }

  connectedCallback() {
    if (this._hass && this._config) this._update();
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === "function") {
      this._resize ??= new ResizeObserver((entries) => {
        const w = Math.round(entries.at(-1).contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
    // The now marker and the minutes left move on their own: redrawn every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / MIN);
      if (this._hass) this.hass = this._hass;
    }, MIN);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._resize?.disconnect();
    this._fitWidth = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entity !== undefined && typeof config.entity !== "string") throw new Error("entity must be an entity id");
    this._config = { ...config };
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  // `colors:` overrides the per-intensity bar colors (level 1 light, 2 moderate, 3 heavy; `crit` tints the alert state).
  // Each value is a CSS color (hex, rgb(), var(), a named color…); values with CSS-breaking characters are ignored.
  _colorVars() {
    const c = this._config.colors;
    if (!c || typeof c !== "object") return "";
    const map = { light: "--rc-light", moderate: "--rc-moderate", heavy: "--rc-heavy", crit: "--rc-crit" };
    const safe = (v) => (typeof v === "string" && v.length > 0 && v.length < 64 && !/[;{}<>]/.test(v) ? v.trim() : null);
    const decls = [];
    for (const [key, name] of Object.entries(map)) {
      const v = safe(c[key]);
      if (v) decls.push(`${name}: ${v};`);
    }
    return decls.length ? `<style>:host{${decls.join("")}}</style>` : "";
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _time(ms) {
    return fmtTime(ms, this._hass, this._locale());
  }

  _update() {
    if (!this._hass || !this._config) return;
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      morph(this.shadowRoot, html);
      // Measured again only when the markup changed; a new width or the web font is caught by the observer.
      this._fitPill();
    }
    this._syncWeather();
  }

  // The status pill stays at the right end of the title's row only while the whole title and the pill's whole label fit on that
  // row; otherwise it takes a line of its own under the subtitle (.below), and when even then the title, the subtitle
  // and the pill would not fit above the banner's lawn strip, it keeps its dot alone (.pill-dot). Measured in the
  // real fonts, so that every language and title length gets its own answer.
  _fitPill() {
    // Home Assistant's <ha-card> (a Lit element) shows its content only from its first update, a microtask after it
    // is connected: measured before, everything is 0 px wide and the pill lands on the wrong line. Fitted then.
    const haCard = this.shadowRoot?.querySelector?.("ha-card");
    if (haCard && haCard.hasUpdated === false) {
      this._pillWait ??= (haCard.updateComplete?.then ? haCard.updateComplete : new Promise((r) => requestAnimationFrame(r))).then(() => {
        this._pillWait = null;
        this._fitPill();
      });
      return;
    }
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector(":scope > .trow");
      const chip = row?.querySelector(":scope > .chip");
      if (!chip?.getBoundingClientRect) continue;
      t.classList.remove("below", "pill-dot");
      const name = row.querySelector(":scope > .name");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const title = name ? textWidth(name) + gap : 0;
      const pill = chip.getBoundingClientRect().width;
      if (title + pill <= row.getBoundingClientRect().width) continue;
      t.classList.add("below");
      const r = t.getBoundingClientRect();
      const banner = t.closest(".banner");
      const box = banner?.getBoundingClientRect();
      const floor = banner?.querySelector(".rc-ground")?.getBoundingClientRect().top ?? box?.bottom;
      const tall = box && (r.bottom > floor + 0.5 || r.top < box.top - 0.5);
      if (tall || pill > r.width + 0.5) t.classList.add("pill-dot");
    }
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    if (el.dataset.action === "zoom") return this._toggleZoom(ev);
    if (el.dataset.entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: el.dataset.entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  // ---- Forecast ----------------------------------------------------------

  // { id, start, bars, coarse, stale, unavailable, ref, error }: the twelve bars of the next hour from the source.
  _forecast(id) {
    const s = this._hass.states[id];
    const now = Date.now();
    if (!s || s.state === "unavailable") return { id, start: now, bars: Array(BARS).fill(null), unavailable: true };
    if (!id.startsWith("weather.")) {
      const ref = Date.parse(s.attributes?.forecast_time_ref ?? s.last_updated);
      const start = Number.isFinite(ref) ? ref : now;
      let bars = mfBars(s.attributes?.["1_hour_forecast"]);
      // No minute forecast, only the time of the next rain (state): dry until then, rain from then on.
      const next = Date.parse(s.state);
      const guessed = bars.every((v) => v === null) && Number.isFinite(next);
      if (guessed) bars = bars.map((_, b) => (start + (b + 1) * STEP * MIN > next ? 1 : 0));
      return { id, start, ref: start, bars, guessed, stale: now - start > MF_STALE_MS };
    }
    // Weather entity: the forecast attribute of an integration that still gives one, else the hourly forecast.
    const legacy = Array.isArray(s.attributes?.forecast) ? s.attributes.forecast : null;
    const wx = this._wx?.id === id ? this._wx : null;
    const entries = legacy ?? wx?.list ?? null;
    const start = Math.floor(now / (STEP * MIN)) * STEP * MIN;
    if (!entries) return { id, start, bars: Array(BARS).fill(null), coarse: true, error: wx?.error ? "no_hourly" : null };
    const { bars, coarse } = weatherBars(entries, start);
    const at = legacy ? Date.parse(s.last_updated) : wx.at;
    return { id, start, ref: at, bars, coarse, stale: now - at > WX_STALE_MS };
  }

  // Fetches the hourly forecast of a weather entity (weather.get_forecasts): once, again when the entity changes
  // and every 15 minutes.
  _syncWeather() {
    const { id } = findSource(this._hass, this._config);
    const s = id?.startsWith("weather.") && this._hass.states[id];
    if (!s || Array.isArray(s.attributes?.forecast) || typeof this._hass.callWS !== "function") return;
    const key = `${id}|${s.last_updated}`;
    const w = this._wx;
    if (w?.id === id && (w.loading || (w.key === key && Date.now() - w.at < WX_REFRESH_MS))) return;
    const ticket = { ...(w?.id === id ? w : {}), id, key, loading: true };
    this._wx = ticket;
    Promise.resolve(
      this._hass.callWS({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "hourly" },
        target: { entity_id: id },
        return_response: true,
      }),
    )
      .then((res) => {
        if (this._wx !== ticket) return;
        const list = res?.response?.[id]?.forecast;
        this._wx = { id, key, at: Date.now(), list: Array.isArray(list) && list.length ? list : null, error: !Array.isArray(list) || !list.length };
        this._update();
      })
      .catch(() => {
        if (this._wx !== ticket) return;
        this._wx = { id, key, at: Date.now(), list: ticket.list ?? null, error: true };
        this._update();
      });
  }

  // { fc, an, text }: forecast, analysis and the texts of the pill, headline and detail line.
  _view(id) {
    const fc = this._forecast(id);
    const now = Date.now();
    const an = analyse(fc, now);
    const level = an.level && !fc.guessed ? this._t(`level_${an.level}`) : this._t("level_rain");
    const mins = (ms) => Math.max(1, Math.ceil((ms - now) / MIN));
    const time = (ms) => this._time(ms);
    const T = {
      dry: [this._t("pill_dry"), this._t("head_dry"), this._t("sub_dry", { time: time(an.windowEnd) })],
      soon: [
        this._t("pill_soon", { min: mins(an.start) }),
        this._t("head_soon", { time: time(an.start ?? now) }),
        this._t(an.end ? "sub_until" : "sub_beyond", { level, time: time(an.end ?? an.windowEnd) }),
      ],
      raining: [this._t("pill_raining"), this._t("head_raining", { time: time(an.windowEnd) }), this._t("sub_all_hour", { level })],
      stopping: [this._t("pill_stopping", { min: mins(an.end) }), this._t("head_stopping", { time: time(an.end ?? now) }), this._t("sub_dry_from", { level, time: time(an.end ?? now) })],
      stale: [this._t("pill_stale"), this._t("head_stale"), fc.ref ? this._t("sub_stale", { time: time(fc.ref) }) : ""],
      unknown: [this._t("pill_unknown"), this._t("head_unknown"), this._t(fc.error || "sub_unknown")],
      unavailable: [this._t("pill_unavailable"), this._t("head_unavailable"), this._t("sub_unavailable")],
    }[an.state];
    const [pill, head, sub] = T;
    // Signature of the bars: a change of forecast makes them grow again.
    const sig = `${id}|${fc.bars.join(",")}`;
    if (sig !== this._sig) {
      if (this._sig !== undefined) this._gen++;
      this._sig = sig;
    }
    return { fc, an, pill, head, sub, level };
  }

  // ---- Parts -------------------------------------------------------------

  // The badge's colour follows the state of the next hour (the pill's colour); its drops fall while it rains.
  _badge(v) {
    const falling = v.an.state === "raining" || v.an.state === "stopping";
    const drops = ICONS.drops.map((d, i) => `<path class="drop d${i + 1}" d="${d}"/>`).join("");
    return `<span class="type-icon ${STATE_CLASS[v.an.state]}${falling ? " falling" : ""}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS.cloud}"/>${drops}</svg></span>`;
  }

  // The pill: in the classic header, or at the top of the full card's content under the illustrated banner.
  _chip(v, id) {
    return `<span class="chip clickable ${STATE_CLASS[v.an.state]}" role="button" tabindex="0" data-entity="${esc(id)}" title="${esc(v.pill)}" aria-label="${esc(v.pill)}"><span class="dot"></span><span class="chip-text">${esc(v.pill)}</span></span>`;
  }

  _illustrated() {
    return this._config.illustration !== false;
  }

  // The header: the illustrated banner (picture of the state, title and subtitle on its sky), or with
  // `illustration: false` the classic header with the pill.
  _header(v, id, sub) {
    const c = this._config;
    const name = c.show_title === false ? "" : `<div class="name">${esc(c.name || this._t("title"))}</div>`;
    const subtitle = c.show_subtitle === false || !sub ? "" : `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>`;
    if (this._illustrated()) {
      return `
      <div class="banner${isNight(this._hass, c) ? " night" : ""}">
        ${rainSceneSvg(SCENE_KIND[v.an.state], v.an.level, this._uid)}
        <div class="rc-ground"></div>
        <div class="htext">${this._badge(v)}<div class="titles"><div class="trow">${name}${this._chip(v, id)}</div>${subtitle}</div></div>
        ${this._zoomButton()}
      </div>`;
    }
    return `
      <div class="header">
        ${this._badge(v)}
        <div class="titles"><div class="trow">${name}${this._chip(v, id)}</div>${subtitle}</div>
        ${this._zoomButton()}
      </div>`;
  }

  _zoomButton() {
    return "";
  }

  // The 60-minute ribbon: 12 bars (past ones faded), the now marker, drops while it rains, the next shower glowing.
  _ribbon(v, drips) {
    const { fc, an } = v;
    const L = this._locale();
    const raining = an.state === "raining" || an.state === "stopping";
    const nextShower = an.state === "soon" ? Math.round((an.start - fc.start) / (STEP * MIN)) : -1;
    const bars = fc.bars.map((lv, b) => {
      const past = b < an.index && an.state !== "stale";
      const wet = lv > 0 && !past && an.state !== "stale";
      const next = nextShower >= 0 && b >= nextShower && wet && fc.bars.slice(nextShower, b + 1).every((x) => x > 0);
      const label = `${fmtTime(fc.start + b * STEP * MIN, this._hass, L)}: ${lv === null ? this._t("bar_none") : lv === 0 ? this._t("bar_dry") : this._t(`level_${lv}`)}`;
      const drip = drips && raining && wet ? `<i class="drip" style="animation-delay:${(-((b * 7) % 10) / 10).toFixed(1)}s"></i>` : "";
      return `<div class="bar l${lv === null ? "n" : lv}${past ? " past" : ""}${next ? " next" : ""}" title="${esc(label)}" style="animation-delay:${b * 30}ms">${drip}</div>`;
    });
    const marker = ["stale", "unavailable"].includes(an.state) ? "" : `<div class="now" style="left:${((an.pos / BARS) * 100).toFixed(2)}%"></div>`;
    return `<div class="ribbon g${this._gen % 2}${an.state === "stale" ? " stale" : ""}" role="img" aria-label="${esc(`${this._t("ribbon_label")}: ${v.head}`)}"><div class="bars">${bars.join("")}</div>${marker}</div>`;
  }

  _sourceLine(v, id) {
    const parts = [sourceName(this._hass, id)];
    if (v.fc.ref) parts.push(this._t("updated", { time: this._time(v.fc.ref) }));
    if (v.fc.coarse) parts.push(this._t("hourly"));
    return `<div class="source${v.an.state === "stale" ? " stale" : ""}">${esc(parts.join(" · "))}</div>`;
  }

  // The banner's styles, only when it is shown.
  _bannerStyle() {
    return this._illustrated() ? BANNER_STYLE : "";
  }

  _errorCard(key) {
    const text = key === "unknown_entity" ? `${this._t(key)}: ${this._config.entity}` : this._t(key);
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(text)}</div></ha-card>`;
  }

  _render() {
    const { id, error } = findSource(this._hass, this._config);
    if (error) return this._errorCard(error);
    const c = this._config;
    const v = this._view(id);
    const detail = c.show_details === false || !v.sub ? "" : `<div class="detail">${esc(v.sub)}</div>`;
    const ribbon =
      c.show_ribbon === false
        ? ""
        : `${this._ribbon(v, true)}<div class="axis" aria-hidden="true"><span>${esc(this._t("axis_now"))}</span><span>${esc(this._t("axis_30"))}</span><span>${esc(this._t("axis_60"))}</span></div>`;
    const headline = `<div class="headline clickable" role="button" tabindex="0" data-entity="${esc(id)}"><div class="big">${esc(v.head)}</div>${detail}</div>`;
    return `<style>${BASE_STYLE}${FULL_STYLE}${this._bannerStyle()}</style>${this._colorVars()}
      <ha-card>
        ${this._header(v, id, locationOf(this._hass, c, id))}
        <div class="content">
          ${headline}
          ${ribbon}
          ${c.show_source === false ? "" : this._sourceLine(v, id)}
        </div>
      </ha-card>`;
  }
}

// The mini card: one line ("Rain at 14:35 · moderate") with a compact ribbon and the pill. Its detail button (top
// right, `zoom: false` removes it) unfolds it into the full card, and a click anywhere else folds it back.
export class RainMiniCard extends RainCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("rain-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    // Back to the compact view once off the screen.
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${!!z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
  }

  // "Rain at 14:35 · moderate", "Dry for the next hour", "Rain stops at 14:50 · light".
  _miniLine(v) {
    const wet = ["soon", "raining", "stopping"].includes(v.an.state);
    const head = v.an.state === "raining" ? this._t("pill_raining") : v.head;
    const level = wet && this._config.show_details !== false ? ` <span class="muted">· ${esc(v.level.toLocaleLowerCase(this._locale()))}</span>` : "";
    return `<div class="line clickable" role="button" tabindex="0" data-entity="${esc(v.fc.id)}">${esc(head)}${level}</div>`;
  }

  _render() {
    if (this._zoomed) return super._render();
    const { id, error } = findSource(this._hass, this._config);
    if (error) return this._errorCard(error);
    const v = this._view(id);
    // On the banner, the pill stands on the title's row: no subtitle repeating it.
    return `<style>${BASE_STYLE}${MINI_STYLE}${this._bannerStyle()}</style>${this._colorVars()}
      <ha-card>
        ${this._header(v, id, "")}
        <div class="content">${this._miniLine(v)}${this._config.show_ribbon === false ? "" : this._ribbon(v, false)}</div>
      </ha-card>`;
  }
}
