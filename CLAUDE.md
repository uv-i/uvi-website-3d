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
Vite + React 19 SPA. Tailwind CSS for 2D UI. React Three Fiber (R3F) v9 + `@react-three/drei v10` + `three ^0.184.0` for the 3D island. Framer Motion for page transitions and section animations. React Router v6. Vercel Analytics for page view tracking.

### App shell (`src/App.jsx`)
`NavBar` is `fixed top-0 z-50` (height `h-20` = 80px). `<main>` has no top padding — each page handles its own offset. `ChatBot` and `Footer` sit outside `<main>` in the root layout. Any absolute-positioned overlay that needs to clear the NavBar must use `top: 96px` (80px nav + 16px gap).

### Routing
Four pages: `/` `HomePage`, `/games` `GamesPage`, `/lab` `DevLabPage`, `/contact` `ContactPage`. All lazy-loaded via `React.lazy`. AnimatePresence wraps routes for fade transitions.

### Analytics (`src/main.jsx`)
Vercel Analytics is mounted at the root via `<Analytics />` from `@vercel/analytics/react`. Tracks page views automatically on every route change. Only active on the deployed Vercel URL — no data collected locally.

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

`src/state/islandState.js` — thin localStorage wrapper for persisting the user's 2D/3D view preference across sessions.

---

### CMS — Sanity.io
Content for Games and Dev Lab packages is managed via Sanity (project ID: `kgcdsokn`, dataset: `production`).

**Runtime flow:** Pages use custom hooks (`useGamesData`, `useDevLabData`) that:
1. Check localStorage cache first — if fresh (< 1 hr), return instantly, no network call
2. If cache miss, show mockData immediately, fetch Sanity in background
3. On success, update state and save to localStorage for next visit
4. Silently fall back to mockData on any error

**Module-level deduplication:** All hook instances across pages share the same in-flight fetch promise (`mem` + `inflight` objects in `useSanityData.js`). HomePage triggers the fetch on mount — by the time the user navigates to Games or Dev Lab, data is already in memory.

**Cache keys:** `uvi_sanity_games`, `uvi_sanity_devlab` — TTL 1 hour. To force a refresh: `localStorage.clear()` in browser console.

**Sanity schemas** live in `studio/schemas/`:
- `game.js` — document type for both UV originals and partner titles (field `gameType: 'original' | 'partner'`)
- `devLabPackage.js` — document type for Dev Lab entries; `category` field becomes the tab label
- `index.js` — re-exports both schema types

**Sanity client** (`src/lib/sanityClient.js`):
```js
export const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);
```

**GROQ queries** live in `src/lib/sanityQueries.js`.

**Data hooks** live in `src/hooks/useSanityData.js`:
- `useGamesData()` → `{ uvProjects, partnerProjects, loading, error }`
- `useDevLabData()` → `{ teachingData, loading, error }`

#### Local Studio workflow
```bash
cd studio
npm run dev        # opens Sanity Studio at http://localhost:3333
```
The `studio/` folder is a standalone Sanity v3 project. `studio/package.json` must NOT have `"type": "module"` — the CLI (`sanity.cli.js`) uses `module.exports = {}`. Removing it fixed a `require is not defined in ES module scope` error.

**Deployed studio** at `uv-i.sanity.studio` — OAuth (GitHub/Google) is blocked in the Sanity dashboard iframe. Use local studio at `localhost:3333` for all content editing.

#### Seed script (one-time only)
`scripts/seed-sanity.js` — already run. **Do not run again** — creates duplicates.

---

### 2D Home page (`src/pages/HomePage.jsx`)
Thin coordinator (~120 lines). Handles 2D/3D toggle, mobile detection, and `selectedGameIndex`. All visible sections live in `src/components/home/`:

| File | Responsibility |
|---|---|
| `HeroSection.jsx` | Hero with "Explore in 3D" button. Has `pt-20` to clear fixed NavBar. |
| `StatsSection.jsx` | 4 stat cards. Imports `STATS` from mockData. |
| `ServicesSection.jsx` | Service offering cards. Imports `SERVICES` from mockData. |
| `PackagesSection.jsx` | UPM package cards |
| `BuildPicker.jsx` | Interactive Mobile/WebGL/Fortnite picker. Imports `BUILD_OPTIONS` from mockData. |
| `GamesSection.jsx` | First 3 `PARTNER_PROJECTS` as cards |
| `ForgeTeaser.jsx` | Placeholder blog post cards. Imports `FORGE_POSTS` from mockData. |
| `PlatformStrip.jsx` | Platform tags. Imports `PLATFORMS` from mockData. |
| `ShowreelSection.jsx` | **Hidden** — import commented out in `HomePage.jsx` until showreel is ready |
| `fadeUp.js` | Shared Framer Motion variant used across all home sections |

---

### 3D Island system
The 3D view replaces the entire page content when active.

```
IslandView.jsx          ← thin layout wrapper; composes hud/ + IslandScene
  hud/
    LoadingOverlay.jsx  ← small corner progress pill (non-blocking); fades out at 100%
    TitleHUD.jsx        ← top-left canvas label
    StatsHUD.jsx        ← studio stats pill. Imports STUDIO_STATS from mockData.
    HintBar.jsx         ← orbit/zoom/click hints
    BackButton.jsx      ← "Back to 2D View" pill (bottom, centered)
  IslandScene.jsx       ← Canvas config (camera, gl, dpr, frameloop="demand")
    scene/
      SceneContent.jsx  ← lights, fog, OrbitControls, PingPongRotate, AnimationPulse
      VikingIsland.jsx  ← 5-layer progressive loader + particles + landmarks
      Landmark.jsx      ← invisible hit box + Html placard per landmark
      LeoOrb.jsx        ← glowing orb at [-2, 3.5, -1]; click fires `leo:open` event
      landmarks.js      ← LANDMARKS array (hitPos, hitSize, placardPos, route, tags)
      CelestialBodies.jsx, DustMotes.jsx, OrbitLight.jsx  ← atmosphere
```

#### Progressive 5-layer loading
The scene no longer blocks on a single GLB. Five separate files load independently — canvas shows immediately with atmosphere while assets stream in. Each layer rises up from Y=-8 with an ease-out-expo animation when its GLB resolves.

| Layer | File | Contents |
|---|---|---|
| 1 | `island_terrain.glb` | Island base, lake, mountains, floating rocks |
| 2 | `island_vegetation.glb` | All pine/round/peepal trees |
| 3 | `island_buildings.glb` | House, fence posts, gates, path |
| 4 | `island_activity.glb` | Dock, anvil, hammer, rocks, map board |
| 5 | `island_props.glb` | Table, bench, scrolls |

All 5 files live in `public/models/`. `IslandScene.jsx` preloads all 5 at module level. `VikingIsland.jsx` wraps each in its own `<Suspense fallback={null}>` inside a shared bob-animation group.

**To re-export from Blender:** Use the Python script pattern in the session history — select objects by collection/parent, export with `use_selection=True`, `export_yup=True`. Output to `public/models/`.

**Planned Tamil cultural scene** — same 5-layer structure, swap the GLB files:
1. Terrain — Western Ghats mountains, river/kulam, red soil
2. Vegetation — Coconut palms, banana, banyan, neem, lotus
3. Buildings + fence — Gopuram temple, Chettinad house, mandapam, stone wall
4. Activity — Pottery kiln, fishing vallam/ghat
5. Props — Clay pots (kudam), oil lamp (kuthuvilakku), kolam, ammi kallu

**Critical R3F constraints:**
- `frameloop="demand"` — canvas only re-renders on `invalidate()`. `AnimationPulse` calls `invalidate()` every frame.
- `<Html>` placards need `overflow: 'visible'` — `IslandView` must NOT use `overflow: hidden`.
- Landmark hit boxes must not overlap `LeoOrb` at `[-2, 3.5, -1]`. Boundaries: devlab `X[-9.25,-4.75] Z[-5.25,-0.75]`, games `X[1.75,5.25] Z[1.75,5.25]`, contact `X[-14.5,-9.5] Z[1.5,6.5]`.
- Three.js coords from Blender: `(X, Y, Z)_three = (X, Zblender, -Yblender)`.

---

### Leo chatbot (`src/components/organisms/ChatBot.jsx`)
- `src/hooks/useLeoFacts.js` — Fisher-Yates shuffled fact queue; idle trigger (4 s); hidden on `/games` and `/lab`
- `src/utils/chatbotLinks.js` — `PAGE_LINKS` keyword map + `extractPageLinks()` for in-reply navigation chips
- `ChatBot.jsx` — orchestrates open/close state, message thread, Gemini send, `leo:open` DOM event listener
- `src/services/aiService.js` — Gemini API wrapper; key read from `VITE_GEMINI_API_KEY` env var

Leo is opened from the 3D island via `window.dispatchEvent(new CustomEvent('leo:open'))`.

**Gemini API key restriction:** In Google Cloud Console, restrict the key to HTTP referrer `yourdomain.com/*` to prevent abuse (key is exposed in the client bundle — this is unavoidable for a pure SPA).

---

### Contact form (`src/pages/ContactPage.jsx`)
Uses **EmailJS** — submissions arrive as real emails in your Gmail inbox. No backend, no dashboard to check.

- Service: EmailJS free tier (200 emails/month)
- Variables sent: `name`, `email`, `subject`, `message`
- **AI Polish** button uses `AIService.polishMessage()` via Gemini to rewrite the message professionally
- On send failure, shows inline error: "Something went wrong — please email us directly."

**EmailJS env vars** (Vercel + `.env.local`):
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```
Get these from: emailjs.com → Email Services (Service ID) → Email Templates (Template ID) → Account → General → API Keys (Public Key).

---

### NavBar (`src/components/layout/NavBar.jsx`)
- **"Work With Us"** button (`CTALink`) uses React Router `<Link to="/contact">` — navigates to the contact page
- Automatically hidden on `/contact` (both desktop and mobile) via `useLocation()`
- No `APP_CONFIG.contactEmail` dependency — removed from NavBar

---

### Hooks
| Hook | Purpose |
|---|---|
| `useIdle(ms)` | Returns `true` after `ms` ms of no pointer/keyboard activity |
| `useLeoFacts(isOpen)` | Fact cycling + bubble show/hide |
| `useMagnetic` | Magnetic pull effect on NavBar links |
| `useLogoTilt` | Gyro/mouse tilt on the NavBar logo |
| `use3DTilt` | Card 3D tilt on hover |
| `useGamesData` | Sanity fetch with localStorage cache + module-level dedup; falls back to mockData |
| `useDevLabData` | Same pattern as useGamesData |

### Styling conventions
- Tailwind utility classes for all 2D UI
- Inline `style={{}}` objects for all 3D HUD overlays (R3F HTML portal layer)
- All `@keyframes` live in `src/index.css` — never inline `<style>` tags in JSX except inside R3F `<Html>` components
- Dark/light theme via `useTheme()` from `src/context/ThemeContext.jsx`; dark default

---

## Environment variables

All env vars must be set in **Vercel dashboard → Settings → Environment Variables** AND in local **`.env.local`** (gitignored).

| Variable | Purpose |
|---|---|
| `VITE_SANITY_PROJECT_ID` | `kgcdsokn` — enables Sanity CMS fetches |
| `VITE_SANITY_DATASET` | `production` |
| `VITE_GEMINI_API_KEY` | Leo chatbot + AI Polish on contact form |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Gmail service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

---

## Pending work

- **Task #10** — Strip all personal references (`huntingbhu@gmail.com`, `Bhuvanesh`) from the site. Check `APP_CONFIG.contactEmail` in `mockData.js`, ContactPage, and Footer.
- **Task #20** — Audit `src/App.css` for orphaned rules. `src/hooks/useScrollNavigation.js` is unused — delete it.
- **Showreel** — Set `APP_CONFIG.showreelYoutubeId` to a YouTube ID and uncomment the two showreel lines in `HomePage.jsx`.
- **Tamil scene** — Build the 5-layer Tamil cultural island in Blender, export using the same layer naming convention, drop into `public/models/` replacing the Viking GLBs.
- **Hosted Studio login** — `uv-i.sanity.studio` OAuth blocked in dashboard iframe. Use local studio (`localhost:3333`).

---

## File writing constraint

The `Write` tool truncates files beyond ~390 lines. For files that will exceed this, write the first ~385 lines to `/tmp/head.jsx`, the remainder to the outputs scratch folder, then concatenate with `cat head tail > destination`.
