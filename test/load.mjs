// Evaluates src/rain-card.js (a classic script, bundled as is by scripts/build.mjs) in a sandbox with minimal DOM
// stand-ins and returns the names the tests need. No dependency, no browser.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../src/rain-card.js", import.meta.url), "utf8");

// Shadow root stand-in: keeps the HTML it is given (no DOM to patch: the card sets its markup as is).
const fakeRoot = () => ({
  innerHTML: "",
  listeners: {},
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
});

const fakeNode = (tag) => ({
  tagName: String(tag).toUpperCase(),
  children: [],
  appendChild(child) {
    this.children.push(child);
    return child;
  },
  addEventListener() {},
});

// `now` (ms) freezes Date.now() inside the sandbox, so that the forecasts of scripts/mock-states.mjs read as current.
export const load = ({ now } = {}) => {
  const registry = new Map();
  class HTMLElement {
    attachShadow() {
      this.shadowRoot = fakeRoot();
      return this.shadowRoot;
    }
    dispatchEvent(ev) {
      (this.events ||= []).push(ev);
    }
    appendChild(child) {
      (this.children ||= []).push(child);
    }
  }
  class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }
  const sandbox = {
    HTMLElement,
    CustomEvent,
    Intl,
    console: { info() {}, warn() {} },
    customElements: { get: (t) => registry.get(t), define: (t, c) => registry.set(t, c) },
    document: {
      createElement: (t) => (registry.has(t) ? new (registry.get(t))() : fakeNode(t)),
      addEventListener() {},
      removeEventListener() {},
    },
    setTimeout,
    clearTimeout,
    // Intervals are not run: kept in `intervals` (id → callback) for the tests to fire by hand.
    intervals: new Map(),
    setInterval(fn) {
      const id = Symbol("interval");
      sandbox.intervals.set(id, fn);
      return id;
    },
    clearInterval(id) {
      sandbox.intervals.delete(id);
    },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  if (now !== undefined) vm.runInContext(`Date.now = () => ${Number(now)};`, sandbox);
  return vm.runInContext(
    `${source}
    ({ STRINGS, LANGUAGES, rainLevel, mfBars, weatherBars, analyse, findSource, locationOf, cityOf, cleanConfig, fmtTime, intlLocale, sourceName, BARS,
       RainCard: customElements.get("rain-card"), RainMiniCard: customElements.get("rain-mini-card"),
       RainCardEditor: customElements.get("rain-card-editor"), RainMiniCardEditor: customElements.get("rain-mini-card-editor"), window, document })`,
    sandbox,
  );
};
