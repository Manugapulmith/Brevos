# Brevos — 3D Animated Web Design & Digital Marketing Studio Portfolio

A modern, high-performance, single-page 3D animated portfolio website built for **Brevos**, an elite web design and digital marketing studio specializing in bespoke digital destinations for **luxury hotels, boutique villas, and artisanal cafés**.

Live repository name: `Brevos`  
Ready for instant deployment to **GitHub Pages**.

---

## ✦ Brand Identity & Positioning

- **Studio Name:** Brevos
- **Tagline:** Sculpting Memorable Digital Destinations for Stays & Spaces
- **Target Clientele:** Luxury Hotels, Boutique Villas, Artisanal Cafés & Fine Hospitality Ventures
- **Tone:** Premium, minimal, clean, and memorable through cinematic 3D motion
- **Palette:** Obsidian dark base (`#08090C`) with luminous champagne gold accent (`#E5C07B`)

---

## ✦ Core Sections (Strict Structural Order)

1. **Hero:**
   - Bold 3D animated intro with the Brevos emblem and large clean typography.
   - Interactive Three.js WebGL background featuring nested faceted polyhedrons, orbital gyroscope rings, and ambient stardust constellation.
   - Dual CTAs ("Explore Our Work", "Start Your Project") and quick trust metrics.
   - Scroll indicator guiding visitors through the 3D space.

2. **Services:**
   - **Website Design & Development (Primary Focus)** — Bespoke 3D WebGL experiences, direct booking integration, sub-second load times.
   - **SEO Optimization** — Local pack domination, Google Maps ranking, rich schema markup.
   - **Digital Marketing** — High-ROI paid ad funnels across Meta and Google for peak travel seasons.
   - **Social Media Management** — Orchestrated multi-platform growth (Facebook, Instagram, WhatsApp, Telegram).
   - **Photography & Visual Production** — Architectural captures, 4K drone cinematography, and culinary artistry.
   - Interactive 3D tilt cards with dynamic lighting reflections.

3. **Pricing:**
   - **Basic (LKR 20,000)** — Essential single-page responsive showcase for cafés & emerging spaces.
   - **Standard (LKR 50,000) [Most Popular]** — Multi-section interactive website with 3D scroll motion, booking inquiry forms, and full local SEO.
   - **Premium (LKR 100,000)** — All-inclusive 3D WebGL digital flagship, complete direct booking engine, digital ad strategy, and 30-day dedicated concierge maintenance.
   - "Get Started" CTAs automatically pre-populate the Contact form and WhatsApp inquiry with the chosen tier.

4. **Portfolio:**
   - Filter tabs: *All Projects*, *Live Client Work*, *Hospitality Demos*.
   - **Live Proof-of-Work Case Studies:**
     - [travelwithmaalaka.com](https://travelwithmaalaka.com) — Editorial-grade travel discovery & boutique stay platform.
     - [manugapulmith.github.io/Portfolio](https://manugapulmith.github.io/Portfolio) — Cybernetic dark-mode creative developer platform.
   - **Curated Concept Demos:**
     - *The Grand Azure Hotel & Suites* — 5-Star oceanfront hotel concept with suite booking engine.
     - *Roast & Bloom Artisanal Roastery* — Specialty roastery & café concept with table reservation flow.
     - *Serenia Cliffside Sanctuary & Villas* — Ultra-luxury cliffside villa concept with VIP concierge integration.
   - Interactive modal lightbox with high-res mockups, architecture specifications, and live links.

5. **Contact:**
   - Direct correspondence across WhatsApp Business, Instagram (`@brevos.studio`), Facebook (`BrevosStudio`), Telegram (`@BrevosStudio`), and direct email (`hello@brevos.studio`).
   - Interactive inquiry form with live budget tier pills and field validation.
   - **"Transmit via WhatsApp Instead" button** — Compiles form data into a structured WhatsApp message and opens WhatsApp with one click.

---

## ✦ Technology Stack

- **3D Graphics & WebGL:** [Three.js (r128)](https://threejs.org/)
- **Scroll Interpolation & Kinetics:** [Lenis](https://github.com/darkroomengineering/lenis) + [GSAP 3 & ScrollTrigger](https://greensock.com/gsap/)
- **Styling:** Modern CSS3 (CSS Variables, Backdrop Filters, Glassmorphism, 3D CSS Perspectives)
- **Audio Synthesizer:** Native Web Audio API (zero audio file dependencies)
- **Deployment:** 100% Static HTML5 / CSS3 / Vanilla JS (No build step or Node runtime required for v1)

---

## ✦ Quick Local Preview

You can open `index.html` directly in any modern browser, or spin up a local preview server:

### Using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

### Using Node.js (npx):
```bash
npx serve
```

---

## ✦ Deploying to GitHub Pages

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Brevos 3D animated portfolio website"
   ```

2. **Create GitHub Repository**:
   - Create a new public repository on GitHub named **`Brevos`**.

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/Brevos.git
   git push -u origin main
   ```

4. **Activate GitHub Pages**:
   - Go to your repository **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch: `main` / folder: `/ (root)`.
   - Click **Save**.
   - Your site will be live at `https://<your-username>.github.io/Brevos/`.

---

## ✦ Performance & Mobile Graceful Degradation

- **Adaptive Resolution:** Canvas pixel ratio is capped at `1.5` on mobile devices to prevent GPU thermal throttling.
- **Particle Count Scaling:** Automatically scales down from 1,800 to 700 particles on mobile/touch screens.
- **Touch-Friendly Navigation:** Touch devices bypass cursor transforms and heavy tilt effects while retaining smooth touch momentum.
- **Reduced Motion:** Fully compatible with `prefers-reduced-motion` system accessibility preferences.
