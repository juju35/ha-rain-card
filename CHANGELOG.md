# Changelog

## 1.0.0 - 2026-11-14

### Features
- **Rain Card** (`custom:rain-card`): rain in the next hour as a headline (Dry for the next hour, Rain at 14:35, Raining until about 15:20, Rain stops at 14:50) with the intensity (light, moderate, heavy) and the end time, a status pill (Dry, In 15 min, Raining, Stops in 10 min, Outdated, No data, Unavailable) and the **60-minute ribbon**: twelve 5-minute bars whose height and shade follow the intensity, a thin neutral bar when dry, axis labels Now / +30 / +60 min and a now marker moving along the ribbon.
- Animations: the bars grow whenever the forecast changes, the coming shower glows, drops fall from the badge and onto the rainy bars while it rains; `prefers-reduced-motion` honoured.
- **Rain Mini Card** (`custom:rain-mini-card`): one line ("Rain at 14:35 · moderate") with a compact ribbon and the pill, and a detail button that unfolds the full card, folded back by a click elsewhere or when the card leaves the page.
- Sources: the **Météo-France** Next rain sensor (`1_hour_forecast`, all its labels and rain codes, `forecast_time_ref`, out-of-date detection), found automatically; any **weather entity** through its hourly forecast (`weather.get_forecasts`), hour by hour.
- Visual editor for both cards, Sections view sizes, light and dark themes, 12/24-hour clock and server time zone from the profile, 22 languages (English in the bundle, the others loaded on demand).
