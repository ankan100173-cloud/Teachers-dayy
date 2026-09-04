# AGENTS.md

## Project type

Static single-page site. No framework, no bundler, no build step. Netlify publishes the repository root directly (`netlify.toml`: `publish = "."`).

## Files

- `index.html` — all markup for the single page: curtain overlay, statue backdrop layers, invitation card content, hidden `<audio>` element, and the music toggle button.
- `styles.css` — all styling. Organized by section (statue backdrop, curtains, music button, stage/layout, card). Uses CSS custom properties in `:root` for the color palette (crimson/burgundy/gold).
- `script.js` — small IIFE handling two behaviors: (1) triggering the curtain-open animation via CSS classes on `<body>`, (2) starting/looping background audio on the visitor's interaction (direct click/touchend on the tap-to-open button and document fallback), optimized for mobile devices (e.g., Android Chrome) to adhere to browser autoplay and user gesture policies without interrupting touch sequences.
- `assets/senorita.mp3` — background music, committed locally so Netlify serves it as a same-origin static asset (no external URL dependency).

## Non-obvious decisions

- **Statue backdrop is CSS/SVG-generated, not a photo.** An inline SVG data URI (silhouetted columns/figures) is layered with gradients and `filter: blur(10px)` on a fixed full-viewport element, then tinted with a dark-red multiply overlay. This avoids depending on an external image URL that could break or be slow on Netlify, while still satisfying the "blurred classical statues, dark red tint" visual brief.
- **Curtains use a body class toggle** (`curtains-open`, then `content-visible`) driven by `script.js`, not a CSS-only animation, so the reveal timing can be tuned independently of page-load timing and won't fire before fonts/layout settle.
- **Audio starts on first interaction**, not on load — required to satisfy browser autoplay policies. The mute/play button reflects real audio state (`audio.paused`), not just user intent, so it stays accurate if the browser blocks the initial autoplay attempt.
- **Volume is fixed at 0.25** (25%) in `script.js` per the requested 20–30% range; there is no volume slider by design (only play/mute), matching the "small toggle button" requirement.

## Conventions

- No JS framework or transpilation — keep future additions as plain ES5/ES6-compatible vanilla JS to match `script.js`.
- Keep the color system in the CSS custom properties at the top of `styles.css` rather than hardcoding new colors inline.
- Mobile-first: base styles target small Android viewports; `min-width` media queries in `styles.css` progressively enhance for wider screens (currently at 420px and 640px breakpoints for the details grid).
