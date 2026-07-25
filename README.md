# Xai — Intelligence Workspace

**Xai** is a premium, high-fidelity frontend prototype built to demonstrate a powerful narrative: **Raw Data → Structured Intelligence → Actionable Insight → AI Automation.**

This project acts as a high-tier product demonstration, leveraging advanced 3D WebGL scenes and scroll-driven choreography to convey a sense of a calm, technically confident, and deeply intelligent system.

---

## 📖 The Narrative
The core flow of the page tells the product's story visually:
1. **Hero**: Chaotic, raw data particles morph smoothly into an organized, structured geometric grid—representing the exact moment chaos becomes intelligence.
2. **Interactive Insight Flow**: The core AI lifecycle (Ingest -> Analyze -> Insight) is mapped to a scroll-pinned GSAP timeline, emphasizing that the system is procedural and connected.
3. **Intelligence Dashboard**: A highly polished, Framer Motion-powered interactive dashboard that grounds the abstract concepts in a believable, usable product reality.
4. **Signature Interaction (AiCore)**: A bespoke, interactive 3D WebGL node that responds physically to the user, highlighting the "engine" beneath the surface.

---

## 🛠️ Technical Approach

### 1. Hero Morph (Three.js / React Three Fiber)
The centerpiece of the hero is a custom particle simulation. Using `@react-three/fiber` and `@react-three/drei`, 3,000 individual particles are initialized in a randomized sphere. On scroll, `useFrame` interpolates each particle's position towards a calculated 3D grid state. This required math-heavy position lerping rather than relying on stock animations, ensuring a unique, code-generated visual that runs at 60fps. The scene is dynamically imported to avoid blocking the initial page render.

### 2. Interactive Insight Flow (GSAP ScrollTrigger)
To create a connected timeline, `gsap` and `ScrollTrigger` were used to pin the section during scroll. The `autoAlpha` and `scale` properties of the three stage cards (Ingest, Analyze, Insight) are choreographed sequentially, with a glowing accent line bridging the gap between them to represent the flow of data.

### 3. Intelligence Dashboard (Framer Motion)
Built with Framer Motion, this mock dashboard features staggered entrance animations and smooth, spring-based layout animations for the tab switching (`layoutId="active-tab"`). The UI is strictly governed by Tailwind utility classes to maintain a consistent, restrained "near-black" design system, avoiding bloated CSS files.

### 4. Signature Interaction (R3F Icosahedron)
The final section features an interactive `Icosahedron` geometry powered by a `MeshDistortMaterial`. Hover interactions are tracked via R3F's pointer events, which dynamically adjust the scale, rotation speed, and distortion factor of the material in real-time, creating a highly tactile "WOW" moment.

---

## 💻 Tech Stack
- **Framework**: Next.js (App Router)
- **UI Library**: React (.jsx)
- **Styling**: Tailwind CSS (v4)
- **3D / WebGL**: Three.js, @react-three/fiber, @react-three/drei
- **Scroll Animations**: GSAP + ScrollTrigger
- **UI Choreography**: Framer Motion

---

## 🚀 Local Setup & Run Instructions

To run the Xai prototype locally:

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd xai-workspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **View the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Key Animation & Interaction Decisions
*(This section serves as a guide for the walkthrough video)*

- **Intentional Easing**: We avoided linear or default easings, opting for custom cubic-bezier curves (e.g., `ease: [0.16, 1, 0.3, 1]`) to create a snappy yet smooth, premium feel comparable to top-tier enterprise landing pages.
- **Performance First**: The Three.js scenes are dynamically imported to prevent SSR hydration errors and improve Initial Load times. Particle counts were capped at 3,000 to ensure smooth 60fps execution on mid-range devices.
- **Separation of Concerns**: GSAP was used exclusively for scroll-driven, timeline-based events where absolute positioning and sequential locking were required, while Framer Motion was delegated to component-level mounting, unmounting, and micro-interactions (like the dashboard tabs). This prevents the two engines from conflicting over DOM elements.



####
Task List — 3D Integration, Interactivity & Accessibility Upgrade
3D Integration
 Create components/ui/SceneHUD.jsx — camera mode badge + morph progress bar
 Add mouseParallaxX/Y fields to lib/scrollState.js
 Update CursorProbe.jsx to write normalized mouse coords to scrollState
 Update CameraRig.jsx to apply mouse parallax offset
 Wire SceneHUD into app/page.js (replace PhaseLabel)
Interactivity
 Update Hero.jsx — make metric chips hoverable with tooltips + aria-labels
 Update InsightFlow.jsx — make step badges clickable to jump stages
 Update DashboardPreview.jsx — live data tick + aria-live + keyboard nav
Accessibility
 Update globals.css — prefers-reduced-motion block
 Update CursorProbe.jsx — detect reduced motion, return null if set
 Update app/layout.js — skip-to-content link
 Update app/page.js — add id="main-content" to main
 Update Navbar.jsx — role + aria-label
 Update Hero.jsx — aria-labels on CTAs + metrics region
 Update SignatureInteraction.jsx — aria-live + aria-pressed
Verification
 npm run lint passes
 npm run build succeeds