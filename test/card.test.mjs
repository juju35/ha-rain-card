import assert from "node:assert/strict";
import { test } from "node:test";
import { devices, dry, entities, forecastResponse, hourly, MF, NOW, raining, REF, stale, states, stopping, WX } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

// The clock of the sandbox is frozen at the mock's NOW (14:22 in Paris).
const rc = load({ now: NOW });
const MIN = 60e3;

const makeHass = (overrides = {}, extra = {}) => {
  const ws = [];
  return {
    ws,
    states: { ...states, ...Object.fromEntries(Object.entries(overrides).map(([id, v]) => [id, { ...states[id], ...v }])) },
    entities,
    devices,
    language: "en",
    locale: { language: "en", time_format: "24", time_zone: "server" },
    config: { time_zone: "Europe/Paris", location_name: "Home" },
    callService() {},
    callWS: async (msg) => {
      ws.push(msg);
      return forecastResponse(msg);
    },
    ...extra,
  };
};

const newCard = (config = {}, hass = makeHass(), Card = rc.RainCard) => {
  const card = new Card();
  card.setConfig(config);
  card.hass = hass;
  return card;
};
const html = (card) => card.shadowRoot.innerHTML;
const text = (card) =>
  html(card)
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
const click = (card, dataset, detail = 1) => {
  const el = { dataset };
  card._onClick({ composedPath: () => [el], stopPropagation() {}, detail });
};
const flush = () => new Promise((r) => setTimeout(r, 0));

// ---- Translations -----------------------------------------------------------

test("every language has every English key, with the same placeholders", () => {
  const en = rc.STRINGS.en;
  const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  assert.equal(Object.keys(rc.STRINGS).length, 22);
  for (const [l, tr] of Object.entries(rc.STRINGS)) {
    assert.deepEqual(Object.keys(tr).sort(), Object.keys(en).sort(), l);
    for (const k of Object.keys(en)) assert.deepEqual(vars(tr[k]), vars(en[k]), `${l}.${k}`);
  }
  assert.deepEqual([...rc.LANGUAGES.map(([l]) => l)].sort(), Object.keys(rc.STRINGS).sort());
});

test("Intl locale: Home Assistant's region kept, bare pt read as European Portuguese", () => {
  assert.equal(rc.intlLocale({ locale: { language: "en-GB" } }, {}), "en-GB");
  assert.equal(rc.intlLocale({ language: "pt" }, {}), "pt-PT");
  assert.equal(rc.intlLocale({ language: "fr" }, { language: "de" }), "de");
  assert.equal(rc.intlLocale({ language: "xx" }, {}), "en");
});

// ---- Météo-France -----------------------------------------------------------

test("Météo-France rain labels, in French, English or as rain codes", () => {
  const cases = {
    "Temps sec": 0,
    "Pluie faible": 1,
    "Pluie modérée": 2,
    "Pluie forte": 3,
    "Données indisponibles": null,
    "Dry weather": 0,
    "Light rain": 1,
    "Moderate rain": 2,
    "Heavy rain": 3,
    Pluie: 1,
    "": null,
    "?": null,
  };
  for (const [raw, level] of Object.entries(cases)) assert.equal(rc.rainLevel(raw), level, raw);
  assert.equal(rc.rainLevel(1), 0);
  assert.equal(rc.rainLevel("4"), 3);
  assert.equal(rc.rainLevel(0), null);
  assert.equal(rc.rainLevel(undefined), null);
});

test("the 9 Météo-France slots (5 then 10 minutes) map onto 12 bars of 5 minutes", () => {
  const offsets = ["0 min", "5 min", "10 min", "15 min", "20 min", "25 min", "35 min", "45 min", "55 min"];
  const labels = ["Temps sec", "Pluie faible", "Pluie modérée", "Pluie forte", "Temps sec", "Temps sec", "Pluie faible", "Pluie forte", "Données indisponibles"];
  const bars = rc.mfBars(Object.fromEntries(offsets.map((o, i) => [o, labels[i]])));
  // 35 min covers 30–40 (bars 6, 7), 45 min 40–50 (bars 8, 9), 55 min 50–60 (bars 10, 11).
  assert.deepEqual([...bars], [0, 1, 2, 3, 0, 0, 1, 1, 3, 3, null, null]);
  // Slots keyed by their start (30, 40, 50) are read as well.
  const byStart = rc.mfBars({ "0 min": "Temps sec", "25 min": "Temps sec", "30 min": "Pluie forte", "40 min": "Pluie faible", "50 min": "Temps sec" });
  assert.deepEqual([...byStart].slice(5), [0, 3, 3, 1, 1, 0, 0]);
  assert.deepEqual([...rc.mfBars(undefined)], Array(12).fill(null));
});

// ---- Weather entities -------------------------------------------------------

test("an hourly forecast fills the bars hour by hour, from its precipitation or else its condition", () => {
  const start = Date.UTC(2026, 10, 10, 13, 20);
  const h = (hh, precipitation, condition = "cloudy") => ({ datetime: new Date(Date.UTC(2026, 10, 10, hh)).toISOString(), precipitation, condition });
  const { bars, coarse } = rc.weatherBars([h(13, 0), h(14, 3.2, "rainy")], start);
  assert.equal(coarse, true);
  // 14:20–15:00 local (13:20–14:00 UTC): dry; 15:00–15:20: 3.2 mm/h, moderate.
  assert.deepEqual([...bars], [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2]);
  const cond = rc.weatherBars([h(13, null, "pouring"), h(14, null, "sunny")], start).bars;
  assert.deepEqual([...cond], [3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0]);
  // A forecast starting at the next hour: its first hour stands for the current one.
  assert.deepEqual([...rc.weatherBars([h(14, 0.5)], start).bars], Array(12).fill(1));
  // 15-minute steps are not coarse; a rate in mm/h from 15 minutes of precipitation.
  const fine = rc.weatherBars(
    [0, 15, 30, 45].map((m, i) => ({ datetime: new Date(start + m * MIN).toISOString(), precipitation: [0, 0.2, 1, 3][i] })),
    start,
  );
  assert.equal(fine.coarse, false);
  assert.deepEqual([...fine.bars], [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]);
  assert.deepEqual([...rc.weatherBars([], start).bars], Array(12).fill(null));
});

// ---- The next hour ----------------------------------------------------------

test("the next hour is read as dry, rain soon, raining, stopping, stale or unknown", () => {
  const start = REF;
  const fc = (bars, extra = {}) => ({ start, bars, ...extra });
  const now = NOW; // 2 minutes into the first bar
  assert.equal(rc.analyse(fc(Array(12).fill(0)), now).state, "dry");
  const soon = rc.analyse(fc([0, 0, 0, 1, 2, 2, 1, 1, 0, 0, 0, 0]), now);
  assert.equal(soon.state, "soon");
  assert.equal(soon.start, start + 15 * MIN);
  assert.equal(soon.end, start + 40 * MIN);
  assert.equal(soon.level, 2);
  const all = rc.analyse(fc(Array(12).fill(1)), now);
  assert.equal(all.state, "raining");
  assert.equal(all.end, start + 60 * MIN);
  const stop = rc.analyse(fc([3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0]), now);
  assert.equal(stop.state, "stopping");
  assert.equal(stop.end, start + 25 * MIN);
  assert.equal(stop.level, 3);
  // Bars without data do not end the rain: it lasts at least until them.
  assert.equal(rc.analyse(fc([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, null, null]), now).state, "raining");
  assert.equal(rc.analyse(fc(Array(12).fill(null)), now).state, "unknown");
  assert.equal(rc.analyse(fc(Array(12).fill(0), { stale: true }), now).state, "stale");
  assert.equal(rc.analyse(fc(Array(12).fill(0)), start + 61 * MIN).state, "stale");
  assert.equal(rc.analyse(fc(Array(12).fill(0), { unavailable: true }), now).state, "unavailable");
  // The past bars are left behind: rain 10 minutes ago, dry since.
  const later = rc.analyse(fc([1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), start + 12 * MIN);
  assert.equal(later.state, "dry");
  assert.equal(later.index, 2);
});

// ---- Sources ----------------------------------------------------------------

test("the Météo-France next rain sensor is found first, then a weather entity", () => {
  const hass = makeHass();
  assert.deepEqual({ ...rc.findSource(hass, {}) }, { id: MF });
  assert.deepEqual({ ...rc.findSource(hass, { entity: WX }) }, { id: WX });
  assert.deepEqual({ ...rc.findSource(hass, { entity: "sensor.nope" }) }, { error: "unknown_entity" });
  const noMf = { ...hass, states: { [WX]: states[WX] } };
  assert.deepEqual({ ...rc.findSource(noMf, {}) }, { id: WX });
  // A hidden Météo-France sensor is skipped.
  const hidden = { ...hass, entities: { ...entities, [MF]: { ...entities[MF], hidden: true } } };
  assert.deepEqual({ ...rc.findSource(hidden, {}) }, { id: WX });
  assert.deepEqual({ ...rc.findSource({ ...hass, states: {} }, {}) }, { error: "no_source" });
});

test("the location is the option, the Météo-France city, the weather entity's name or Home Assistant's", () => {
  const hass = makeHass();
  assert.equal(rc.cityOf("Météo-France forecast for city Lyon - Rhône (69) - FR"), "Lyon");
  assert.equal(rc.cityOf("Météo-France rain for city Saint-Malo - Bretagne (35) - FR"), "Saint-Malo");
  assert.equal(rc.locationOf(hass, {}, MF), "Lyon");
  assert.equal(rc.locationOf(hass, { location: "Garden" }, MF), "Garden");
  assert.equal(rc.locationOf(hass, {}, WX), "Home");
  assert.equal(rc.sourceName(hass, MF), "Météo-France");
  assert.equal(rc.sourceName(hass, WX), "Met.no");
});

// ---- Full card --------------------------------------------------------------

test("rain soon: pill, headline, intensity and end time, the ribbon of 12 bars", () => {
  const card = newCard();
  const t = text(card);
  assert.match(t, /Rain In 13 min Lyon Rain at 14:35/);
  assert.match(t, /Rain at 14:35 Moderate · until 15:00/);
  assert.match(t, /Now \+30 min \+60 min/);
  assert.match(t, /Météo-France · updated 14:20/);
  const bars = html(card).match(/class="bar l[0-3n][^"]*"/g);
  assert.equal(bars.length, 12);
  assert.deepEqual(
    bars.map((b) => b.match(/l([0-3n])/)[1]),
    ["0", "0", "0", "1", "2", "2", "1", "1", "0", "0", "0", "0"],
  );
  // The coming shower glows, no drops yet; the badge takes the state's colour and its drops do not fall.
  assert.equal((html(card).match(/ next"/g) || []).length, 5);
  assert.doesNotMatch(html(card), /class="drip"/);
  assert.match(html(card), /class="type-icon soon"/);
  assert.match(html(card), /class="chip clickable soon"/);
  // The now marker, 2 minutes into the first bar.
  assert.match(html(card), /class="now" style="left:3\.33%"/);
});

test("dry, raining, stopping, stale and unavailable", () => {
  const cases = [
    [dry, /Rain Dry Lyon Dry for the next hour No rain expected before 15:20/],
    [raining, /Rain Raining Lyon Raining until about 15:20 Heavy · all through the next hour/],
    [stopping, /Rain Stops in 23 min Lyon Rain stops at 14:45 Heavy · dry from 14:45/],
    [stale, /Rain Outdated Lyon Forecast out of date Last forecast at 12:20/],
    [{ [MF]: { state: "unavailable", attributes: {} } }, /Rain Unavailable Lyon Forecast unavailable The forecast entity is unavailable/],
  ];
  for (const [o, re] of cases) assert.match(text(newCard({}, makeHass(o))), re);
  const rainingHtml = html(newCard({}, makeHass(raining)));
  assert.match(rainingHtml, /type-icon rain falling/);
  assert.equal((rainingHtml.match(/class="drip"/g) || []).length, 12);
  // Stale: no now marker, the bars greyed.
  const staleHtml = html(newCard({}, makeHass(stale)));
  assert.doesNotMatch(staleHtml, /class="now"/);
  assert.match(staleHtml, /class="ribbon g0 stale"/);
  assert.match(staleHtml, /class="source stale"/);
});

test("only the next rain time: dry until then, rain from then on", () => {
  const hass = makeHass({ [MF]: { state: new Date(REF + 30 * MIN).toISOString(), attributes: { ...states[MF].attributes, "1_hour_forecast": {} } } });
  const t = text(newCard({}, hass));
  assert.match(t, /Rain at 14:50 Rain · until at least 15:20/);
});

test("options hide the title, location, details, ribbon and source line", () => {
  const card = newCard({ name: "Garden", location: "Back yard" });
  assert.match(text(card), /^Garden In 13 min Back yard/);
  const bare = newCard({ show_title: false, show_subtitle: false, show_details: false, show_ribbon: false, show_source: false });
  const t = text(bare);
  assert.equal(t, "In 13 min Rain at 14:35");
});

test("the language option and Home Assistant's language translate the card", () => {
  assert.match(text(newCard({ language: "fr" })), /Pluie Dans 13 min Lyon Pluie à 14:35 Modérée · jusqu'à 15:00/);
  assert.match(text(newCard({}, makeHass({}, { language: "de", locale: { language: "de", time_format: "24", time_zone: "server" } }))), /Regen um 14:35/);
  // 12-hour clock from the profile.
  assert.match(text(newCard({}, makeHass({}, { locale: { language: "en", time_format: "12", time_zone: "server" } }))), /Rain at 02:35\sPM/);
});

test("a click on the headline or the pill opens the forecast entity", () => {
  const card = newCard();
  click(card, { entity: MF });
  assert.equal(card.events.at(-1).type, "hass-more-info");
  assert.equal(card.events.at(-1).detail.entityId, MF);
});

test("errors: unknown entity and no source", () => {
  assert.match(text(newCard({ entity: "sensor.nope" })), /Entity not found: sensor\.nope/);
  assert.match(text(newCard({}, { ...makeHass(), states: {} })), /No rain forecast found/);
  assert.throws(() => new rc.RainCard().setConfig({ entity: 3 }), /entity/);
  assert.throws(() => new rc.RainCard().setConfig(null), /Invalid configuration/);
});

test("a weather entity: hourly forecast fetched with weather.get_forecasts, then shown", async () => {
  const hass = makeHass();
  const card = newCard({ entity: WX }, hass);
  assert.equal(hass.ws.length, 1);
  assert.deepEqual(
    { ...hass.ws[0], target: { ...hass.ws[0].target }, service_data: { ...hass.ws[0].service_data } },
    { type: "call_service", domain: "weather", service: "get_forecasts", service_data: { type: "hourly" }, target: { entity_id: WX }, return_response: true },
  );
  assert.match(text(card), /Rain No data Home No forecast right now/);
  await flush();
  const t = text(card);
  assert.match(t, /Rain In 38 min Home Rain at 15:00 Moderate · until at least 15:20/);
  assert.match(t, /Met\.no · updated 14:22 · hourly forecast/);
  // Not fetched again on the next hass until the entity changes or 15 minutes went by.
  card.hass = makeHass();
  assert.equal(hass.ws.length, 1);
  assert.ok(hourly.length > 0);
});

test("a weather entity without hourly forecast says so", async () => {
  const hass = makeHass({}, { callWS: async () => ({ response: { [WX]: { forecast: [] } } }) });
  const card = newCard({ entity: WX }, hass);
  await flush();
  assert.match(text(card), /No forecast right now This weather entity gives no hourly forecast/);
});

test("the card is not redrawn for unrelated state changes, and is every minute", () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  card.connectedCallback();
  card.shadowRoot.innerHTML = "marker";
  card._html = "marker";
  card.hass = { ...hass, states: { ...hass.states, "light.kitchen": { entity_id: "light.kitchen", state: "on" } } };
  assert.equal(html(card), "marker");
  const [tick] = [...rc.window.intervals.values()];
  tick();
  assert.notEqual(html(card), "marker");
  card.disconnectedCallback();
  assert.equal(rc.window.intervals.size, 0);
});

test("the bars grow again when the forecast changes, not when the minute does", () => {
  const card = newCard();
  assert.match(html(card), /class="ribbon g0"/);
  card.hass = makeHass();
  assert.match(html(card), /class="ribbon g0"/);
  card.hass = makeHass(raining);
  assert.match(html(card), /class="ribbon g1"/);
});

// ---- Mini card --------------------------------------------------------------

test("mini card: one line, a compact ribbon, the pill and the detail button", () => {
  const card = newCard({}, makeHass(), rc.RainMiniCard);
  const t = text(card);
  assert.match(t, /^Rain In 13 min Rain at 14:35 · moderate$/);
  assert.match(html(card), /class="zoom" data-action="zoom"/);
  assert.equal((html(card).match(/class="bar /g) || []).length, 12);
  assert.doesNotMatch(html(card), /class="axis"/);
  assert.match(text(newCard({}, makeHass(raining), rc.RainMiniCard)), /Raining · heavy$/);
  assert.match(text(newCard({}, makeHass(dry), rc.RainMiniCard)), /Dry for the next hour$/);
  assert.doesNotMatch(html(newCard({ zoom: false }, makeHass(), rc.RainMiniCard)), /class="zoom"/);
});

test("mini card: the detail button unfolds the full card, a click elsewhere or leaving the page folds it", () => {
  const card = newCard({}, makeHass(), rc.RainMiniCard);
  click(card, { action: "zoom" });
  assert.match(text(card), /Rain at 14:35 Moderate · until 15:00/);
  assert.match(html(card), /class="axis"/);
  assert.equal(card.getCardSize(), 4);
  // A tap outside the card (no dialog in the path).
  card._unzoom.tap({ composedPath: () => [rc.document] });
  assert.doesNotMatch(html(card), /class="axis"/);
  assert.equal(card.getCardSize(), 2);
  // A tap inside does not fold it.
  click(card, { action: "zoom" });
  card._unzoom.tap({ composedPath: () => [card] });
  assert.match(html(card), /class="axis"/);
  card.disconnectedCallback();
  card.connectedCallback();
  assert.doesNotMatch(html(card), /class="axis"/);
  card.disconnectedCallback();
});

// ---- Editors ----------------------------------------------------------------

test("editors: the YAML keeps only what differs from the defaults; the mini editor adds the detail button", () => {
  assert.deepEqual({ ...rc.cleanConfig({ type: "custom:rain-card", entity: "", show_title: true, show_ribbon: false }, { show_title: true, show_ribbon: true }) }, {
    type: "custom:rain-card",
    show_ribbon: false,
  });
  const full = rc.RainCardEditor.toggles.map(([n]) => n);
  const mini = rc.RainMiniCardEditor.toggles.map(([n]) => n);
  assert.deepEqual([...full], ["illustration", "show_title", "show_subtitle", "show_details", "show_ribbon", "show_source"]);
  assert.deepEqual([...mini], [...full, "zoom"]);
  const ed = new rc.RainMiniCardEditor();
  ed.setConfig({ type: "custom:rain-mini-card" });
  ed.hass = makeHass();
  const names = JSON.stringify(ed._form.schema);
  for (const n of ["entity", "name", "location", "language", "illustration_theme", ...mini]) assert.ok(names.includes(`"${n}"`), n);
  assert.equal(ed._form.data.zoom, true);
  assert.equal(ed._form.computeLabel({ name: "show_ribbon" }), "Show the 60-minute ribbon");
});

test("illustrated banner: picture of the state, night by sun or theme, classic header when turned off", () => {
  const scene = (o, config = {}, extra = {}) => {
    const h = html(newCard(config, { ...makeHass(o), ...extra }));
    return { h, kind: h.match(/class="rc-scene (\w+)"/)?.[1], night: /class="banner night"/.test(h) };
  };
  assert.equal(scene().kind, "soon");
  assert.equal(scene(dry).kind, "dry");
  assert.equal(scene(raining).kind, "rain");
  assert.equal(scene(stopping).kind, "rain");
  assert.equal(scene(stale).kind, "idle");
  assert.match(scene(raining).h, /class="rc-drop r0"/);
  assert.match(scene().h, /class="rc-ground"/);
  // Night: the sun below the horizon or the dark theme (even with the sun up); illustration_theme forces either.
  assert.equal(scene().night, false);
  assert.equal(scene({}, {}, { themes: { darkMode: true } }).night, true);
  assert.equal(scene({ "sun.sun": { entity_id: "sun.sun", state: "above_horizon", attributes: {} } }, {}, { themes: { darkMode: true } }).night, true);
  assert.equal(scene({ "sun.sun": { entity_id: "sun.sun", state: "above_horizon", attributes: {} } }, {}, { themes: { darkMode: false } }).night, false);
  assert.equal(scene({ "sun.sun": { entity_id: "sun.sun", state: "above_horizon", attributes: {} } }, { illustration_theme: "day" }, { themes: { darkMode: true } }).night, false);
  assert.equal(scene({ "sun.sun": { entity_id: "sun.sun", state: "below_horizon", attributes: {} } }).night, true);
  assert.equal(scene({}, { illustration_theme: "night" }).night, true);
  assert.equal(scene({}, { illustration_theme: "day" }, { themes: { darkMode: true } }).night, false);
  // Each card has its own gradient id.
  const d = [newCard({}, makeHass(dry)), newCard({}, makeHass(dry))].map((c) => html(c).match(/id="(rc-sun-\d+)"/)[1]);
  assert.notEqual(d[0], d[1]);
  // illustration: false keeps the classic header with the pill.
  const classic = scene({}, { illustration: false }).h;
  assert.doesNotMatch(classic, /class="banner/);
  assert.match(classic, /class="header"/);
  // The pill on the banner's title row, in the colour of the icon; the mini card: the same banner, no subtitle repeating it.
  assert.match(scene(raining).h, /<div class="trow"><div class="name">Rain<\/div><span class="chip clickable rain"[^>]*title="Raining"/);
  const mini = html(newCard({}, makeHass(raining), rc.RainMiniCard));
  assert.match(mini, /class="banner"[\s\S]*rc-scene rain[\s\S]*<div class="trow"><div class="name">Rain<\/div><span class="chip clickable rain"/);
  assert.doesNotMatch(mini, /<div class="sub">/);
});

test("both cards are registered for the card picker", () => {
  const types = [...rc.window.customCards.map((c) => c.type)];
  assert.deepEqual(types, ["rain-card", "rain-mini-card"]);
});
