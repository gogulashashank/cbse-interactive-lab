# Design Specification: Interactive 3D Science Book Spread

> **Reference Transparency Note:** A live rendered browser inspection of `https://iamtechartist.com/every-joule/` could not be performed because no interactive browser / WebGL rendering tool is available in this agent environment. Only the public page description and structural metadata were inspected via HTTP. We do not claim visual inspection of the rendered reference experience.

## 1. Experience Vision & Editorial Metaphor
Instead of a multi-card calculator dashboard or form-heavy webpage, the lesson is presented as an **open, tactile two-page science book spread** resting on a quiet study surface:

* **Spread Title:** *"Less force. More distance. Same energy."*
* **Subtitle / Inquiry Focus:** *"Why does a ramp make lifting easier?"*
* **Tactile Book Surface:** Warm cream paper pages (`#f8f3e8`) resting on a darker desk mat (`#e6dfd1`), separated by a central binding crease with subtle page shadows, marginalia rule lines, and editorial page numbers.

## 2. Typography & Colour System
* **Editorial Headings:** Classic book serif (`'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif`) with generous line height and editorial hierarchy.
* **UI & Body Prose:** Clean humanist sans-serif (`system-ui, -apple-system, 'Segoe UI', sans-serif`) for crisp legibility on controls and explanations.
* **Numerical Readouts:** Tabular monospace (`ui-monospace, 'SFMono-Regular', Menlo, monospace`) for exact physical quantities.
* **Colour Palette:**
  * **Paper & Ink:** Warm cream paper (`#f8f3e8`), aged margin tint (`#efe8d8`), deep charcoal ink (`#231f1c`), and muted sepia-grey ink (`#5e554c`) for fine rules and annotations.
  * **Interaction Accent (Force & Controls):** Deep Vermilion / Rust Ink (`#b84221`) — used for the primary ramp-length handle, active preset pills, and the uphill pulling-force vector.
  * **Energy Representation Colour (Work & Potential Energy):** Warm Amber Gold (`#c98a14` / soft fill `#fbf2dc`) — explicitly labelled in the page legend as a conceptual representation of mechanical work and gravitational potential energy ($W = \Delta U_g = mgh$).

## 3. Desktop Two-Page Spread Composition
On desktop viewports (`> 960px`), the open book sits centred on the screen as a balanced two-page spread:

### Left Page (Editorial Inquiry & Narrative)
1. **Top Folio:** Lesson number (`Lesson 01 · Mechanics of Simple Machines`), book running header (`CBSE Interactive Lab`), and the `Prototype — educator and curriculum review pending` stamp.
2. **Editorial Title & Guiding Question:**
   * *"Less force. More distance. Same energy."*
   * Guiding question prompt: *"If we make the ramp longer while keeping the object and height the same, what happens to the pulling force?"*
3. **Prediction Choices:** Clean, book-margin choice pills (*It increases*, *It decreases*, *It stays the same*) that students can select (or skip while still investigating freely).
4. **Contextual Narrative & Answer Flap Slot:** Concise prose introducing the trade-off between effort force and slope distance, plus the paper answer-flap container (ready for Checkpoint B's full reveal and apply check).

### Right Page (Living 3D Diagram & Compact Controls)
1. **Integrated 3D Orthographic Illustration:**
   * A procedural Three.js (`@react-three/fiber`) orthographic scene embedded directly into the right-hand page like an architectural ink-and-wash figure lifting off the paper.
   * **Procedural Geometry:**
     * Paper base grid and ground plane with ink-like edge outlines (`<lineSegments>` with `<edgesGeometry>`).
     * 3D triangular ramp wedge whose horizontal run ($x = \sqrt{L^2 - h^2}$) and vertical rise ($h$) match the exact outputs of `calculateRampMechanics`.
     * 3D block resting on the inclined plane (offset along the outward normal so it sits cleanly on the surface).
     * Vertical height pillar/marker ($h$) and uphill pulling-force vector shaft + coneparallel to the slope.
   * **WebGL Fallback:** Automatically falls back to the accessible 2D SVG diagram (`RampDiagram`) if WebGL is unavailable, fails, or if the student toggles "2D Ink Diagram".
2. **Compact Below-Figure Controls:**
   * Primary **Ramp Length ($L$)** slider (`0.5–8 m`), synchronized exact numeric input, and quick comparison presets (`2 m ramp` vs `4 m ramp`).
   * Secondary **"Explore more (mass & vertical height)"** disclosure (`<details>`) so mass (`1–50 kg`) and vertical height (`0.5–3 m`) remain fully adjustable and validated without cluttering the primary learning surface.
3. **Compact Force / Distance / Energy Strip:**
   * Three clean, ink-bordered margin indicators directly beneath the figure showing **Pulling Force ($F_{\text{pull}}$)**, **Ramp Distance ($L$)**, and **Ideal Work / Energy ($\Delta U_g$)** alongside the direct vertical-lift baseline.

## 4. Mobile Composition
On narrow screens (`<= 960px`), the two-page book transforms into a single continuous page column without shrinking into a miniature spread, ordered strictly as:
**Question → 3D/2D Scene → Compact Controls & Indicators → Contextual Explanation**.
