# LensAR: Arcade

LensAR: Arcade is a small TypeScript + React demo that overlays a simple arcade-style 3D object and gameplay on top of a physical AR marker using AR.js (three.js integration) and @react-three/fiber. The project demonstrates a marker-based AR experience in the browser: detect the Hiro marker, render a 3D object attached to the marker, and provide a minimal game loop (collect coins, score, UI overlay).

This README covers project structure, setup, local development, deployment tips, and troubleshooting.

---

Table of Contents
- About
- Features
- Tech stack
- Quick start
- Development
- Build & deploy
- Project structure
- Key implementation notes
- Configuration
- Troubleshooting & tips
- Contributing
- License & credits

---

## About

This is a demo / prototype that shows how to combine AR.js and three.js with React via `@react-three/fiber`. The application:
- Loads AR.js (three.js/ARToolkit) to detect a Hiro marker from the device camera.
- Uses `@react-three/fiber` to render a 3D scene attached to the detected marker.
- Implements a small interactive object (`ARObject`) with simple animations and a coin-collection mechanic.
- Provides a UI overlay (score, start/reset, help) built with TailwindCSS.

---

## Features

- Marker-based AR experience using the Hiro marker pattern.
- 3D rendering built with three.js + @react-three/fiber.
- Simple arcade-style UI overlay (score, start/stop).
- Responsive UI with TailwindCSS.
- External AR.js library loaded in `index.html` and THREE injected as a global for AR.js compatibility.

---

## Tech stack

- TypeScript
- React
- Vite
- three.js
- @react-three/fiber
- AR.js (ARToolkit integration for three.js) — loaded from raw.githack in index.html
- TailwindCSS
- (UI icons) lucide-react

---

## Quick start

Prerequisites:
- Node.js (recommended >= 16, 18+ preferred)
- npm or yarn
- For camera: modern browser with camera access; HTTPS required unless using `localhost`

Typical commands (replace with your package manager if different):

1. Install dependencies
   - npm:
     ```
     npm install
     ```
   - yarn:
     ```
     yarn
     ```

2. Run the dev server
   ```
   npm run dev
   ```
   By default this starts Vite (see `vite.config.ts` which configures the server on port 3000 and host `0.0.0.0`).

3. Open in your browser
   - `http://localhost:3000/` (camera access will be prompted by the browser)

4. Usage
   - Give camera permission when prompted.
   - Point the camera at a printed or displayed Hiro marker (the repository references the standard Hiro marker).
   - Start the game via the overlay; collect coins by interacting with objects (touch/click).

Note: If you run the site from a remote host, ensure it's served over HTTPS to allow camera access from mobile browsers.

---

## Development

Main entry points we analyzed:
- `index.html` — config for Tailwind, imports, and injects `THREE` global and AR.js script.
- `index.tsx` — app bootstrap (Vite + React entry — standard).
- `App.tsx` — main application component. Contains the ARController component, game state, UI overlay, and 3D Canvas.
- `components/ARObject.tsx` — the 3D object and animations (box, coin, shadow plane, etc.) and interaction handlers.
- `components/UIOverlay.tsx` — UI layer that shows score, start/reset, help, and loading states.
- `constants.ts` — marker/camera data paths and UI messages.
- `types.ts` — TypeScript declarations and global augmentation for `window.THREE` and `window.THREEx`.

Common development tasks:
- Adjusting 3D behavior: modify `components/ARObject.tsx`.
- Tweaking AR initialization: `App.tsx` contains ARToolkitSource, ArToolkitContext, and ArMarkerControls initialization.
- Styling: `index.html` includes Tailwind config and `index.css` is used for app styles.

Suggested scripts to verify (typical, modify per your package.json):
- `dev` — start Vite dev server
- `build` — `vite build`
- `preview` — `vite preview`

---

## Build & deploy

Because this is a static, client-side app, you can build and host it on any static hosting platform (Netlify, Vercel, GitHub Pages, Surge, etc.)

1. Build:
   ```
   npm run build
   ```

2. Deploy the `dist/` output to your static host.

Deployment notes:
- Ensure `data/` marker files (e.g., `data/patt.hiro`, `data/camera_para.dat`) are available in the published site at the expected relative paths (these are referenced by ARToolkit).
- If you load AR.js from an external URL (as in `index.html`), verify the CDN or raw.githack link is stable or consider bundling AR.js or serving it locally to improve reliability.

---

## Project structure (high-level)

- index.html — app shell + global script injection (THREE + AR.js)
- index.tsx — React bootstrap
- App.tsx — main app, ARController, game state
- components/
  - ARObject.tsx — 3D object and animations
  - UIOverlay.tsx — HUD and controls
- constants.ts — marker and UI constants
- types.ts — TypeScript types and global declarations
- vite.config.ts — Vite configuration (aliases, env defines)
- index.css — app CSS (Tailwind + overrides)
- data/ (expected)
  - patt.hiro
  - camera_para.dat

---

## Key implementation notes & gotchas

- AR.js integration:
  - `index.html` injects `THREE` onto `window` before loading AR.js so AR.js can find the global THREE. This is necessary for older AR.js/THREE integration patterns.
  - AR.js script is loaded from an external `raw.githack.com` URL; consider serving a local copy or pinning a release to avoid breakage.
- Marker files:
  - The app assumes `data/patt.hiro` and `data/camera_para.dat` are reachable via relative paths. Ensure these paths are correct after deployment.
- Camera & HTTPS:
  - Most browsers require secure contexts (HTTPS) to access the camera. `http://localhost` is typically allowed for development.
- Timing & readiness:
  - The code polls for `window.THREEx` and `window.THREE` to know when AR is ready. If those globals are not set, the app remains in LOADING state.
  - The app uses a small `setTimeout` after AR source initialization to force a resize — this helps on some devices with odd video aspect ratios.
- Performance:
  - Mobile devices may be CPU/GPU bound. Consider lowering mesh complexity or turning off certain effects for mobile.

---

## Configuration

- Environment variables:
  - `vite.config.ts` references `GEMINI_API_KEY` in `process.env` (via `loadEnv`). If you have any APIs, add `.env` or environment entries accordingly. If you are not using those APIs, you can ignore these variables.
- Marker & camera params:
  - Constants are available in `constants.ts`:
    - `MARKER_HIRO_URL` — path to the marker pattern (default `data/patt.hiro`)
    - `CAMERA_PARAM_URL` — path to `camera_para.dat`
    - `HIRO_MARKER_IMAGE` — helpful image URL for the Hiro marker

---

## Troubleshooting & tips

Symptom: "No video / AR not detecting marker"
- Make sure the browser has camera permission.
- Run on `localhost` (dev) or HTTPS in production.
- Check console for errors about failing to load AR.js or camera parameters.
- Verify `data/patt.hiro` and `data/camera_para.dat` are reachable (404s in network panel).
- Use the standard Hiro marker (print it, or display its image on a second device/screen). The repo includes `HIRO_MARKER_IMAGE` constant that points to a public image.

Symptom: "Window.THREE or window.THREEx is undefined"
- Confirm that `index.html` is injecting THREE before the AR.js script is loaded. If the external AR.js link fails, the AR setup cannot complete.

Symptom: "App stuck at LOADING AR ENGINE..."
- The app polls for `window.THREE` and `window.THREEx`. If those globals never appear, the poll never clears. Check script loading order and network errors.

Improvement suggestions:
- Bundle AR.js or add it as a local asset to avoid external raw.githack reliance.
- Add feature detection and fallbacks for devices that do not support required Web APIs.
- Add unit/e2e tests for core UI flows.

---

## Contributing

Contributions are welcome. Typical contribution workflow:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/some-change`
3. Make changes
4. Ensure app builds and works locally
5. Open a PR with a clear description of the change

When proposing changes to AR.js integration, explain testing steps (how you verified marker detection on mobile/desktop).

---

## License & credits

- Add your preferred license (e.g. MIT). This demo currently has no license file — add one if you want to make it reusable by others.
- Credits:
  - AR.js / ARToolkit
  - three.js
  - @react-three/fiber
  - TailwindCSS

---

If you'd like, I can:
- Add this README to the repository as a new file (open a PR).
- Create a small checklist of improvements (bundle AR.js locally, add sample marker assets in `data/`, add CI preview).
Tell me which you'd like me to do next.
