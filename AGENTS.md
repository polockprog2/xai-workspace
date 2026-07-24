# Xai — Intelligence Workspace

Premium frontend prototype: raw data → structured intelligence → actionable insight → AI automation. Single-page scroll-driven app with 3D WebGL scenes.

## Stack

- **Next.js 16** (App Router) — not v13/v14/v15; APIs may differ. Check `node_modules/next/dist/docs/` before writing unfamiliar Next.js code.
- **React 19** — client components only for this prototype (no SSR data fetching).
- **Three.js** via `@react-three/fiber` + `@react-three/drei` — 3D particle simulation, camera rig, interactive node graph.
- **GSAP + ScrollTrigger** — scroll-driven camera/morph timeline. GSAP owns scroll-pinned sections; do not mix with Framer Motion on same elements.
- **Framer Motion** — component-level mount/unmount animations and layout transitions (e.g. dashboard tabs).
- **Tailwind CSS v4** — utility-first; custom CSS variables defined in `app/globals.css` via `@theme inline`.

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run lint     # eslint (core-web-vitals config)
```

No typecheck, test, or format commands are configured. Lint is the only CI-like check.

## Key Architecture

- **Entry**: `app/layout.js` → `app/page.js` (client component, the entire SPA)
- **3D Scene**: `components/scene/PersistentScene.jsx` — dynamically imported (`ssr: false`). Camera rig in `CameraRig.jsx`, particle world in `WorldScene.jsx`, morphing core in `DataCore.jsx`
- **Scroll → 3D bridge**: `components/scene/useScrollProgress.js` writes to a plain mutable object `lib/scrollState.js` (not React state) so R3F's `useFrame` loop can read at 60fps without re-renders
- **Scroll stages**: Hero (0–0.15) → Ingest (0.15–0.35) → Analyze (0.35–0.55) → Insight (0.55–0.72) → Signature (0.72–0.88) → Dashboard (0.88–1.0)
- **Image copy hack**: `lib/copyImages.js` runs in `layout.js` server-side — copies generated PNGs from a hardcoded local path (`C:/Users/samir/.gemini/...`) to `public/images/`. This will warn/fail on other machines; it's intentional for this prototype.
- **Custom cursor**: `components/ui/CursorProbe.jsx` replaces the native cursor globally (`cursor: none` in CSS). Interactive elements get `.probe-hoverable` class.

## Component Map

| Directory | Purpose |
|---|---|
| `components/hero/` | Hero section + `DataParticles.jsx` (R3F particle sim) |
| `components/insight-flow/` | Scroll-pinned GSAP timeline of Ingest → Analyze → Insight cards |
| `components/dashboard/` | Framer Motion dashboard with tabs and layout animations |
| `components/signature/` | Interactive 3D node graph (AiCore) — the "WOW" hover moment |
| `components/scene/` | Persistent R3F canvas, camera rig, scroll hook |
| `components/ui/` | Navbar, CursorProbe, InsightOverlay |
| `lib/` | Shared mutable state (`scrollState.js`), mock data, image copy utility |

## Conventions

- **JSX throughout** — no TypeScript. `jsconfig.json` provides `@/*` path alias.
- **GSAP vs Framer Motion boundary**: GSAP handles scroll-pinned timelines and camera transitions. Framer Motion handles component-level enter/exit/layout animations. Never apply both to the same DOM node.
- **No CSS modules** — all styling via Tailwind utilities and `globals.css` custom properties. Custom animations (`shimmer`, `float`, `glow-pulse`) and utility classes (`glass-surface`, `text-shimmer`, `section-divider`) are in `globals.css`.
- **Design tokens** as CSS custom properties in `:root` — `--accent` (rust), `--surface`, `--text-muted`, etc. Map to Tailwind colors via `@theme inline`.
- **Performance guardrails**: Three.js scenes are dynamically imported to avoid SSR hydration errors. Particle count capped at 3,000. `experimental.optimizePackageImports` enabled for heavy libraries in `next.config.mjs`. No trailing slash. No source maps in production.
- **suppressHydrationWarning** on `<html>` and `<body>` — required for dynamic font/CSS variable injection.

## Gotchas

- The `api/image/` route directory exists but is empty — unused or in progress.
- `scrollState.js` is a plain object, not React state. Mutations from GSAP/R3F do not trigger re-renders. Components that need to react to scroll use `requestAnimationFrame` polling (see `PhaseLabel` and `ScrollHUD` in `page.js`).
- `PersistentScene` is `ssr: false` — it only mounts client-side. Do not try to server-render R3F components.
- Lint uses flat config (`eslint.config.mjs` with `eslint-config-next/core-web-vitals`). No `.eslintrc` files.
- The existing `CLAUDE.md` contains only `@AGENTS.md` — it redirects here, no separate content.
