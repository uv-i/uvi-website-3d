# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
Single source of truth for all content:
- `APP_CONFIG` — studio name, email, location, social links, showreel YouTube ID (set to `null` to hide showreel)
- `UV_PROJECTS` — UV Interactives' own IPs
- `PARTNER_PROJECTS` — client-maintained titles (e.g. Guess In 10)
- `TEACHING_DATA` — Dev Lab tabs and packages
- `CHATBOT_PERSONA` — Leo's system prompt, intro messages, and 10 fact bubbles

`src/services/aiService.js` holds the Gemini API key (currently empty string — add key to enable Leo's live AI replies).

`src/state/islandState.js` — thin localStorage wrapper for persisting the user's 2D/3D view preference across sessions.

### 2D Home page (`src/pages/HomePage.jsx`)
Thin coordinator (~120 lines). Handles 2D/3D toggle, mobile detection, and `selectedGameIndex`. All visible sections live in `src/components/home/`:

| File | Responsibility |
|---|---|
| `HeroSection.jsx` | Hero with "Explore in 3D" button. Has `pt-20` to clear fixed NavBar. |
| `StatsSection.jsx` | 4 stat cards (`items-stretch` + `h-full` for uniform height). Stat value = `8+` YOE. |
| `ServicesSection.jsx` | Service offering cards |
| `PackagesSection.jsx` | UPM package cards |
| `BuildPicker.jsx` | Interactive Mobile/WebGL/Fortnite picker |
| `GamesSection.jsx` | First 3 `PARTNER_PROJECTS` as cards |
| `ForgeTeaser.jsx` | Placeholder blog post cards |
| `ShowreelSection.jsx` | **Hidden** — import is commented out in `HomePage.jsx` until showreel is ready |
| `fadeUp.js` | Shared Framer Motion variant used across all home sections |

### 3D Island system
The 3D view replaces the entire page content when active.

```
IslandView.jsx          ← thin layout wrapper; composes hud/ + IslandScene
  hud/
    LoadingOverlay.jsx  ← GLB progress spinner (fades out at 100%)
    TitleHUD.jsx        ← top-left canvas label (bottom: 16px, left: 20px currently)
    StatsHUD.jsx        ← studio stats pill (top: 150px, left: 20px currently)
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

---

## File writing constraint

The `Write` tool truncates files beyond ~390 lines. For files that will exceed this, write the first ~385 lines to `/tmp/head.jsx`, the remainder to the outputs scratch folder, then concatenate with `cat head tail > destination`.
