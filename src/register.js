// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
import { pickerDefine } from "./card-picker.js";
import { VERSION } from "./core.js";
import { RainCard, RainMiniCard } from "./cards.js";
import { RainCardEditor, RainMiniCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("rain-card", RainCard);
define("rain-mini-card", RainMiniCard);
define("rain-card-editor", RainCardEditor);
define("rain-mini-card-editor", RainMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "rain-card",
    name: "Rain Card",
    description: "Rain in the next hour: Météo-France 60-minute forecast or a weather entity's hourly precipitation, as a ribbon of 5-minute bars.",
  },
  { type: "rain-mini-card", name: "Rain Mini Card", description: "Rain in the next hour on one line, with a compact ribbon and a detail button." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-rain-card" });
}

console.info(`%c RAIN-CARD %c v${VERSION} `, "color: white; background: #1e88e5; font-weight: 700;", "color: #1e88e5; background: white; font-weight: 700;");
