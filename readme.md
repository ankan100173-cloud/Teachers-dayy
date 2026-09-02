# Teacher's Day Celebration Invitation

A single-page, mobile-first invitation website for a Teacher's Day celebration hosted by the Student Council. Themed in rich crimson and gold, with an animated curtain-opening intro, a blurred classical-statue backdrop, and looping background music that starts after the visitor's first tap or click.

## Key technologies

- Plain HTML, CSS, and vanilla JavaScript — no build step or framework.
- Google Fonts (Cormorant Garamond, Playfair Display, Cinzel) for the invitation typography.
- Netlify for static hosting, configured via `netlify.toml` (`publish = "."`).

## Structure

- `index.html` — page markup: curtain intro, statue backdrop, invitation card, music button.
- `styles.css` — all styling, including the curtain animation, backdrop treatment, and responsive layout.
- `script.js` — opens the curtains on load and handles background music playback/mute.
- `assets/senorita-instrumental.mp3` — local background music track (looped, ~25% volume).

## Running locally

No build step is required. Serve the folder with any static file server, for example:

```bash
npx serve .
```

Then open the printed local URL in a browser. On first click/tap anywhere on the page, background music starts playing (muted autoplay is blocked by browsers, so playback is deferred to the first user interaction). Use the round button in the top-right corner to mute/unmute at any time.

## Deploying

The site is a static bundle with no server-side code. Netlify serves it directly from the repository root as configured in `netlify.toml`.
