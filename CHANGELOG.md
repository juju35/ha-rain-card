# Changelog

## 1.2.2 - 2026-11-20

### Fixes
- Status pill: it now sits at the right end of the title's row (aligned with the title, as on the other ha-* cards) instead of right after the title; it still drops under the subtitle, then keeps its dot, when the title and the pill do not fit.

### Performance
- Automatic source: the scan of every state (sorted by entity id) to find the Météo-France Next rain sensor or a weather entity now runs once per registry change instead of up to three times on every state change of the instance; the entity found is kept while it still qualifies.
- Without a source (unknown entity, nothing found), the error card is no longer rebuilt on every state change of the instance; it goes as soon as the entity appears.
- The status pill is measured again only when the card's markup changed (a new width or the web font is still caught by the observer), and only once Home Assistant's `<ha-card>` has rendered, so it is in its place from the first frame.

### Maintenance
- CI: the npm cache is used by the build job.
- The commitlint config is an ES module (the package is `"type": "module"`): the local `commit-msg` hook no longer crashes.

## 1.2.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.2.0 - 2026-11-17

### Features
- **Illustrated header** on the full and mini cards: a 90 px sky banner with a scene of the next hour on a 10 px lawn strip — the sun and white clouds when dry, grey clouds coming in and a walker opening an umbrella when rain is near, rain falling into a puddle while it rains (more drops for heavier rain), plain clouds when the forecast is out of date or unknown. Night version (stars, moon) after sunset (`sun.sun`) or with the dark theme; `illustration_theme: day | night` forces it, `illustration: false` keeps the classic header. Animations honour `prefers-reduced-motion`.
- The badge's cloud now takes the colour of the state (dry, rain soon, raining, stopping, out of date, unavailable); the status pill, in the same colour, sits right after the title only while the whole title and the pill's whole label fit on that row (measured in the real fonts, so in every language); otherwise it takes its own line under a one-line subtitle, and keeps only its dot when even that would not fit above the lawn strip or on a card of 200 px or less (full and mini card, banner and classic header). The mini card's detail button is a 24 px frosted round in the banner's top right corner.
- New options in both visual editors (`illustration`, `illustration_theme`), translated into the 22 languages.

### Fixes
- Night picture with the dark theme even while the sun is up (`illustration_theme: auto`): the header is night when `sun.sun` is below the horizon or Home Assistant's theme is dark; `day` / `night` still force it.

## 1.1.0 - 2026-11-15

### Features
- **Custom bar colors** (`colors:`): override the ribbon bar colors by intensity — `light` (level 1), `moderate` (level 2), `heavy` (level 3) and/or `crit` (the alert tint), each a CSS color. Omitted levels keep the default blue shades ([#2](https://github.com/juju35/ha-rain-card/issues/2), suggested by @thomasfav28).

## 1.0.0 - 2026-11-14

### Features
- **Rain Card** (`custom:rain-card`): rain in the next hour as a headline (Dry for the next hour, Rain at 14:35, Raining until about 15:20, Rain stops at 14:50) with the intensity (light, moderate, heavy) and the end time, a status pill (Dry, In 15 min, Raining, Stops in 10 min, Outdated, No data, Unavailable) and the **60-minute ribbon**: twelve 5-minute bars whose height and shade follow the intensity, a thin neutral bar when dry, axis labels Now / +30 / +60 min and a now marker moving along the ribbon.
- Animations: the bars grow whenever the forecast changes, the coming shower glows, drops fall from the badge and onto the rainy bars while it rains; `prefers-reduced-motion` honoured.
- **Rain Mini Card** (`custom:rain-mini-card`): one line ("Rain at 14:35 · moderate") with a compact ribbon and the pill, and a detail button that unfolds the full card, folded back by a click elsewhere or when the card leaves the page.
- Sources: the **Météo-France** Next rain sensor (`1_hour_forecast`, all its labels and rain codes, `forecast_time_ref`, out-of-date detection), found automatically; any **weather entity** through its hourly forecast (`weather.get_forecasts`), hour by hour.
- Visual editor for both cards, Sections view sizes, light and dark themes, 12/24-hour clock and server time zone from the profile, 22 languages (English in the bundle, the others loaded on demand).
