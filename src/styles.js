// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export const BASE_STYLE = `
  :host { --rc-accent: #1e88e5; --rc-ok: var(--success-color, #43a047); --rc-soon: var(--warning-color, #ffa600);
          --rc-rain: #1e88e5; --rc-stop: #00acc1;
          /* Shades of the bars, the same in light and dark themes: pale for light rain, deep for heavy rain. */
          --rc-light: #90caf9; --rc-moderate: #42a5f5; --rc-heavy: #1976d2; --rc-crit: var(--error-color, #db4437); --rc-idle: var(--disabled-text-color, #9e9e9e); }
  ha-card { overflow: hidden; container: rc-card / inline-size; }
  /* A size container has no width of its own: this zero-height grid gives the card a natural width without a minimum. */
  :host { display: block; min-width: 0; --rc-natural-width: 360px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--rc-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--rc-accent)); outline-offset: 2px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ok { --c: var(--rc-ok); } .soon { --c: var(--rc-soon); } .rain { --c: var(--rc-rain); } .stop { --c: var(--rc-stop); }
  .idle { --c: var(--rc-idle); } .crit { --c: var(--rc-crit); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--rc-accent)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c, var(--rc-accent)) 15%, transparent); color: color-mix(in srgb, var(--c, var(--rc-accent)) 50%, var(--primary-text-color));
          flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box; transition: background-color .3s ease, color .3s ease; }
  .chip-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  .titles { flex: 1 1 0; min-width: 5ch; }
  /* The status pill at the right end of the title's row, centred on it, while the title stays whole and the pill's whole
     label fits beside it; otherwise (measured by the card, see _fitPill) the pill on its own line under a one-line subtitle, and
     if even that would not fit in the header, its dot alone (the label stays in title and aria-label). */
  .titles { display: flex; flex-direction: column; }
  .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .trow .name { flex: 0 1 auto; min-width: 0; }
  .trow .chip { flex: none; max-width: none; margin-left: auto; }
  .titles.below { display: grid; grid-template-columns: minmax(0, 1fr); justify-items: start; }
  .titles.below .trow { display: contents; }
  .titles.below .name { max-width: 100%; }
  .titles.below > .sub { justify-self: stretch; }
  .titles.below .chip { grid-row: 3; margin-top: 2px; margin-left: 0; max-width: 100%; }
  .titles.pill-dot .chip { padding: 4px; }
  .titles.pill-dot .chip-text { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .type-icon { position: relative; display: flex; flex: none; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               --rc-tint: var(--c, var(--rc-accent)); background: color-mix(in srgb, var(--rc-tint) 16%, transparent); transition: background-color .3s ease; }
  .type-icon svg { width: 24px; height: 24px; overflow: visible; fill: color-mix(in srgb, var(--rc-tint) 60%, var(--primary-text-color)); transition: fill .3s ease; }
  .type-icon .drop { opacity: .9; }
  .type-icon.falling .drop { animation: rc-fall 1s linear infinite; }
  .type-icon.falling .drop.d2 { animation-delay: -.33s; }
  .type-icon.falling .drop.d3 { animation-delay: -.66s; }
  @keyframes rc-fall { 0% { transform: translateY(-3px); opacity: 0; } 25% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(4px); opacity: 0; } }
  .warning { padding: 16px; color: color-mix(in srgb, var(--rc-soon) 50%, var(--primary-text-color)); }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -2px -4px 0 0; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--rc-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--rc-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--rc-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--rc-accent)); outline-offset: 1px; }
  /* The ribbon: 12 bars of 5 minutes, their height and shade by intensity, a thin neutral bar when dry. */
  .ribbon { position: relative; }
  .bars { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 3px; align-items: end; height: 100%; }
  .bar { position: relative; height: var(--h); min-height: 3px; border-radius: 3px 3px 2px 2px; background: var(--rc-shade); transform-origin: bottom;
         transition: height .5s ease, background-color .5s ease, opacity .5s ease; }
  .bar.l0 { --h: 3px; --rc-shade: color-mix(in srgb, var(--secondary-text-color) 30%, transparent); }
  .bar.ln { --h: 3px; --rc-shade: transparent; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--secondary-text-color) 35%, transparent); }
  .bar.l1 { --h: 34%; --rc-shade: var(--rc-light); }
  .bar.l2 { --h: 64%; --rc-shade: var(--rc-moderate); }
  .bar.l3 { --h: 100%; --rc-shade: var(--rc-heavy); }
  .bar.past { opacity: .35; }
  .ribbon.stale .bar { opacity: .3; filter: grayscale(1); }
  /* The bars grow when the forecast changes: the two names alternate so that the animation starts again. */
  .ribbon.g0 .bar { animation: rc-grow-a .6s cubic-bezier(.2, .8, .3, 1) backwards; }
  .ribbon.g1 .bar { animation: rc-grow-b .6s cubic-bezier(.2, .8, .3, 1) backwards; }
  @keyframes rc-grow-a { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes rc-grow-b { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  /* Rain coming: the bars of the next shower glow; raining: drops fall onto the rainy bars. */
  .ribbon .bar.next { animation-name: rc-grow-a, rc-glow; animation-duration: .6s, 1.5s; animation-iteration-count: 1, infinite;
                      animation-timing-function: cubic-bezier(.2, .8, .3, 1), ease-in-out; animation-fill-mode: backwards, none; }
  .ribbon.g1 .bar.next { animation-name: rc-grow-b, rc-glow; }
  @keyframes rc-glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.35) saturate(1.2); } }
  .bar .drip { position: absolute; left: 50%; top: -14px; width: 3px; height: 6px; margin-left: -1.5px; border-radius: 2px;
               background: var(--rc-moderate); opacity: 0; animation: rc-drip 1s linear infinite; }
  @keyframes rc-drip { 0% { transform: translateY(-6px); opacity: 0; } 30% { opacity: 1; } 85% { opacity: .9; } 100% { transform: translateY(12px); opacity: 0; } }
  /* Now: a thin line with a dot, moving along as the minutes go by. */
  .now { position: absolute; top: -4px; bottom: -3px; width: 2px; margin-left: -1px; border-radius: 1px; pointer-events: none;
         background: color-mix(in srgb, var(--primary-text-color) 35%, transparent); transition: left 1s linear; }
  .now::before { content: ""; position: absolute; top: -3px; left: -2px; width: 6px; height: 6px; border-radius: 50%; background: var(--primary-text-color); }
  .now::after { content: ""; position: absolute; top: -6px; left: -5px; width: 12px; height: 12px; border-radius: 50%;
                background: color-mix(in srgb, var(--primary-text-color) 30%, transparent); animation: rc-halo 3s ease-out infinite; }
  @keyframes rc-halo { 0% { transform: scale(.4); opacity: .9; } 60%, 100% { transform: scale(1.4); opacity: 0; } }
  /* Narrow card: the pill keeps only its colored dot (its text stays in title and aria-label). */
  @container rc-card (max-width: 200px) {
    .chip { padding: 4px; flex: none; }
    .chip-text { display: none; }
    .header { gap: 6px; }
  }
`;

export const FULL_STYLE = `
  .content { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
  .headline { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  /* Under the illustrated banner, the pill sits at the right of the headline. */
  .lead { display: flex; align-items: flex-start; gap: 8px; }
  .lead .headline { flex: 1 1 auto; }
  .lead .chip { order: 2; margin-top: 4px; }
  .big { font-size: 22px; font-weight: 400; line-height: 1.2; overflow-wrap: anywhere; }
  .detail { font-size: 13px; color: var(--secondary-text-color); }
  .ribbon { height: 56px; margin-top: 10px; }
  .axis { display: flex; justify-content: space-between; font-size: 11px; color: var(--secondary-text-color); margin-top: -4px; }
  .source { font-size: 11px; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .source.stale { color: color-mix(in srgb, var(--rc-soon) 50%, var(--primary-text-color)); }
  @container rc-card (max-width: 260px) {
    .big { font-size: 18px; }
    .ribbon { height: 44px; }
    .bars { gap: 2px; }
  }
`;

export const MINI_STYLE = `
  :host { --rc-natural-width: 300px; }
  .content { padding: 8px 12px 12px; display: flex; align-items: center; gap: 12px; }
  .line { flex: 1 1 auto; min-width: 0; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line .muted { color: var(--secondary-text-color); }
  .ribbon { flex: 0 0 112px; height: 20px; }
  .bars { gap: 2px; }
  .bar { border-radius: 2px 2px 1px 1px; }
  .bar .drip { display: none; }
  .now { top: -2px; bottom: -2px; }
  .now::before { top: -2px; left: -1.5px; width: 5px; height: 5px; }
  .now::after { display: none; }
  @container rc-card (max-width: 220px) {
    .content { flex-direction: column; align-items: stretch; gap: 6px; }
    .ribbon { flex-basis: 20px; }
  }
`;
