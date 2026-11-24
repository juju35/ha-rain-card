// ---------------------------------------------------------------------------
// Illustration
// ---------------------------------------------------------------------------

// Night picture: forced by illustration_theme, else Home Assistant's dark mode alone (a light theme keeps the day
// picture after sunset).
export const isNight = (hass, config) => {
  const theme = config?.illustration_theme;
  if (theme === "night") return true;
  if (theme === "day") return false;
  return !!hass?.themes?.darkMode;
};

// State of the next hour → picture: the sun and white clouds when dry, grey clouds coming in with the walker opening
// the umbrella when rain is near, rain falling into a puddle when it rains, plain clouds when the forecast is unknown.
export const SCENE_KIND = { dry: "dry", soon: "soon", raining: "rain", stopping: "rain", stale: "idle", unknown: "idle", unavailable: "idle" };
export const CLOUD_PATH = "M-14,4 C-17,4 -18,0 -14.5,-1 C-14,-5 -8,-6 -6,-3 C-4,-8 4,-8 5,-2 C9,-3 12,0 10,4 Z";
export const STARS = [[12, 8], [44, 18], [96, 6], [132, 24], [168, 10], [188, 30], [70, 30]];

// The banner picture (200 × 80, drawn at the right of the banner, bottom on the ground strip). `level` (1–3) sets
// how many drops fall; `uid` keeps each card's gradient id apart on a page with several cards.
export const rainSceneSvg = (kind, level, uid) => {
  const clouds = {
    dry: [[140, 18, 1], [176, 26, 0.7]],
    soon: [[190, 18, 1.8], [166, 26, 1.4]],
    rain: [[140, 18, 1.8], [176, 26, 1.4]],
    idle: [[146, 18, 1.4], [178, 28, 1]],
  }[kind];
  const cloudCls = { dry: "rc-cloud", soon: "rc-cloud grey approach", rain: "rc-cloud grey", idle: "rc-cloud dim" }[kind];
  const n = [10, 10, 13, 16][Math.max(0, Math.min(3, level || 3))];
  const drops =
    kind === "rain"
      ? `<g class="rc-drops">${Array.from({ length: n }, (_, i) => {
          const x = 112 + (i * 88) / n;
          return `<line class="rc-drop r${i % 4}" x1="${x.toFixed(1)}" y1="30" x2="${(x - 2).toFixed(1)}" y2="38"/>`;
        }).join("")}</g>`
      : "";
  const umbrella = kind === "soon" || kind === "rain" ? '<path class="rc-shaft" d="M0 -26 V-44"/><path class="rc-umbrella" d="M-14 -40 Q0 -54 14 -40Z"/>' : "";
  return `<svg class="rc-scene ${kind}" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
    <defs><radialGradient id="rc-sun-${uid}"><stop offset=".55" stop-color="#ffd65a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd65a" stop-opacity="0"/></radialGradient></defs>
    <g class="rc-night">${STARS.map(([x, y], i) => `<circle class="rc-star${i % 3 ? "" : " tw"}" cx="${x}" cy="${y}" r=".7"/>`).join("")}</g>
    ${kind === "dry" ? `<g class="rc-day"><circle cx="150" cy="18" r="11" fill="url(#rc-sun-${uid})"/><circle class="rc-sun" cx="150" cy="18" r="6"/></g><path class="rc-night rc-moon" d="M150 11a7 7 0 1 0 6 10.5 5.6 5.6 0 1 1-6-10.5Z"/>` : ""}
    <g class="${cloudCls}">${clouds.map(([x, y, k]) => `<path transform="translate(${x} ${y}) scale(${k})" d="${CLOUD_PATH}"/>`).join("")}</g>
    ${drops}
    <path class="rc-hill" d="M0,80 C40,72 90,70 200,72 L200,80Z"/>
    ${kind === "rain" ? '<ellipse class="rc-puddle" cx="150" cy="77" rx="20" ry="2"/>' : ""}
    <g class="rc-walker" transform="translate(110 76)"><circle class="rc-skin" cy="-28" r="3.4"/><rect class="rc-coat" x="-3" y="-24" width="6" height="12" rx="2"/><rect class="rc-leg" x="-3" y="-12" width="2" height="12"/><rect class="rc-leg" x="1" y="-12" width="2" height="12"/>${umbrella}</g>
  </svg>`;
};

// The banner: sky gradient, the picture at the right on a 10 px lawn strip, the title and subtitle on the sky at the
// left. Colours day and night; the animations stop with prefers-reduced-motion (BASE_STYLE).
export const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; --rc-g: 10px; --rc-scene-w: min(200px, 54%);
            --rc-sky-text: #0d2a45; --rc-sky-muted: #3b5b78; color: var(--rc-sky-text);
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.night { --rc-sky-text: #fff; --rc-sky-muted: rgba(255,255,255,.78);
                  background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .rc-scene { position: absolute; right: 0; bottom: var(--rc-g); height: calc(100% - var(--rc-g)); width: var(--rc-scene-w); }
  .rc-ground { position: absolute; left: 0; right: 0; bottom: 0; height: var(--rc-g);
               background: repeating-linear-gradient(90deg, #5aa83d 0 22px, #6cbb4c 22px 44px); }
  .night .rc-ground { background: repeating-linear-gradient(90deg, #1f4a2a 0 22px, #245433 22px 44px); }
  .htext { position: absolute; z-index: 1; left: 0; top: 0; bottom: var(--rc-g); right: calc(var(--rc-scene-w) + 4px);
           display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; min-width: 0; }
  .htext .titles { min-width: 0; }
  .banner .name { font-size: 16px; font-weight: 500; }
  .banner .sub { font-size: 13px; color: var(--rc-sky-muted); }
  .banner .type-icon { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(47,128,237,.18); }
  .banner .type-icon svg { fill: color-mix(in srgb, var(--rc-tint) 85%, #0d2a45); }
  .banner.night .type-icon { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .banner.night .type-icon svg { fill: color-mix(in srgb, var(--rc-tint) 70%, #fff); }
  /* The mini card's detail button: 24 px frosted round in the banner's top right corner. */
  .banner .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; margin: 0; border: 0; color: #33506b;
                  background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); backdrop-filter: blur(4px); }
  .banner .zoom .icon { width: 16px; height: 16px; }
  .banner .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }
  .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner.night .zoom:hover { background: rgba(255,255,255,.22); color: #fff; }
  /* The status pill on the title's row or under the subtitle: see .trow in BASE_STYLE and _fitPill. */
  .htext .titles { flex: 1 1 auto; }
  .banner .chip { line-height: 16px;
                  background: color-mix(in srgb, var(--c, var(--rc-accent)) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c, var(--rc-accent)) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c, var(--rc-accent)) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c, var(--rc-accent)) 35%, #ffffff); }
  .banner .sub { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rc-night, .night .rc-day { display: none; }
  .night .rc-night { display: inline; }
  .rc-star { fill: #fff; opacity: .8; } .rc-star.tw { animation: rc-twinkle 3.2s ease-in-out infinite alternate; }
  .rc-sun { fill: #ffd65a; } .rc-moon { fill: #f4f1dc; }
  .rc-cloud { fill: #fff; opacity: .9; } .rc-cloud.grey { fill: #8a96a6; opacity: .95; } .rc-cloud.dim { fill: #c9d3de; }
  .night .rc-cloud { fill: #3d4a5e; } .night .rc-cloud.grey { fill: #4a5568; } .night .rc-cloud.dim { fill: #3a4558; }
  .dry .rc-cloud { animation: rc-drift 7s ease-in-out infinite alternate; }
  .rc-cloud.approach { animation: rc-approach 6s ease-in-out infinite alternate; }
  .rc-drop { stroke: #4aa3ea; stroke-width: 1.4; stroke-linecap: round; opacity: 0; animation: rc-rain .8s linear infinite; }
  .rc-drop.r1 { animation-delay: -.2s; } .rc-drop.r2 { animation-delay: -.4s; } .rc-drop.r3 { animation-delay: -.6s; }
  .night .rc-drop { stroke: #5aa9e6; }
  .rc-hill { fill: #86c27f; } .night .rc-hill { fill: #17303d; }
  .rc-puddle { fill: #4fb3e8; opacity: .5; transform-box: fill-box; transform-origin: center; animation: rc-puddle 2.4s ease-in-out infinite; }
  .rc-skin { fill: #f2c9a0; } .rc-coat { fill: #2f80ed; } .rc-leg { fill: #444; }
  .rc-shaft { stroke: #444; stroke-width: 1; fill: none; } .rc-umbrella { fill: #e5484d; }
  .night .rc-leg { fill: #59606b; } .night .rc-shaft { stroke: #8a929e; }
  @keyframes rc-rain { from { transform: translateY(-6px); opacity: 0; } 30% { opacity: 1; } to { transform: translateY(34px); opacity: 0; } }
  @keyframes rc-approach { from { transform: translateX(0); } to { transform: translateX(-30px); } }
  @keyframes rc-drift { from { transform: translateX(0); } to { transform: translateX(-6px); } }
  @keyframes rc-puddle { 50% { transform: scaleX(1.12); } }
  @keyframes rc-twinkle { from { opacity: .35; } to { opacity: 1; } }
  /* Narrow card: a smaller picture leaves room for the title; very narrow: the sky and the lawn alone. */
  @container rc-card (max-width: 300px) { .banner { --rc-scene-w: 42%; } }
  /* Very narrow card: no room for the picture beside the text, the sky and the lawn stay. */
  @container rc-card (max-width: 220px) { .rc-scene { display: none; } .htext { right: 36px; } }
`;
