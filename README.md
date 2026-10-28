# CBSE Interactive Lab — Illustrated Science Notebook

An interactive 3D & 2D science notebook prototype for CBSE Class 9–10 Physics:

- **Lesson I · Inclined Plane (Simple Machines):** *“Less Force. More Distance. Same Energy.”*
- **Lesson II · Convex Lens (Class 10 Optics — NCERT Sections 9.3.3–9.3.8 & Table 9.4):** *“How a convex lens forms an image.”*
  - Default **3D Illustrated Book** presentation with an enlarged pop-out optical bench, 3D hinged explanation flap, and interactive page spreads.
  - **Precision 2D / Accessible View** sharing the exact same scientific state and `calculateConvexLens` model.
  - Separate **Secondary Study View** with live step-by-step calculations, NCERT Table 9.4, and one-at-a-time practice questions.

> **Status:** Provisional prototype — educator and curriculum review pending.

## Development & Verification Commands

```bash
npm install
npm run dev        # Start local Vite dev server
npm run typecheck  # TypeScript check (tsc -b --noEmit)
npm run lint       # Static lint check (oxlint)
npm test           # Run Vitest unit & regression test suite (39 tests)
npm run build      # Build production bundle into dist/
```
