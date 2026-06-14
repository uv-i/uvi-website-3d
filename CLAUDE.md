# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (hot reload)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Serve the production build locally
```

Build note: `npm run build` fails in Linux sandboxes because `@rollup/rollup-linux-x64-gnu` is missing. Run it on Windows. Use static import analysis to verify correctness instead.

---

## Architecture

### Stack
Vite + React 19 SPA. Tailwind CSS for 2D UI. React Three Fiber (R3F) v9 + `@react-three/drei v10` + `three ^0.184.0` for the 3D island. Framer Motion for page transitions and section animations. React Router v6.

### App shell (`src/App.jsx`)
`NavBar` is `fixed top-0 z-50` (height `h-20` = 80px). `<main>` has no top padding — each page handles its own offset. `ChatBot` and `Footer` sit outside `<main>` in the root layout. Any absolute-positioned overlay that needs to clear the NavBar must use `top: 96px` (80px nav + 16px gap).

### Routing
Four pages: `/` `HomePage`, `/games` `GamesPage`, `/lab` `DevLabPage`, `/contact` `ContactPage`. All lazy-loaded via `React.lazy`. AnimatePresence wraps routes for fade transitions.

### Data layer (`src/data/mockData.js`)
Single source of truth for all content — also serves as the **fallback** when Sanity is not configured or unreachable.

Exports:
- `APP_CONFIG` — studio name, email, location, social links, showreel YouTube ID (set to `null` to hide showreel)
- `UV_PROJECTS` — UV Interactives' own IPs
- `PARTNER_PROJECTS` — client-maintained titles (e.g. Guess In 10)
- `TEACHING_DATA` — Dev Lab tabs and packages
- `CHATBOT_PERSONA` — Leo's system prompt, intro messages, and 10 fact bubbles
- `STATS` — 4 stat cards for StatsSection (includes Lucide icon refs — not JSON-serialisable)
- `STUDIO_STATS` — 3 stat pills for StatsHUD in the 3D island
- `SERVICES` — service offering cards (includes Lucide icon refs)
- `BUILD_OPTIONS` — Mobile/WebGL/Fortnite picker options (includes Lucide icon refs)
- `PLATFORMS` — platform tag array for PlatformStrip
- `FORGE_POSTS` — placeholder blog post cards for ForgeTeaser

**Important:** `STATS`, `SERVICES`, and `BUILD_OPTIONS` contain Lucide React icon component references. They cannot be serialised to JSON or stored in Sanity — keep them in `mockData.js` permanently.

`src/services/aiService.js` holds the Gemini API key (currently empty string — add key to enable Leo's live AI replies).

`src/state/islandState.js` — thin localStorage wrapper for persisting the user's 2D/3D view preference across sessions.

### CMS — Sanity.io
Content for Games and Dev Lab packages is managed via Sanity (project ID: `kgcdsokn`, dataset: `production`).

**Runtime flow:** Pages use custom hooks (`useGamesData`, `useDevLabData`) that:
1. Immediately return `mockData.js` values (zero loading flash)
2. Fetch from Sanity in the background if `VITE_SANITY_PROJECT_ID` is set
3. Silently fall back to mockData on any error

**Sanity schemas** live in `studio/schemas/`:
- `game.js` — document type for both UV originals and partner titles (field `gameType: 'original' | 'partner'`)
- `devLabPackage.js` — document type for Dev Lab entries; `category` field becomes the tab label
- `index.js` — re-exports both schema types

**Sanity client** (`src/lib/sanityClient.js`):
```js
// isSanityConfigured is false when env var is absent → skips all fetches
export const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);
```

**GROQ queries** live in `src/lib/sanityQueries.js`.

**Data hooks** live in `src/hooks/useSanityData.js`:
- `useGamesData()` → `{ uvProjects, partnerProjects, loading, error }`
- `useDevLabData()` → `{ teachingData, loading, error }` (groups flat Sanity array by `category` to match `TEACHING_DATA` shape)

**Vercel env vars** (must be set in Vercel dashboard → Settings → Environment Variables):
- `VITE_SANITY_PROJECT_ID` = `kgcdsokn`
- `VITE_SANITY_DATASET` = `production`

#### Local Studio workflow
```bash
cd studio
npm run dev        # opens Sanity Studio at http://localhost:3333
```
The `studio/` folder is a standalone Sanity v3 project. It has its own `package.json` (no `"type": "module"` — CJS required for sanity CLI), `sanity.config.js` (ESM, used by the Studio runtime), and `sanity.cli.js` (CJS, used by the CLI).

**Important CJS/ESM note:** `studio/package.json` must NOT have `"type": "module"`. The Sanity CLI (`sanity.cli.js`) uses `module.exports = {...}`. Removing `"type": "module"` fixed a `require is not defined in ES module scope` error.

**Deployed studio** at `uv-i.sanity.studio` — OAuth login (GitHub/Google) is blocked when the studio is embedded inside the Sanity dashboard iframe. Workaround: use the local studio at `localhost:3333` for content editing. Alternatively, open `https://uv-i.sanity.studio` directly in an incognito window (not through the dashboard) and try GitHub login.

#### Seed script (one-time only)
`scripts/seed-sanity.js` imports all existing mockData content into Sanity. **Run only once** — re-running creates duplicates.

```bash
# 1. Create .env.seed (already in .gitignore)
cp .env.seed.example .env.seed
# Fill in SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN (Editor role token)

# 2. Get an Editor token:
#    sanity.io/manage → project kgcdsokn → API → Tokens → Add API token (Editor role)

# 3. Run from project root (not studio/)
node scripts/seed-sanity.js
```

The seed script reads `.env.seed` manually (no dotenv dependency) — must be run from the project root so the relative path resolves correctly.

---

### 2D Home page (`src/pages/HomePage.jsx`)
Thin coordinator (~120 lines). Handles 2D/3D toggle, mobile detection, and `selectedGameIndex`. All visible sections live in `src/components/home/`:

| File | Responsibility |
|---|---|
| `HeroSection.jsx` | Hero with "Explore in 3D" button. Has `pt-20` to clear fixed NavBar. |
| `StatsSection.jsx` | 4 stat cards (`items-stretch` + `h-full` for uniform height). Imports `STATS` from mockData. |
| `ServicesSection.jsx` | Service offering cards. Imports `SERVICES` from mockData. |
| `PackagesSection.jsx` | UPM package cards |
| `BuildPicker.jsx` | Interactive Mobile/WebGL/Fortnite picker. Imports `BUILD_OPTIONS` from mockData. |
| `GamesSection.jsx` | First 3 `PARTNER_PROJECTS` as cards |
| `ForgeTeaser.jsx` | Placeholder blog post cards. Imports `FORGE_POSTS` from mockData. |
| `PlatformStrip.jsx` | Platform tags. Imports `PLATFORMS` from mockData. |
| `ShowreelSection.jsx` | **Hidden** — import is commented out in `HomePage.jsx` until showreel is ready |
| `fadeUp.js` | Shared Framer Motion variant used across all home sections |

### 3D Island system
The 3D view replaces the entire page content when active.

```
IslandView.jsx          ← thin layout wrapper; composes hud/ + IslandScene
  hud/
    LoadingOverlay.jsx  ← GLB progress spinner (fades out at 100%)
    TitleHUD.jsx        ← top-left canvas label (bottom: 16px, left: 20px currently)
    StatsHUD.jsx        ← studio stats pill (top: 150px, left: 20px currently). Imports STUDIO_STATS from mockData.
    HintBar.jsx         ← orbit/zoom/click hints (top: 150px, left: 20px currently)
    BackButton.jsx      ← "Back to 2D View" pill (bottom: 16px, centered)
  IslandScene.jsx       ← Canvas config (camera, gl, dpr, frameloop="demand")
    scene/
      SceneContent.jsx  ← lights, fog, OrbitControls, PingPongRotate, AnimationPulse
      VikingIsland.jsx  ← loads /public/models/viking_island.glb
      Landmark.jsx      ← invisible hit box + Html placard per landmark
      LeoOrb.jsx        ← glowing orb at [-2, 3.5, -1]; click fires `leo:open` event
      landmarks.js      ← LANDMARKS array (hitPos, hitSize, placardPos, route, tags)
      CelestialBodies.jsx, DustMotes.jsx, OrbitLight.jsx  ← atmosphere
```

**Critical R3F constraints:**
- `frameloop="demand"` — canvas only re-renders on `invalidate()`. `AnimationPulse` calls `invalidate()` every frame to keep continuous animations alive.
- `<Html>` placards need `overflow: 'visible'` on their wrapper and the `IslandView` container must NOT use `overflow: hidden` — otherwise expanded hover content clips.
- Landmark hit boxes must not overlap `LeoOrb` position `[-2, 3.5, -1]`. Hit box boundaries: devlab `X[-9.25,-4.75] Z[-5.25,-0.75]`, games `X[1.75,5.25] Z[1.75,5.25]`, contact `X[-14.5,-9.5] Z[1.5,6.5]`.
- Three.js coords map from Blender as: `(X, Y, Z)_three = (X, Zblender, -Yblender)`.

### Leo chatbot (`src/components/organisms/ChatBot.jsx`)
Concerns are split across three files:
- `src/hooks/useLeoFacts.js` — Fisher-Yates shuffled queue for fact cycling; idle trigger (4 s); hidden on `/games` and `/lab`
- `src/utils/chatbotLinks.js` — `PAGE_LINKS` keyword map + `extractPageLinks()` for in-reply navigation chips
- `ChatBot.jsx` — orchestrates open/close state, message thread, Gemini send, `leo:open` DOM event listener

Leo is opened from the 3D island via `window.dispatchEvent(new CustomEvent('leo:open'))`.

### Hooks
| Hook | Purpose |
|---|---|
| `useIdle(ms)` | Returns `true` after `ms` ms of no pointer/keyboard activity |
| `useLeoFacts(isOpen)` | Fact cycling + bubble show/hide (see above) |
| `useMagnetic` | Magnetic pull effect on NavBar links |
| `useLogoTilt` | Gyro/mouse tilt on the NavBar logo |
| `use3DTilt` | Card 3D tilt on hover |
| `useGamesData` | Fetches games from Sanity; falls back to mockData |
| `useDevLabData` | Fetches Dev Lab packages from Sanity; falls back to mockData |

### Styling conventions
- Tailwind utility classes for all 2D UI
- Inline `style={{}}` objects for all 3D HUD overlays (they sit inside R3F's HTML portal layer)
- All `@keyframes` live in `src/index.css` — never inline `<style>` tags in JSX except inside R3F `<Html>` components
- Dark/light theme via `useTheme()` from `src/context/ThemeContext.jsx`; dark default

---

## Pending work

- **Task #10** — Strip all personal references (`huntingbhu@gmail.com`, `Bhuvanesh`) from the site. The email is in `APP_CONFIG.contactEmail` in `mockData.js`. Check ContactPage form and Footer.
- **Task #20** — Audit `src/App.css` for orphaned rules. `src/hooks/useScrollNavigation.js` is not imported anywhere and can be deleted.
- **Showreel** — Set `APP_CONFIG.showreelYoutubeId` to a YouTube ID and uncomment the two showreel lines in `HomePage.jsx` to go live.
- **Gemini key** — Add key to `src/services/aiService.js` `apiKey` field to enable Leo's live AI replies.
- **Hosted Studio login** — `uv-i.sanity.studio` OAuth is blocked in the Sanity dashboard iframe. Use local studio (`localhost:3333`) until resolved.

---

## File writing constraint

The `Write` tool truncates files beyond ~390 lines. For files that will exceed this, write the first ~385 lines to `/tmp/head.jsx`, the remainder to the outputs scratch folder, then concatenate with `cat head tail > destination`.
